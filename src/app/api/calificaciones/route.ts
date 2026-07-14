import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CalificacionInput } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: CalificacionInput = await request.json();
  const user = await getCurrentUser();

  // Use authenticated username if available, fall back to body.usuario
  const username = user?.username || body.usuario;

  if (!body.partido_id || !username || !body.general) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: partido_id, usuario, general" },
      { status: 400 }
    );
  }

  if (body.general < 0.5 || body.general > 10) {
    return NextResponse.json(
      { error: "La calificación general debe estar entre 0.5 y 10" },
      { status: 400 }
    );
  }

  const db = getDb();

  const partido = db.prepare("SELECT id FROM partidos WHERE id = ?").get(body.partido_id);
  if (!partido) {
    return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO calificaciones (partido_id, usuario_id, usuario, emocion, calidad, arbitraje, general, comentario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(partido_id, usuario) DO UPDATE SET
        emocion = excluded.emocion,
        calidad = excluded.calidad,
        arbitraje = excluded.arbitraje,
        general = excluded.general,
        comentario = excluded.comentario,
        created_at = datetime('now')
    `);

    stmt.run(
      body.partido_id,
      user?.id || null,
      username,
      body.emocion || null,
      body.calidad || null,
      body.arbitraje || null,
      body.general,
      body.comentario || null
    );

    // Auto-add to diary as "watched"
    if (user) {
      db.prepare(`
        INSERT INTO diario (usuario_id, partido_id, visto, quiero_ver)
        VALUES (?, ?, 1, 0)
        ON CONFLICT(usuario_id, partido_id) DO UPDATE SET visto = 1
      `).run(user.id, body.partido_id);
    }

    return NextResponse.json({ success: true, message: "Review guardada" });
  } catch {
    return NextResponse.json(
      { error: "Error al guardar la calificación" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const partidoId = searchParams.get("partido_id");

  if (!partidoId) {
    return NextResponse.json({ error: "partido_id es requerido" }, { status: 400 });
  }

  const db = getDb();
  const calificaciones = db.prepare(
    "SELECT * FROM calificaciones WHERE partido_id = ? ORDER BY created_at DESC"
  ).all(Number(partidoId));

  return NextResponse.json(calificaciones);
}
