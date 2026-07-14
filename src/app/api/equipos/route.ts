import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = getDb();
  const equipos = db.prepare("SELECT * FROM equipos ORDER BY nombre").all();
  return NextResponse.json(equipos);
}
