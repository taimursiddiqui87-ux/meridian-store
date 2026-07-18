"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
} from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export interface AuthState {
  error?: string;
  success?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://meridian-store-beige.vercel.app";

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

const GENERIC_RESET_MSG =
  "If an account exists for that email, we've sent a link to reset your password. Check your inbox.";

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      // Invalidate any outstanding tokens, then issue a fresh one (1-hour expiry).
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
      const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
      await prisma.passwordResetToken.create({
        data: { token, userId: user.id, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
      });
      await sendPasswordResetEmail(email, `${APP_URL}/account/reset?token=${token}`);
    }
  } catch (e) {
    console.error("[requestPasswordReset]", e);
    // Still return the generic message so we never reveal whether an email exists.
  }

  // Always the same response — don't disclose whether the account exists.
  return { success: GENERIC_RESET_MSG };
}

export async function resetPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) return { error: "This reset link is invalid. Please request a new one." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "The two passwords don't match." };

  try {
    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.expiresAt < new Date()) {
      return { error: "This reset link has expired. Please request a new one." };
    }
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: await hashPassword(password) },
    });
    await prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } });
  } catch (e) {
    console.error("[resetPassword]", e);
    return { error: "We couldn't reset your password. Please try again." };
  }

  return { success: "Your password has been reset. You can now sign in." };
}
