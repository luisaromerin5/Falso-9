import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const calificacionId = searchParams.get("calificacion_id");

  if (!calificacionId) return NextResponse.json([]);

  const db = getDb();
  db.exec("CREATE TABLE IF NOT EXISTS respuestas (id INTEGER PRIMARY KEY AUTOINCREMENT, calificacion_id INTEGER NOT NULL, usuario_id INTEGER NOT NULL, usuario TEXT NOT NULL, mensaje TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))");

  const replies = db.prepare(`
    SELECT r.*, u.avatar_color, u.avatar_url
    FROM respuestas r
    LEFT JOIN usuarios u ON r.usuario_id = u.id
    WHERE r.calificacion_id = ?
    ORDER BY r.created_at ASC
  `).all(Number(calificacionId));

  return NextResponse.json(replies);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { calificacion_id, mensaje } = await request.json();
  if (!calificacion_id || !mensaje?.trim()) {
    return NextResponse.json({ error: "calificacion_id y mensaje requeridos" }, { status: 400 });
  }

  const db = getDb();
  db.exec("CREATE TABLE IF NOT EXISTS respuestas (id INTEGER PRIMARY KEY AUTOINCREMENT, calificacion_id INTEGER NOT NULL, usuario_id INTEGER NOT NULL, usuario TEXT NOT NULL, mensaje TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))");

  db.prepare(
    "INSERT INTO respuestas (calificacion_id, usuario_id, usuario, mensaje) VALUES (?, ?, ?, ?)"
  ).run(calificacion_id, user.id, user.username, mensaje.trim());

  return NextResponse.json({ success: true });
}
