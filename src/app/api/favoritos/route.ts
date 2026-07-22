import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const db = getDb();
  db.exec("CREATE TABLE IF NOT EXISTS equipos_favoritos (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL, equipo_id INTEGER NOT NULL, created_at TEXT DEFAULT (datetime('now')), UNIQUE(usuario_id, equipo_id))");

  // Get favorite teams with their info
  const favorites = db.prepare(`
    SELECT e.id, e.nombre, e.logo_url, e.pais
    FROM equipos_favoritos ef
    JOIN equipos e ON ef.equipo_id = e.id
    WHERE ef.usuario_id = ?
  `).all(user.id);

  // Get recent matches from favorite teams
  const favIds = favorites.map((f: any) => f.id);
  let matches: any[] = [];
  if (favIds.length > 0) {
    const placeholders = favIds.map(() => "?").join(",");
    matches = db.prepare(`
      SELECT p.*, el.nombre as equipo_local, el.logo_url as logo_local,
        ev.nombre as equipo_visitante, ev.logo_url as logo_visitante,
        c.nombre as competicion,
        COALESCE(AVG(cal.general), 0) as promedio_general,
        COUNT(cal.id) as total_votos
      FROM partidos p
      JOIN equipos el ON p.equipo_local_id = el.id
      JOIN equipos ev ON p.equipo_visitante_id = ev.id
      LEFT JOIN competiciones c ON p.competicion_id = c.id
      LEFT JOIN calificaciones cal ON cal.partido_id = p.id
      WHERE p.equipo_local_id IN (${placeholders}) OR p.equipo_visitante_id IN (${placeholders})
      GROUP BY p.id
      ORDER BY p.fecha DESC
      LIMIT 20
    `).all(...favIds, ...favIds);
  }

  return NextResponse.json({ favorites, matches });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { action, equipo_id } = await request.json();
  if (!equipo_id) return NextResponse.json({ error: "equipo_id requerido" }, { status: 400 });

  const db = getDb();
  db.exec("CREATE TABLE IF NOT EXISTS equipos_favoritos (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL, equipo_id INTEGER NOT NULL, created_at TEXT DEFAULT (datetime('now')), UNIQUE(usuario_id, equipo_id))");

  if (action === "add") {
    db.prepare("INSERT OR IGNORE INTO equipos_favoritos (usuario_id, equipo_id) VALUES (?, ?)").run(user.id, equipo_id);
    return NextResponse.json({ success: true });
  }

  if (action === "remove") {
    db.prepare("DELETE FROM equipos_favoritos WHERE usuario_id = ? AND equipo_id = ?").run(user.id, equipo_id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
