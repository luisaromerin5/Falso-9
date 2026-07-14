import { register, login, createToken, getCurrentUser, getTokenName } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { action, username, password, email } = body;

  try {
    if (action === "register") {
      const user = await register(username, password, email);
      const token = createToken(user);

      const response = NextResponse.json({ success: true, user });
      response.cookies.set(getTokenName(), token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
      return response;
    }

    if (action === "login") {
      const user = await login(username, password);
      const token = createToken(user);

      const response = NextResponse.json({ success: true, user });
      response.cookies.set(getTokenName(), token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete(getTokenName());
      return response;
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  // Get user stats
  const { getDb } = await import("@/lib/db");
  const db = getDb();

  const stats = db.prepare(`
    SELECT 
      COUNT(*) as reviews,
      (SELECT COUNT(*) FROM diario WHERE usuario_id = ? AND visto = 1) as vistos,
      (SELECT COUNT(*) FROM diario WHERE usuario_id = ? AND quiero_ver = 1) as watchlist,
      (SELECT COUNT(*) FROM amigos WHERE usuario_id = ?) as amigos,
      (SELECT COUNT(*) FROM seguidos WHERE usuario_id = ?) as seguidos
    FROM calificaciones WHERE usuario_id = ?
  `).get(user.id, user.id, user.id, user.id, user.id) as { reviews: number; vistos: number; watchlist: number; amigos: number; seguidos: number };

  return NextResponse.json({ user, stats });
}
