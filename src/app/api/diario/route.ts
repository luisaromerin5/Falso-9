import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const db = getDb();

  const diary = db.prepare(`
    SELECT 
      d.*,
      p.fecha,
      p.goles_local,
      p.goles_visitante,
      p.estadio,
      el.nombre as equipo_local,
      el.logo_url as logo_local,
      ev.nombre as equipo_visitante,
      ev.logo_url as logo_visitante,
      c.nombre as competicion,
      cal.general as mi_calificacion,
      cal.comentario as mi_comentario
    FROM diario d
    JOIN partidos p ON d.partido_id = p.id
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    LEFT JOIN competiciones c ON p.competicion_id = c.id
    LEFT JOIN calificaciones cal ON cal.partido_id = p.id AND cal.usuario_id = ?
    WHERE d.usuario_id = ?
    ORDER BY d.created_at DESC
  `).all(user.id, user.id);

  return NextResponse.json(diary);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { partido_id, visto, quiero_ver } = await request.json();

  if (!partido_id) {
    return NextResponse.json({ error: "partido_id requerido" }, { status: 400 });
  }

  const db = getDb();

  db.prepare(`
    INSERT INTO diario (usuario_id, partido_id, visto, quiero_ver)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(usuario_id, partido_id) DO UPDATE SET
      visto = excluded.visto,
      quiero_ver = excluded.quiero_ver
  `).run(user.id, partido_id, visto ? 1 : 0, quiero_ver ? 1 : 0);

  return NextResponse.json({ success: true });
}
