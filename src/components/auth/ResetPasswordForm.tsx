"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { resetPassword, type AuthState } from "@/app/actions/auth";

export function ResetPasswordForm({ token }: { token: string }) {
  const [show, setShow] = useState(false);
  const [state, formAction] = useFormState<AuthState, FormData>(resetPassword, {});

  if (state.success) {
    return (
      <>
        <h1 className="font-serif text-4xl">Password reset</h1>
        <div className="mt-6 flex items-start gap-2 border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          {state.success}
        </div>
        <Link href="/account/login" className="btn-primary mt-6 w-full">
          Sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="font-serif text-4xl">Choose a new password</h1>
      <p className="mt-2 text-sm text-ink-muted">Make it at least 8 characters.</p>

      {!token && (
        <div className="mt-6 flex items-start gap-2 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          This reset link is invalid. Please request a new one.
        </div>
      )}
      {state.error && (
        <div className="mt-6 flex items-start gap-2 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="token" value={token} />
        <div>
          <label className="field-label">New password</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              required
              minLength={8}
              placeholder="••••••••"
              className="field-input pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>
        <div>
          <label className="field-label">Confirm password</label>
          <input
            type={show ? "text" : "password"}
            name="confirm"
            required
            minLength={8}
            placeholder="••••••••"
            className="field-input"
          />
        </div>
        <SubmitButton pendingText="Saving…">Reset password</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        <Link href="/account/login" className="font-medium text-ink link-underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
