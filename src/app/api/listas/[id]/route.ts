import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const list = db.prepare(`
    SELECT l.*, u.username, u.avatar_color
    FROM listas l
    JOIN usuarios u ON l.usuario_id = u.id
    WHERE l.id = ?
  `).get(Number(id));

  if (!list) {
    return NextResponse.json({ error: "Lista no encontrada" }, { status: 404 });
  }

  const items = db.prepare(`
    SELECT 
      p.*,
      el.nombre as equipo_local,
      el.logo_url as logo_local,
      ev.nombre as equipo_visitante,
      ev.logo_url as logo_visitante,
      c.nombre as competicion
    FROM lista_items li
    JOIN partidos p ON li.partido_id = p.id
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    LEFT JOIN competiciones c ON p.competicion_id = c.id
    WHERE li.lista_id = ?
    ORDER BY li.created_at DESC
  `).all(Number(id));

  return NextResponse.json({ ...list, items });
}
