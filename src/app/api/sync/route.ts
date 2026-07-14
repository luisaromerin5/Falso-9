import { syncLeagueMatches, syncMatchesByDate, LEAGUES } from "@/lib/football-api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API_FOOTBALL_KEY no está configurada" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));

  try {
    // Modo 1: Sincronizar por fecha (trae todos los partidos de ese día)
    if (body.date) {
      const result = await syncMatchesByDate(body.date);
      return NextResponse.json({
        success: true,
        message: `Sincronizados ${result.synced} partidos del ${body.date}`,
        ...result,
      });
    }

    // Modo 2: Sincronizar por liga y temporada
    const leagueId = body.league || LEAGUES.PREMIER_LEAGUE;
    const season = body.season || 2025;
    const result = await syncLeagueMatches(leagueId, season);
    return NextResponse.json({
      success: true,
      message: `Sincronizados ${result.synced} partidos de ${result.total} encontrados`,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al sincronizar" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    leagues: LEAGUES,
    usage: {
      byDate: "POST /api/sync con body: { \"date\": \"2026-07-09\" }",
      byLeague: "POST /api/sync con body: { \"league\": 39, \"season\": 2025 }",
    },
  });
}
