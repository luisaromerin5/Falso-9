import { getDb } from "@/lib/db";
import { fetchLineups, fetchEvents, fetchStatistics } from "@/lib/football-api";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const partido = db.prepare(`
    SELECT 
      p.*,
      el.nombre as equipo_local,
      el.logo_url as logo_local,
      ev.nombre as equipo_visitante,
      ev.logo_url as logo_visitante,
      c.nombre as competicion
    FROM partidos p
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    LEFT JOIN competiciones c ON p.competicion_id = c.id
    WHERE p.id = ?
  `).get(Number(id));

  if (!partido) {
    return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
  }

  const calificaciones = db.prepare(`
    SELECT c.*, u.avatar_color, u.avatar_url
    FROM calificaciones c
    LEFT JOIN usuarios u ON c.usuario_id = u.id
    WHERE c.partido_id = ? ORDER BY c.created_at DESC
  `).all(Number(id));

  const promedios = db.prepare(`
    SELECT 
      COALESCE(AVG(emocion), 0) as emocion,
      COALESCE(AVG(calidad), 0) as calidad,
      COALESCE(AVG(arbitraje), 0) as arbitraje,
      COALESCE(AVG(general), 0) as general
    FROM calificaciones WHERE partido_id = ?
  `).get(Number(id));

  // Fetch detailed match info from API if fixture_id exists
  let details = null;
  const p = partido as { fixture_id?: number };
  if (p.fixture_id && process.env.API_FOOTBALL_KEY) {
    try {
      const [lineups, events, statistics] = await Promise.all([
        fetchLineups(p.fixture_id),
        fetchEvents(p.fixture_id),
        fetchStatistics(p.fixture_id),
      ]);
      details = { lineups, events, statistics };
    } catch {
      // If API fails, just return without details
      details = null;
    }
  }

  return NextResponse.json({
    ...partido,
    calificaciones,
    promedios,
    details,
  });
}
