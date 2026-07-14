import { searchClub, getClubProfile, getClubTitles, getClubTransfers } from "@/lib/transfermarkt-api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const clubId = searchParams.get("id");
  const action = searchParams.get("action") || "search";

  if (!process.env.RAPIDAPI_KEY) {
    return NextResponse.json({ error: "RAPIDAPI_KEY no configurada" }, { status: 500 });
  }

  try {
    if (action === "search" && query) {
      const results = await searchClub(query);
      return NextResponse.json(results);
    }

    if (action === "profile" && clubId) {
      const profile = await getClubProfile(clubId);
      return NextResponse.json(profile);
    }

    if (action === "titles" && clubId) {
      const titles = await getClubTitles(clubId);
      return NextResponse.json(titles);
    }

    if (action === "transfers" && clubId) {
      const transfers = await getClubTransfers(clubId);
      return NextResponse.json(transfers);
    }

    return NextResponse.json({ error: "Parámetros inválidos. Usa ?action=search&q=Barcelona o ?action=titles&id=131" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al consultar Transfermarkt" },
      { status: 500 }
    );
  }
}
