import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

// Classic rivals
const CLASICOS = [
  ["Real Madrid", "Barcelona"],
  ["Real Madrid", "Atletico"],
  ["Barcelona", "Atletico"],
  ["Manchester United", "Manchester City"],
  ["Manchester United", "Liverpool"],
  ["Liverpool", "Manchester City"],
  ["Arsenal", "Tottenham"],
  ["AC Milan", "Inter"],
  ["Juventus", "Inter"],
  ["Juventus", "AC Milan"],
  ["Bayern Munich", "Borussia Dortmund"],
  ["PSG", "Olympique Marseille"],
  ["Boca Juniors", "River Plate"],
  ["Flamengo", "Palmeiras"],
  ["Argentina", "Brazil"],
  ["Argentina", "England"],
  ["Argentina", "Germany"],
  ["Brazil", "Germany"],
  ["Spain", "France"],
  ["England", "Germany"],
];

export async function GET() {
  const db = getDb();

  // Top 15 competitions worldwide
  const TOP_COMPETITIONS = new Set([
    "World Cup",
    "Euro Championship",
    "UEFA Champions League",
    "CONMEBOL Libertadores",
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "Serie A",
    "Copa Libertadores",
    "Liga MX",
    "Eredivisie",
    "Primeira Liga",
    "MLS",
    "Copa America",
  ]);

  // Get knockout stage matches (finals, semis, quarters) from top competitions
  const knockoutMatches = db.prepare(`
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
    WHERE (p.penales_local IS NOT NULL OR p.goles_local + p.goles_visitante >= 4)
    GROUP BY p.id
    ORDER BY p.fecha DESC
    LIMIT 100
  `).all() as any[];

  // Filter to only top 15 competitions
  const filteredKnockout = knockoutMatches.filter((p) => {
    const comp = p.competicion || "";
    if (comp === "Premier League" && p.competicion_pais !== "England") return false;
    return TOP_COMPETITIONS.has(comp);
  }).slice(0, 20);

  // Get classic derbies from recent matches
  const allRecent = db.prepare(`
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
    GROUP BY p.id
    ORDER BY p.fecha DESC
    LIMIT 500
  `).all() as any[];

  // Filter for classics (only top 15 competitions)
  const clasicos = allRecent.filter((p) => {
    const comp = (p.competicion || "");
    if (comp === "Premier League" && p.competicion_pais !== "England") return false;
    if (!TOP_COMPETITIONS.has(comp)) return false;
    return CLASICOS.some(([a, b]) =>
      (p.equipo_local.includes(a) && p.equipo_visitante.includes(b)) ||
      (p.equipo_local.includes(b) && p.equipo_visitante.includes(a))
    );
  }).slice(0, 10);

  // Combine and deduplicate
  const seen = new Set<number>();
  const destacados: any[] = [];

  // Add classics first
  for (const p of clasicos) {
    if (!seen.has(p.id)) { seen.add(p.id); destacados.push({ ...p, tag: "Clásico" }); }
  }

  // Add knockout/high-scoring matches
  for (const p of filteredKnockout) {
    if (!seen.has(p.id)) {
      const tag = p.penales_local != null ? "Penales" : "Goleada";
      seen.add(p.id);
      destacados.push({ ...p, tag });
    }
  }

  return NextResponse.json(destacados.slice(0, 15));
}
