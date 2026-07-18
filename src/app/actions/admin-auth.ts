"use server";

import { redirect } from "next/navigation";
import {
  verifyAdminCredentials,
  createAdminSession,
  destroyAdminSession,
} from "@/lib/auth";

export interface AdminAuthState {
  error?: string;
}

export async function adminLoginAction(
  _prev: AdminAuthState,
  formData: FormData,
): Promise<AdminAuthState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(username, password)) {
    return { error: "Incorrect username or password." };
  }

  await createAdminSession(username.trim());
  redirect("/admin");
}

export async function adminLogoutAction() {
  destroyAdminSession();
  redirect("/admin/login");
}
