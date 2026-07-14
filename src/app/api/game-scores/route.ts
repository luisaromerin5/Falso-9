import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { game, score, date } = await request.json();
  if (!game || score === undefined) {
    return NextResponse.json({ error: "game y score requeridos" }, { status: 400 });
  }

  const db = getDb();
  const today = date || new Date().toISOString().split("T")[0];

  // Upsert - save best score per user per game per day
  db.prepare(`
    INSERT INTO game_scores (usuario_id, game, score, fecha)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(usuario_id, game, fecha) DO UPDATE SET
      score = MAX(excluded.score, game_scores.score)
  `).run(user.id, game, score, today);

  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const game = searchParams.get("game");
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const db = getDb();

  // Get scores from compañeros + seguidos + self for today
  const scores = db.prepare(`
    SELECT 
      gs.score,
      gs.fecha,
      u.id as user_id,
      u.username,
      u.avatar_color,
      u.avatar_url
    FROM game_scores gs
    JOIN usuarios u ON gs.usuario_id = u.id
    WHERE gs.game = ?
    AND gs.fecha = ?
    AND (
      u.id = ?
      OR u.id IN (SELECT amigo_id FROM amigos WHERE usuario_id = ?)
      OR u.id IN (SELECT seguido_id FROM seguidos WHERE usuario_id = ?)
    )
    ORDER BY gs.score DESC
  `).all(game, date, user.id, user.id, user.id);

  // Also get user's all-time best
  const bestScore = db.prepare(`
    SELECT MAX(score) as best FROM game_scores WHERE usuario_id = ? AND game = ?
  `).get(user.id, game) as { best: number | null };

  return NextResponse.json({ scores, bestScore: bestScore?.best || 0 });
}
