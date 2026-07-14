import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const db = getDb();

  const user = db.prepare(
    "SELECT id, username, avatar_color, avatar_url, bio FROM usuarios WHERE username = ?"
  ).get(username) as any;

  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const reviews = db.prepare(`
    SELECT c.id, c.partido_id, c.general, c.comentario, c.created_at,
      el.nombre as equipo_local, ev.nombre as equipo_visitante,
      p.goles_local, p.goles_visitante, comp.nombre as competicion
    FROM calificaciones c
    JOIN partidos p ON c.partido_id = p.id
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    LEFT JOIN competiciones comp ON p.competicion_id = comp.id
    WHERE c.usuario_id = ?
    ORDER BY c.created_at DESC
  `).all(user.id);

  const stats = db.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM calificaciones WHERE usuario_id = ?) as reviews,
      (SELECT COUNT(*) FROM diario WHERE usuario_id = ? AND visto = 1) as vistos
  `).get(user.id, user.id) as { reviews: number; vistos: number };

  return NextResponse.json({ ...user, reviews, stats });
}
