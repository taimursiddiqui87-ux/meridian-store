"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
} from "@/lib/auth";

export interface AuthState {
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!firstName || !lastName) return { error: "Please enter your first and last name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "An account with this email already exists." };

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: await hashPassword(password),
      },
    });
    await createSession({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    console.error("[signup]", e);
    return {
      error: "We couldn't create your account right now. (Is the database configured?)",
    };
  }

  redirect("/account");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_RE.test(email) || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      return { error: "Incorrect email or password." };
    }
    await createSession({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    console.error("[login]", e);
    return { error: "Sign-in failed. (Is the database configured?)" };
  }

  redirect("/account");
}

export async function logoutAction() {
  destroySession();
  redirect("/");
}
