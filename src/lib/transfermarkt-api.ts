// Transfermarkt Football Data API via RapidAPI
// Docs: https://rapidapi.com/elisbushaj2/api/transfermarkt-football-data-api
// Free: limited requests/day

const API_BASE = "https://transfermarkt-football-data-api.p.rapidapi.com/api/v1";

function getHeaders(): HeadersInit {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) throw new Error("RAPIDAPI_KEY no configurada");
  return {
    "x-rapidapi-key": key,
    "x-rapidapi-host": "transfermarkt-football-data-api.p.rapidapi.com",
    "Content-Type": "application/json",
  };
}

export interface TransfermarktClub {
  id: string;
  name: string;
  image: string;
  league: string;
  marketValue: string;
}

export interface ClubProfile {
  id: string;
  name: string;
  image: string;
  league: { name: string; logo: string };
  stadium: { name: string; capacity: number; image: string };
  marketValue: string;
  squad: { size: number; averageAge: number; foreigners: number };
  historicalData?: {
    titles: Array<{ name: string; count: number }>;
  };
}

// Search for a club by name
export async function searchClub(query: string): Promise<TransfermarktClub[]> {
  const res = await fetch(`${API_BASE}/clubs/search?query=${encodeURIComponent(query)}`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Transfermarkt API error: ${res.status}`);
  const data = await res.json();
  return data.data || data.clubs || data || [];
}

// Get club profile with details
export async function getClubProfile(clubId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/clubs/${clubId}/profile`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Transfermarkt API error: ${res.status}`);
  return await res.json();
}

// Get club's titles/trophies
export async function getClubTitles(clubId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/clubs/${clubId}/titles`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Transfermarkt API error: ${res.status}`);
  return await res.json();
}

// Get club squad/players
export async function getClubSquad(clubId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/clubs/${clubId}/players`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Transfermarkt API error: ${res.status}`);
  return await res.json();
}

// Get club transfers
export async function getClubTransfers(clubId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/clubs/${clubId}/transfers`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Transfermarkt API error: ${res.status}`);
  return await res.json();
}

// Get player profile
export async function searchPlayer(query: string): Promise<any> {
  const res = await fetch(`${API_BASE}/players/search?query=${encodeURIComponent(query)}`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Transfermarkt API error: ${res.status}`);
  return await res.json();
}

export async function getPlayerProfile(playerId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/players/${playerId}/profile`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Transfermarkt API error: ${res.status}`);
  return await res.json();
}

export async function getPlayerMarketValue(playerId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/players/${playerId}/market-value`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Transfermarkt API error: ${res.status}`);
  return await res.json();
}
