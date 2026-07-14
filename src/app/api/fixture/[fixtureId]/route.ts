import { fetchLineups, fetchEvents, fetchStatistics } from "@/lib/football-api";
import { NextResponse } from "next/server";

// Obtener info detallada de un partido desde API-Football
// Se usa el fixture_id de la API externa
export async function GET(
  request: Request,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params;
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API_FOOTBALL_KEY no configurada" },
      { status: 500 }
    );
  }

  try {
    const [lineups, events, statistics] = await Promise.all([
      fetchLineups(Number(fixtureId)),
      fetchEvents(Number(fixtureId)),
      fetchStatistics(Number(fixtureId)),
    ]);

    return NextResponse.json({
      fixtureId: Number(fixtureId),
      lineups,
      events,
      statistics,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener datos" },
      { status: 500 }
    );
  }
}
