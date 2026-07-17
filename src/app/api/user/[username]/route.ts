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
      el.logo_url as logo_local, ev.logo_url as logo_visitante,
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
      (SELECT COUNT(*) FROM diario WHERE usuario_id = ? AND visto = 1) as vistos,
      (SELECT COUNT(*) FROM diario WHERE usuario_id = ? AND quiero_ver = 1) as watchlist,
      (SELECT COUNT(*) FROM amigos WHERE usuario_id = ?) as amigos,
      (SELECT COUNT(*) FROM seguidos WHERE usuario_id = ?) as seguidos
  `).get(user.id, user.id, user.id, user.id, user.id) as any;

  // Get compañeros list
  const companeros = db.prepare(`
    SELECT u.id, u.username, u.avatar_color, u.avatar_url
    FROM amigos a
    JOIN usuarios u ON a.amigo_id = u.id
    WHERE a.usuario_id = ?
  `).all(user.id);

  // Get seguidos list
  const seguidos = db.prepare(`
    SELECT u.id, u.username, u.avatar_color, u.avatar_url
    FROM seguidos s
    JOIN usuarios u ON s.seguido_id = u.id
    WHERE s.usuario_id = ?
  `).all(user.id);

  return NextResponse.json({ ...user, reviews, stats, companeros, seguidos });
}
