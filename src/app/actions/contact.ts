"use server";

import { sendContactEmail } from "@/lib/email";

export interface ContactState {
  error?: string;
  success?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (message.length < 10) return { error: "Please add a little more detail to your message." };

  await sendContactEmail({ name, email, subject, message });

  // Always confirm receipt — the message is logged server-side even if email
  // delivery isn't configured yet.
  return {
    success: "Thanks for reaching out — we've received your message and will reply by email soon.",
  };
}
