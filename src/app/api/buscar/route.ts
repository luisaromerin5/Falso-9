import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const year = searchParams.get("year") || "";

  const db = getDb();

  let query = `
    SELECT 
      p.*,
      el.nombre as equipo_local,
      el.logo_url as logo_local,
      ev.nombre as equipo_visitante,
      ev.logo_url as logo_visitante,
      c.nombre as competicion,
      c.pais as competicion_pais,
      COALESCE(AVG(cal.general), 0) as promedio_general,
      COUNT(cal.id) as total_votos
    FROM partidos p
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    LEFT JOIN competiciones c ON p.competicion_id = c.id
    LEFT JOIN calificaciones cal ON cal.partido_id = p.id
    WHERE 1=1
  `;

  const params: string[] = [];

  if (q.length >= 2) {
    // Special case: "La Liga" should only match Spain's La Liga, not "Copa De La Liga" etc
    if (q === "la liga") {
      query += ` AND c.nombre = 'La Liga'`;
    } else {
      query += ` AND (el.nombre LIKE ? OR ev.nombre LIKE ? OR c.nombre LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
  }

  if (year) {
    query += ` AND p.fecha LIKE ?`;
    params.push(`${year}%`);
  }

  query += ` GROUP BY p.id ORDER BY p.fecha DESC LIMIT 50`;

  const partidos = db.prepare(query).all(...params);

  return NextResponse.json(partidos);
}
