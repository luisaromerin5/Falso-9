import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Admin access only - requires secret key in URL
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== "YHLQMDLGyMESSI853$") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = getDb();

  const stats = {
    usuarios: (db.prepare("SELECT COUNT(*) as c FROM usuarios").get() as any).c,
    partidos: (db.prepare("SELECT COUNT(*) as c FROM partidos").get() as any).c,
    calificaciones: (db.prepare("SELECT COUNT(*) as c FROM calificaciones").get() as any).c,
    competiciones: (db.prepare("SELECT COUNT(*) as c FROM competiciones").get() as any).c,
    equipos: (db.prepare("SELECT COUNT(*) as c FROM equipos").get() as any).c,
  };

  return NextResponse.json(stats);
}
