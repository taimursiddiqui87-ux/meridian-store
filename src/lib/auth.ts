import "server-only";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "meridian_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    // Fallback keeps local dev working before AUTH_SECRET is set; NOT for production.
    return new TextEncoder().encode("meridian-dev-insecure-secret-change-me");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: String(payload.sub),
      email: String(payload.email),
      name: (payload.name as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

export function destroySession() {
  cookies().delete(COOKIE);
}
