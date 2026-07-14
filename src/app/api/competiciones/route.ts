import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = getDb();
  const competiciones = db.prepare("SELECT * FROM competiciones ORDER BY nombre").all();
  return NextResponse.json(competiciones);
}
