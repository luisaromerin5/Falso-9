import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const competicion = searchParams.get("competicion");
  const equipo = searchParams.get("equipo");
  const orden = searchParams.get("orden") || "fecha_desc";

  const db = getDb();

  let query = `
    SELECT 
      p.*,
      el.nombre as equipo_local,
      el.logo_url as logo_local,
      ev.nombre as equipo_visitante,
      ev.logo_url as logo_visitante,
      c.nombre as competicion,
      COALESCE(AVG(cal.general), 0) as promedio_general,
      COUNT(cal.id) as total_votos
    FROM partidos p
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    LEFT JOIN competiciones c ON p.competicion_id = c.id
    LEFT JOIN calificaciones cal ON cal.partido_id = p.id
  `;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (competicion) {
    conditions.push("p.competicion_id = ?");
    params.push(Number(competicion));
  }

  if (equipo) {
    conditions.push("(p.equipo_local_id = ? OR p.equipo_visitante_id = ?)");
    params.push(Number(equipo), Number(equipo));
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " GROUP BY p.id";

  if (orden === "rating_desc") {
    query += " ORDER BY promedio_general DESC";
  } else if (orden === "rating_asc") {
    query += " ORDER BY promedio_general ASC";
  } else if (orden === "fecha_asc") {
    query += " ORDER BY p.fecha ASC";
  } else {
    query += " ORDER BY p.fecha DESC";
  }

  const partidos = db.prepare(query).all(...params);

  return NextResponse.json(partidos);
}
