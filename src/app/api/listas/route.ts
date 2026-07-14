import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user");

  const db = getDb();
  const user = await getCurrentUser();

  // If user param specified, get that user's public lists. Otherwise get current user's
  const targetId = userId ? Number(userId) : user?.id;
  if (!targetId) {
    // Get all public lists
    const lists = db.prepare(`
      SELECT l.*, u.username, u.avatar_color, COUNT(li.id) as total_partidos
      FROM listas l
      JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN lista_items li ON li.lista_id = l.id
      GROUP BY l.id
      ORDER BY l.created_at DESC
      LIMIT 20
    `).all();
    return NextResponse.json(lists);
  }

  const lists = db.prepare(`
    SELECT l.*, u.username, u.avatar_color, COUNT(li.id) as total_partidos
    FROM listas l
    JOIN usuarios u ON l.usuario_id = u.id
    LEFT JOIN lista_items li ON li.lista_id = l.id
    WHERE l.usuario_id = ?
    GROUP BY l.id
    ORDER BY l.created_at DESC
  `).all(targetId);

  return NextResponse.json(lists);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { action, nombre, descripcion, lista_id, partido_id } = await request.json();
  const db = getDb();

  if (action === "create") {
    if (!nombre) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

    const result = db.prepare(
      "INSERT INTO listas (usuario_id, nombre, descripcion) VALUES (?, ?, ?)"
    ).run(user.id, nombre, descripcion || null);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  }

  if (action === "add-match") {
    if (!lista_id || !partido_id) {
      return NextResponse.json({ error: "lista_id y partido_id requeridos" }, { status: 400 });
    }

    // Verify list ownership
    const list = db.prepare("SELECT id FROM listas WHERE id = ? AND usuario_id = ?").get(lista_id, user.id);
    if (!list) return NextResponse.json({ error: "Lista no encontrada" }, { status: 404 });

    db.prepare(
      "INSERT OR IGNORE INTO lista_items (lista_id, partido_id) VALUES (?, ?)"
    ).run(lista_id, partido_id);

    return NextResponse.json({ success: true });
  }

  if (action === "remove-match") {
    if (!lista_id || !partido_id) {
      return NextResponse.json({ error: "lista_id y partido_id requeridos" }, { status: 400 });
    }

    db.prepare("DELETE FROM lista_items WHERE lista_id = ? AND partido_id = ?").run(lista_id, partido_id);
    return NextResponse.json({ success: true });
  }

  if (action === "delete") {
    if (!lista_id) return NextResponse.json({ error: "lista_id requerido" }, { status: 400 });
    db.prepare("DELETE FROM lista_items WHERE lista_id = ?").run(lista_id);
    db.prepare("DELETE FROM listas WHERE id = ? AND usuario_id = ?").run(lista_id, user.id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
