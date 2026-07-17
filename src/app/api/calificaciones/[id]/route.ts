import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const db = getDb();

  // Verify ownership
  const review = db.prepare("SELECT * FROM calificaciones WHERE id = ?").get(Number(id)) as any;
  if (!review) return NextResponse.json({ error: "Review no encontrada" }, { status: 404 });
  if (review.usuario_id !== user.id) return NextResponse.json({ error: "No puedes editar esta review" }, { status: 403 });

  // Update
  db.prepare(`
    UPDATE calificaciones SET
      general = COALESCE(?, general),
      emocion = COALESCE(?, emocion),
      calidad = COALESCE(?, calidad),
      arbitraje = COALESCE(?, arbitraje),
      comentario = COALESCE(?, comentario)
    WHERE id = ?
  `).run(body.general || null, body.emocion || null, body.calidad || null, body.arbitraje || null, body.comentario !== undefined ? body.comentario : null, Number(id));

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const db = getDb();

  // Verify ownership
  const review = db.prepare("SELECT * FROM calificaciones WHERE id = ?").get(Number(id)) as any;
  if (!review) return NextResponse.json({ error: "Review no encontrada" }, { status: 404 });
  if (review.usuario_id !== user.id) return NextResponse.json({ error: "No puedes borrar esta review" }, { status: 403 });

  db.prepare("DELETE FROM calificaciones WHERE id = ?").run(Number(id));

  return NextResponse.json({ success: true });
}
