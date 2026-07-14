// API-Sports (api-football.com) - Free tier: 100 requests/day
// Docs: https://www.api-football.com/documentation-v3

const API_BASE = "https://v3.football.api-sports.io";

function getHeaders(): HeadersInit {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) throw new Error("API_FOOTBALL_KEY no configurada");
  return {
    "x-apisports-key": key,
  };
}

// --- Types ---

export interface APIMatch {
  fixture: {
    id: number;
    date: string;
    venue: { name: string; city: string };
    referee: string | null;
    status: { short: string; long: string };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface APILineup {
  team: { id: number; name: string; logo: string };
  formation: string;
  startXI: Array<{ player: { id: number; name: string; number: number; pos: string } }>;
  substitutes: Array<{ player: { id: number; name: string; number: number; pos: string } }>;
}

export interface APIEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: string; // Goal, Card, subst, Var
  detail: string; // Normal Goal, Yellow Card, Red Card, Substitution 1, etc.
}

export interface APIStatistic {
  team: { id: number; name: string; logo: string };
  statistics: Array<{ type: string; value: string | number | null }>;
}

// --- Fetch functions ---

export async function fetchMatchesByDate(
  date: string // YYYY-MM-DD
): Promise<APIMatch[]> {
  const res = await fetch(`${API_BASE}/fixtures?date=${date}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(JSON.stringify(data.errors));
  }
  return data.response;
}

export async function fetchMatchesByLeague(
  leagueId: number,
  season: number = 2024,
  daysBack: number = 60
): Promise<APIMatch[]> {
  // Para la temporada actual usa rango de fechas, para temporadas pasadas trae todo
  const currentYear = new Date().getFullYear();
  let url = `${API_BASE}/fixtures?league=${leagueId}&season=${season}`;

  if (season >= currentYear - 1) {
    const today = new Date();
    const fromDate = new Date(today.getTime() - daysBack * 24 * 60 * 60 * 1000);
    const from = fromDate.toISOString().split("T")[0];
    const to = today.toISOString().split("T")[0];
    url += `&from=${from}&to=${to}`;
  }

  const res = await fetch(url, { headers: getHeaders() });
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(JSON.stringify(data.errors));
  }
  return data.response;
}

export async function fetchMatchDetail(fixtureId: number): Promise<APIMatch> {
  const res = await fetch(`${API_BASE}/fixtures?id=${fixtureId}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(JSON.stringify(data.errors));
  }
  return data.response[0];
}

export async function fetchLineups(fixtureId: number): Promise<APILineup[]> {
  const res = await fetch(`${API_BASE}/fixtures/lineups?fixture=${fixtureId}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  return data.response;
}

export async function fetchEvents(fixtureId: number): Promise<APIEvent[]> {
  const res = await fetch(`${API_BASE}/fixtures/events?fixture=${fixtureId}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  return data.response;
}

export async function fetchStatistics(fixtureId: number): Promise<APIStatistic[]> {
  const res = await fetch(`${API_BASE}/fixtures/statistics?fixture=${fixtureId}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  return data.response;
}

// --- Sync to DB ---

export async function syncMatchesByDate(date: string) {
  const { getDb } = await import("./db");
  const db = getDb();

  const matches = await fetchMatchesByDate(date);
  return syncMatchesArray(db, matches);
}

export async function syncLeagueMatches(leagueId: number, season: number = 2024) {
  const { getDb } = await import("./db");
  const db = getDb();

  const matches = await fetchMatchesByLeague(leagueId, season);
  return syncMatchesArray(db, matches);
}

function syncMatchesArray(db: any, matches: APIMatch[]) {
  const upsertEquipo = db.prepare(`
    INSERT INTO equipos (nombre, pais, logo_url)
    VALUES (?, ?, ?)
    ON CONFLICT(nombre) DO UPDATE SET logo_url = excluded.logo_url
  `);

  const findEquipo = db.prepare("SELECT id FROM equipos WHERE nombre = ?");
  const findCompeticion = db.prepare("SELECT id FROM competiciones WHERE nombre = ?");
  const upsertCompeticion = db.prepare(`
    INSERT INTO competiciones (nombre, pais, temporada)
    VALUES (?, ?, ?)
    ON CONFLICT(nombre, pais) DO UPDATE SET temporada = excluded.temporada
  `);

  const upsertPartido = db.prepare(`
    INSERT INTO partidos (fixture_id, equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, penales_local, penales_visitante, competicion_id, fecha, estadio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(fixture_id) DO UPDATE SET
      penales_local = excluded.penales_local,
      penales_visitante = excluded.penales_visitante,
      goles_local = excluded.goles_local,
      goles_visitante = excluded.goles_visitante
  `);

  let synced = 0;

  for (const match of matches) {
    if (match.fixture.status.short !== "FT" && match.fixture.status.short !== "AET" && match.fixture.status.short !== "PEN") continue;
    if (match.goals.home === null) continue;

    upsertEquipo.run(match.teams.home.name, match.league.country, match.teams.home.logo);
    upsertEquipo.run(match.teams.away.name, match.league.country, match.teams.away.logo);
    upsertCompeticion.run(match.league.name, match.league.country, String(new Date(match.fixture.date).getFullYear()));

    const localId = (findEquipo.get(match.teams.home.name) as { id: number })?.id;
    const visitanteId = (findEquipo.get(match.teams.away.name) as { id: number })?.id;
    const competicionId = (findCompeticion.get(match.league.name) as { id: number })?.id;

    if (localId && visitanteId) {
      const fecha = match.fixture.date.split("T")[0];
      const estadio = match.fixture.venue.name
        ? `${match.fixture.venue.name}, ${match.fixture.venue.city}`
        : "Estadio no disponible";

      const penHome = match.score?.penalty?.home || null;
      const penAway = match.score?.penalty?.away || null;

      upsertPartido.run(
        match.fixture.id,
        localId, visitanteId,
        match.goals.home, match.goals.away,
        penHome, penAway,
        competicionId || null,
        fecha, estadio
      );
      synced++;
    }
  }

  return { synced, total: matches.length };
}

// IDs de ligas populares en API-Football
export const LEAGUES = {
  PREMIER_LEAGUE: 39,
  LA_LIGA: 140,
  SERIE_A: 135,
  BUNDESLIGA: 78,
  LIGUE_1: 61,
  CHAMPIONS_LEAGUE: 2,
  COPA_LIBERTADORES: 13,
  LIGA_MX: 262,
  MLS: 253,
  WORLD_CUP: 1,
} as const;
