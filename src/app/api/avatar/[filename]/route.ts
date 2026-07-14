import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const AVATARS_DIR = process.env.NODE_ENV === "production"
  ? "/app/data/avatars"
  : path.join(process.cwd(), "public", "avatars");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  const filepath = path.join(AVATARS_DIR, filename);

  if (!fs.existsSync(filepath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = fs.readFileSync(filepath);
  const ext = filename.split(".").pop()?.toLowerCase();

  const contentType =
    ext === "png" ? "image/png" :
    ext === "gif" ? "image/gif" :
    ext === "webp" ? "image/webp" :
    "image/jpeg";

  return new NextResponse(file, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
