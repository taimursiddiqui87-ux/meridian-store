"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { requestPasswordReset, type AuthState } from "@/app/actions/auth";
import { img } from "@/lib/data";

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState<AuthState, FormData>(requestPasswordReset, {});

  return (
    <AuthShell
      image={img("1508057198894-247b23fe5ade", 1200)}
      quote="Every second counts — let's get you back in."
    >
      <h1 className="font-serif text-4xl">Forgot your password?</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Enter the email on your account and we&apos;ll send you a link to reset it.
      </p>

      {state.error && (
        <div className="mt-6 flex items-start gap-2 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      )}

      {state.success ? (
        <div className="mt-6 flex items-start gap-2 border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          {state.success}
        </div>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="field-label">Email</label>
            <input type="email" name="email" required placeholder="you@email.com" className="field-input" />
          </div>
          <SubmitButton pendingText="Sending…">Send reset link</SubmitButton>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-muted">
        Remembered it?{" "}
        <Link href="/account/login" className="font-medium text-ink link-underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
