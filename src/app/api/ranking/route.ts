import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = getDb();

  const topPartidos = db.prepare(`
    SELECT 
      p.*,
      el.nombre as equipo_local,
      ev.nombre as equipo_visitante,
      c.nombre as competicion,
      AVG(cal.general) as promedio_general,
      COUNT(cal.id) as total_votos
    FROM partidos p
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    LEFT JOIN competiciones c ON p.competicion_id = c.id
    JOIN calificaciones cal ON cal.partido_id = p.id
    GROUP BY p.id
    HAVING total_votos >= 2
    ORDER BY promedio_general DESC
    LIMIT 10
  `).all();

  return NextResponse.json(topPartidos);
}
