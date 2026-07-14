import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const db = getDb();

  // Find users who rated the same matches and compare scores
  const similarities = db.prepare(`
    SELECT 
      u.id,
      u.username,
      u.avatar_color,
      COUNT(*) as partidos_en_comun,
      AVG(ABS(c1.general - c2.general)) as diferencia_promedio,
      GROUP_CONCAT(c1.partido_id) as partido_ids
    FROM calificaciones c1
    JOIN calificaciones c2 ON c1.partido_id = c2.partido_id AND c1.usuario_id != c2.usuario_id
    JOIN usuarios u ON c2.usuario_id = u.id
    WHERE c1.usuario_id = ?
    GROUP BY c2.usuario_id
    HAVING partidos_en_comun >= 1
    ORDER BY diferencia_promedio ASC
    LIMIT 10
  `).all(user.id) as Array<{
    id: number;
    username: string;
    avatar_color: string;
    partidos_en_comun: number;
    diferencia_promedio: number;
    partido_ids: string;
  }>;

  // Calculate compatibility percentage (lower diff = higher compatibility)
  const result = similarities.map((s) => {
    // Max diff is 10, so compatibility = (10 - avg_diff) / 10 * 100
    const compatibility = Math.round(((10 - s.diferencia_promedio) / 10) * 100);
    return {
      ...s,
      compatibility: Math.max(0, Math.min(100, compatibility)),
      partido_ids: s.partido_ids.split(",").map(Number).slice(0, 5),
    };
  });

  return NextResponse.json(result);
}
