import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const db = getDb();

  const users = db.prepare(`
    SELECT id, username, avatar_color, avatar_url, bio
    FROM usuarios
    WHERE username LIKE ? AND id != ?
    LIMIT 10
  `).all(`%${query}%`, user.id);

  // Check which ones are friends
  const friends = db.prepare(
    "SELECT amigo_id FROM amigos WHERE usuario_id = ?"
  ).all(user.id) as { amigo_id: number }[];
  const friendIds = new Set(friends.map((f) => f.amigo_id));

  // Check which ones are followed
  const following = db.prepare(
    "SELECT seguido_id FROM seguidos WHERE usuario_id = ?"
  ).all(user.id) as { seguido_id: number }[];
  const followingIds = new Set(following.map((f) => f.seguido_id));

  // Check pending requests
  db.exec(`CREATE TABLE IF NOT EXISTS solicitudes_companero (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_id INTEGER NOT NULL,
    to_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(from_id, to_id)
  )`);

  const pendingSent = db.prepare(
    "SELECT to_id FROM solicitudes_companero WHERE from_id = ? AND status = 'pending'"
  ).all(user.id) as { to_id: number }[];
  const pendingIds = new Set(pendingSent.map((p) => p.to_id));

  const result = (users as Array<{ id: number; username: string; avatar_color: string; avatar_url: string | null; bio: string | null }>).map((u) => ({
    ...u,
    isFriend: friendIds.has(u.id),
    isFollowing: followingIds.has(u.id),
    isPending: pendingIds.has(u.id),
  }));

  return NextResponse.json(result);
}
