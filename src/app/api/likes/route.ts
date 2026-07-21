import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { calificacion_id } = await request.json();
  if (!calificacion_id) return NextResponse.json({ error: "calificacion_id requerido" }, { status: 400 });

  const db = getDb();
  db.exec("CREATE TABLE IF NOT EXISTS likes (id INTEGER PRIMARY KEY AUTOINCREMENT, calificacion_id INTEGER NOT NULL, usuario_id INTEGER NOT NULL, created_at TEXT DEFAULT (datetime('now')), UNIQUE(calificacion_id, usuario_id))");

  // Toggle like
  const existing = db.prepare("SELECT id FROM likes WHERE calificacion_id = ? AND usuario_id = ?").get(calificacion_id, user.id);

  if (existing) {
    db.prepare("DELETE FROM likes WHERE calificacion_id = ? AND usuario_id = ?").run(calificacion_id, user.id);
    return NextResponse.json({ liked: false });
  } else {
    db.prepare("INSERT INTO likes (calificacion_id, usuario_id) VALUES (?, ?)").run(calificacion_id, user.id);
    return NextResponse.json({ liked: true });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const partidoId = searchParams.get("partido_id");
  const user = await getCurrentUser();

  if (!partidoId) return NextResponse.json({});

  const db = getDb();
  db.exec("CREATE TABLE IF NOT EXISTS likes (id INTEGER PRIMARY KEY AUTOINCREMENT, calificacion_id INTEGER NOT NULL, usuario_id INTEGER NOT NULL, created_at TEXT DEFAULT (datetime('now')), UNIQUE(calificacion_id, usuario_id))");

  // Get like counts for all reviews of this match
  const counts = db.prepare(`
    SELECT calificacion_id, COUNT(*) as count
    FROM likes
    WHERE calificacion_id IN (SELECT id FROM calificaciones WHERE partido_id = ?)
    GROUP BY calificacion_id
  `).all(Number(partidoId)) as { calificacion_id: number; count: number }[];

  // Get user's likes
  let userLikes: number[] = [];
  if (user) {
    const liked = db.prepare(`
      SELECT calificacion_id FROM likes
      WHERE usuario_id = ? AND calificacion_id IN (SELECT id FROM calificaciones WHERE partido_id = ?)
    `).all(user.id, Number(partidoId)) as { calificacion_id: number }[];
    userLikes = liked.map((l) => l.calificacion_id);
  }

  return NextResponse.json({ counts, userLikes });
}
