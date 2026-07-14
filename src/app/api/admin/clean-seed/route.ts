import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

// DELETE /api/admin/clean-seed - Remove fake seed data
export async function DELETE() {
  const db = getDb();
  
  // Delete ratings for seed matches (IDs 1-8)
  db.prepare("DELETE FROM calificaciones WHERE partido_id <= 8").run();
  
  // Delete seed matches
  db.prepare("DELETE FROM partidos WHERE id <= 8").run();
  
  // Clean up orphan teams/competitions that have no matches
  db.prepare(`
    DELETE FROM equipos WHERE id NOT IN (
      SELECT equipo_local_id FROM partidos
      UNION
      SELECT equipo_visitante_id FROM partidos
    )
  `).run();
  
  db.prepare(`
    DELETE FROM competiciones WHERE id NOT IN (
      SELECT DISTINCT competicion_id FROM partidos WHERE competicion_id IS NOT NULL
    )
  `).run();

  const remaining = db.prepare("SELECT COUNT(*) as c FROM partidos").get() as { c: number };
  
  return NextResponse.json({
    success: true,
    message: `Datos de ejemplo eliminados. Quedan ${remaining.c} partidos reales.`,
  });
}
