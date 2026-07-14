import { getCurrentUser, getTokenName } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const contentType = request.headers.get("content-type") || "";
  const db = getDb();

  // Handle image upload
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se envió imagen" }, { status: 400 });
    }

    // Save the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/avatars/
    const fs = await import("fs");
    const path = await import("path");
    const avatarsDir = path.join(process.cwd(), "public", "avatars");

    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir, { recursive: true });
    }

    const ext = file.name.split(".").pop() || "png";
    const filename = `${user.id}-${Date.now()}.${ext}`;
    const filepath = path.join(avatarsDir, filename);

    fs.writeFileSync(filepath, buffer);

    const avatarUrl = `/avatars/${filename}`;
    db.prepare("UPDATE usuarios SET avatar_url = ? WHERE id = ?").run(avatarUrl, user.id);

    return NextResponse.json({ success: true, avatar_url: avatarUrl });
  }

  // Handle JSON update (bio, etc)
  const body = await request.json();

  if (body.bio !== undefined) {
    db.prepare("UPDATE usuarios SET bio = ? WHERE id = ?").run(body.bio, user.id);
  }

  if (body.avatar_url !== undefined) {
    db.prepare("UPDATE usuarios SET avatar_url = ? WHERE id = ?").run(body.avatar_url, user.id);
  }

  return NextResponse.json({ success: true });
}
