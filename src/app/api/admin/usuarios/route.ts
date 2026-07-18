import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

const ADMIN_KEY = process.env.ADMIN_KEY!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = getDb();

  const usuarios = db.prepare(`
    SELECT id, username, email, avatar_color, avatar_url, bio, created_at,
      (SELECT COUNT(*) FROM calificaciones WHERE usuario_id = usuarios.id) as reviews,
      (SELECT COUNT(*) FROM diario WHERE usuario_id = usuarios.id AND visto = 1) as vistos,
      (SELECT COUNT(*) FROM amigos WHERE usuario_id = usuarios.id) as companeros,
      (SELECT COUNT(*) FROM seguidos WHERE usuario_id = usuarios.id) as seguidos
    FROM usuarios
    ORDER BY created_at DESC
  `).all();

  const stats = {
    totalUsuarios: usuarios.length,
    totalPartidos: (db.prepare("SELECT COUNT(*) as c FROM partidos").get() as any).c,
    totalReviews: (db.prepare("SELECT COUNT(*) as c FROM calificaciones").get() as any).c,
    totalRespuestas: 0,
  };

  try {
    stats.totalRespuestas = (db.prepare("SELECT COUNT(*) as c FROM respuestas").get() as any).c;
  } catch {}

  return NextResponse.json({ stats, usuarios });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const userId = searchParams.get("userId");

  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  }

  const db = getDb();

  // Delete all user data
  db.prepare("DELETE FROM calificaciones WHERE usuario_id = ?").run(Number(userId));
  db.prepare("DELETE FROM diario WHERE usuario_id = ?").run(Number(userId));
  db.prepare("DELETE FROM amigos WHERE usuario_id = ?").run(Number(userId));
  db.prepare("DELETE FROM amigos WHERE amigo_id = ?").run(Number(userId));
  db.prepare("DELETE FROM seguidos WHERE usuario_id = ?").run(Number(userId));
  db.prepare("DELETE FROM seguidos WHERE seguido_id = ?").run(Number(userId));
  try { db.prepare("DELETE FROM solicitudes_companero WHERE from_id = ? OR to_id = ?").run(Number(userId), Number(userId)); } catch {}
  try { db.prepare("DELETE FROM game_scores WHERE usuario_id = ?").run(Number(userId)); } catch {}
  try { db.prepare("DELETE FROM respuestas WHERE usuario_id = ?").run(Number(userId)); } catch {}
  db.prepare("DELETE FROM usuarios WHERE id = ?").run(Number(userId));

  return NextResponse.json({ success: true, message: "Usuario eliminado" });
}
