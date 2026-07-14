import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

const API_BASE = "https://v3.football.api-sports.io";

function getHeaders(): HeadersInit {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) throw new Error("API_FOOTBALL_KEY no configurada");
  return { "x-apisports-key": key };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") || "info"; // info, squad, stats
  const db = getDb();

  // Get team from local DB
  const equipo = db.prepare("SELECT * FROM equipos WHERE id = ?").get(Number(id)) as {
    id: number; nombre: string; logo_url: string; pais: string;
  } | undefined;

  if (!equipo) {
    return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 });
  }

  // Get local matches
  const partidos = db.prepare(`
    SELECT p.*, 
      el.nombre as equipo_local, el.logo_url as logo_local,
      ev.nombre as equipo_visitante, ev.logo_url as logo_visitante,
      c.nombre as competicion,
      COALESCE(AVG(cal.general), 0) as promedio_general,
      COUNT(cal.id) as total_votos
    FROM partidos p
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    LEFT JOIN competiciones c ON p.competicion_id = c.id
    LEFT JOIN calificaciones cal ON cal.partido_id = p.id
    WHERE p.equipo_local_id = ? OR p.equipo_visitante_id = ?
    GROUP BY p.id
    ORDER BY p.fecha DESC
  `).all(Number(id), Number(id));

  // Calculate stats from matches
  let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;
  for (const p of partidos as any[]) {
    const isHome = p.equipo_local_id === Number(id);
    const gf = isHome ? p.goles_local : p.goles_visitante;
    const ga = isHome ? p.goles_visitante : p.goles_local;
    goalsFor += gf;
    goalsAgainst += ga;
    if (gf > ga) wins++;
    else if (gf === ga) draws++;
    else losses++;
  }

  const result: any = {
    equipo,
    stats: {
      matches: partidos.length,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      winRate: partidos.length > 0 ? Math.round((wins / partidos.length) * 100) : 0,
    },
    partidos: partidos.slice(0, 20),
  };

  // Fetch squad from API if requested
  if (tab === "squad" && process.env.API_FOOTBALL_KEY) {
    try {
      // Search team ID in API by name
      const searchRes = await fetch(
        `${API_BASE}/teams?search=${encodeURIComponent(equipo.nombre)}`,
        { headers: getHeaders() }
      );
      const searchData = await searchRes.json();

      if (searchData.response && searchData.response.length > 0) {
        const apiTeam = searchData.response[0].team;
        const venue = searchData.response[0].venue;

        // Get squad
        const squadRes = await fetch(
          `${API_BASE}/players/squads?team=${apiTeam.id}`,
          { headers: getHeaders() }
        );
        const squadData = await squadRes.json();

        result.apiTeam = {
          id: apiTeam.id,
          name: apiTeam.name,
          logo: apiTeam.logo,
          founded: apiTeam.founded,
          country: apiTeam.country,
        };
        result.venue = venue;
        result.squad = squadData.response?.[0]?.players || [];
      }
    } catch {
      // API call failed, continue without squad
    }
  }

  return NextResponse.json(result);
}
