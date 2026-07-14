import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  const db = getDb();

  // Ensure table exists
  db.exec(`CREATE TABLE IF NOT EXISTS solicitudes_companero (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_id INTEGER NOT NULL,
    to_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(from_id, to_id)
  )`);

  // Compañeros = mutual friendship
  const compañeros = db.prepare(`
    SELECT u.id, u.username, u.avatar_color, u.avatar_url, u.bio, 'compañero' as tipo
    FROM amigos a
    JOIN usuarios u ON a.amigo_id = u.id
    WHERE a.usuario_id = ?
  `).all(user.id);

  // Seguidos = one-way follow (not mutual)
  const seguidos = db.prepare(`
    SELECT u.id, u.username, u.avatar_color, u.avatar_url, u.bio, 'seguido' as tipo
    FROM seguidos s
    JOIN usuarios u ON s.seguido_id = u.id
    WHERE s.usuario_id = ?
    AND s.seguido_id NOT IN (SELECT amigo_id FROM amigos WHERE usuario_id = ?)
  `).all(user.id, user.id);

  // Pending requests (sent by me)
  const pendingSent = db.prepare(`
    SELECT u.id, u.username, u.avatar_color, u.avatar_url, 'pending_sent' as tipo
    FROM solicitudes_companero s
    JOIN usuarios u ON s.to_id = u.id
    WHERE s.from_id = ? AND s.status = 'pending'
  `).all(user.id);

  // Pending requests (received)
  const pendingReceived = db.prepare(`
    SELECT u.id, u.username, u.avatar_color, u.avatar_url, 'pending_received' as tipo
    FROM solicitudes_companero s
    JOIN usuarios u ON s.from_id = u.id
    WHERE s.to_id = ? AND s.status = 'pending'
  `).all(user.id);

  if (type === "compañeros") return NextResponse.json(compañeros);
  if (type === "seguidos") return NextResponse.json(seguidos);
  if (type === "pending") return NextResponse.json({ sent: pendingSent, received: pendingReceived });

  return NextResponse.json({ compañeros, seguidos, pendingSent, pendingReceived });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { action, username } = await request.json();
  const db = getDb();

  // Ensure table exists
  db.exec(`CREATE TABLE IF NOT EXISTS solicitudes_companero (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_id INTEGER NOT NULL,
    to_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(from_id, to_id)
  )`);

  const target = db.prepare("SELECT id FROM usuarios WHERE username = ?").get(username) as { id: number } | undefined;
  if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  if (target.id === user.id) return NextResponse.json({ error: "No puedes agregarte a ti mismo" }, { status: 400 });

  // Follow (one-way)
  if (action === "follow") {
    db.prepare("INSERT OR IGNORE INTO seguidos (usuario_id, seguido_id) VALUES (?, ?)").run(user.id, target.id);
    return NextResponse.json({ success: true, message: `Ahora sigues a @${username}` });
  }

  // Unfollow
  if (action === "unfollow") {
    db.prepare("DELETE FROM seguidos WHERE usuario_id = ? AND seguido_id = ?").run(user.id, target.id);
    return NextResponse.json({ success: true });
  }

  // Send friend request
  if (action === "request") {
    db.prepare("INSERT OR IGNORE INTO solicitudes_companero (from_id, to_id, status) VALUES (?, ?, 'pending')").run(user.id, target.id);
    return NextResponse.json({ success: true, message: `Solicitud enviada a @${username}` });
  }

  // Accept friend request
  if (action === "accept") {
    // Check there's a pending request from target to me
    const req = db.prepare("SELECT id FROM solicitudes_companero WHERE from_id = ? AND to_id = ? AND status = 'pending'").get(target.id, user.id);
    if (!req) return NextResponse.json({ error: "No hay solicitud pendiente" }, { status: 400 });

    // Accept: create mutual friendship
    db.prepare("INSERT OR IGNORE INTO amigos (usuario_id, amigo_id) VALUES (?, ?)").run(user.id, target.id);
    db.prepare("INSERT OR IGNORE INTO amigos (usuario_id, amigo_id) VALUES (?, ?)").run(target.id, user.id);
    // Update request status
    db.prepare("UPDATE solicitudes_companero SET status = 'accepted' WHERE from_id = ? AND to_id = ?").run(target.id, user.id);
    // Remove from seguidos if was following
    db.prepare("DELETE FROM seguidos WHERE usuario_id = ? AND seguido_id = ?").run(user.id, target.id);
    db.prepare("DELETE FROM seguidos WHERE usuario_id = ? AND seguido_id = ?").run(target.id, user.id);

    return NextResponse.json({ success: true, message: `@${username} ahora es tu compañero` });
  }

  // Reject friend request
  if (action === "reject") {
    db.prepare("DELETE FROM solicitudes_companero WHERE from_id = ? AND to_id = ?").run(target.id, user.id);
    return NextResponse.json({ success: true });
  }

  // Remove compañero
  if (action === "remove") {
    db.prepare("DELETE FROM amigos WHERE usuario_id = ? AND amigo_id = ?").run(user.id, target.id);
    db.prepare("DELETE FROM amigos WHERE usuario_id = ? AND amigo_id = ?").run(target.id, user.id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
