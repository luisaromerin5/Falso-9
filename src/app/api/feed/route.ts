import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const db = getDb();

  // Get recent reviews from compañeros AND seguidos
  const feed = db.prepare(`
    SELECT 
      c.id,
      c.partido_id,
      c.usuario,
      c.general,
      c.emocion,
      c.calidad,
      c.arbitraje,
      c.comentario,
      c.created_at,
      u.avatar_color,
      CASE 
        WHEN a.id IS NOT NULL THEN 'compañero'
        ELSE 'seguido'
      END as relacion,
      p.goles_local,
      p.goles_visitante,
      p.fecha,
      el.nombre as equipo_local,
      el.logo_url as logo_local,
      ev.nombre as equipo_visitante,
      ev.logo_url as logo_visitante,
      comp.nombre as competicion
    FROM calificaciones c
    JOIN usuarios u ON c.usuario_id = u.id
    JOIN partidos p ON c.partido_id = p.id
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    LEFT JOIN competiciones comp ON p.competicion_id = comp.id
    LEFT JOIN amigos a ON a.amigo_id = u.id AND a.usuario_id = ?
    LEFT JOIN seguidos s ON s.seguido_id = u.id AND s.usuario_id = ?
    WHERE a.id IS NOT NULL OR s.id IS NOT NULL
    ORDER BY c.created_at DESC
    LIMIT 30
  `).all(user.id, user.id);

  return NextResponse.json(feed);
}
