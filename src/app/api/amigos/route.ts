import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all"; // all, compañeros, seguidos

  const db = getDb();

  // Compañeros = mutual friendship
  const compañeros = db.prepare(`
    SELECT u.id, u.username, u.avatar_color, u.bio, 'compañero' as tipo
    FROM amigos a
    JOIN usuarios u ON a.amigo_id = u.id
    WHERE a.usuario_id = ?
  `).all(user.id);

  // Seguidos = one-way follow (not mutual)
  const seguidos = db.prepare(`
    SELECT u.id, u.username, u.avatar_color, u.bio, 'seguido' as tipo
    FROM seguidos s
    JOIN usuarios u ON s.seguido_id = u.id
    WHERE s.usuario_id = ?
    AND s.seguido_id NOT IN (SELECT amigo_id FROM amigos WHERE usuario_id = ?)
  `).all(user.id, user.id);

  if (type === "compañeros") return NextResponse.json(compañeros);
  if (type === "seguidos") return NextResponse.json(seguidos);

  return NextResponse.json({ compañeros, seguidos });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { action, username } = await request.json();
  const db = getDb();

  const target = db.prepare("SELECT id FROM usuarios WHERE username = ?").get(username) as { id: number } | undefined;
  if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  if (target.id === user.id) return NextResponse.json({ error: "No puedes agregarte a ti mismo" }, { status: 400 });

  // Add as compañero (mutual)
  if (action === "add") {
    db.prepare("INSERT OR IGNORE INTO amigos (usuario_id, amigo_id) VALUES (?, ?)").run(user.id, target.id);
    db.prepare("INSERT OR IGNORE INTO amigos (usuario_id, amigo_id) VALUES (?, ?)").run(target.id, user.id);
    // Remove from seguidos if was following
    db.prepare("DELETE FROM seguidos WHERE usuario_id = ? AND seguido_id = ?").run(user.id, target.id);
    return NextResponse.json({ success: true, message: `@${username} es ahora tu compañero` });
  }

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

  // Remove compañero
  if (action === "remove") {
    db.prepare("DELETE FROM amigos WHERE usuario_id = ? AND amigo_id = ?").run(user.id, target.id);
    db.prepare("DELETE FROM amigos WHERE usuario_id = ? AND amigo_id = ?").run(target.id, user.id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
