import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_NAME = "falso9_token";

export interface User {
  id: number;
  username: string;
  email: string | null;
  avatar_color: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export async function register(username: string, password: string, email?: string): Promise<User> {
  const db = getDb();

  if (username.length < 3) throw new Error("El usuario debe tener al menos 3 caracteres");
  if (password.length < 4) throw new Error("La contraseña debe tener al menos 4 caracteres");
  if (!/^[a-zA-Z0-9_]+$/.test(username)) throw new Error("Solo letras, números y guión bajo");

  const existing = db.prepare("SELECT id FROM usuarios WHERE username = ?").get(username);
  if (existing) throw new Error("Ese nombre de usuario ya existe");

  if (email) {
    const existingEmail = db.prepare("SELECT id FROM usuarios WHERE email = ?").get(email);
    if (existingEmail) throw new Error("Ese email ya está registrado");
  }

  const hash = await bcrypt.hash(password, 10);
  const colors = ["#22c55e", "#3b82f6", "#a855f7", "#ef4444", "#f59e0b", "#06b6d4", "#ec4899"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const result = db.prepare(
    "INSERT INTO usuarios (username, password_hash, email, avatar_color) VALUES (?, ?, ?, ?)"
  ).run(username, hash, email || null, color);

  return db.prepare("SELECT id, username, email, avatar_color, avatar_url, bio, created_at FROM usuarios WHERE id = ?")
    .get(result.lastInsertRowid) as User;
}

export async function login(username: string, password: string): Promise<User> {
  const db = getDb();

  const user = db.prepare(
    "SELECT * FROM usuarios WHERE username = ?"
  ).get(username) as (User & { password_hash: string }) | undefined;

  if (!user) throw new Error("Usuario o contraseña incorrectos");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Usuario o contraseña incorrectos");

  const { password_hash, ...safeUser } = user;
  return safeUser;
}

export function createToken(user: User): string {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): { id: number; username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; username: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const db = getDb();
  const user = db.prepare(
    "SELECT id, username, email, avatar_color, avatar_url, bio, created_at FROM usuarios WHERE id = ?"
  ).get(payload.id) as User | undefined;

  return user || null;
}

export function getTokenName() {
  return TOKEN_NAME;
}
