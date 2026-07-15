"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { loginAction, type AuthState } from "@/app/actions/auth";
import { img } from "@/lib/data";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [state, formAction] = useFormState<AuthState, FormData>(loginAction, {});

  return (
    <AuthShell
      image={img("1539874754764-5a96559165b0", 1200)}
      quote="A watch is the only jewellery a man truly needs."
    >
      <h1 className="font-serif text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-muted">Sign in to your Meridian account.</p>

      {state.error && (
        <div className="mt-6 flex items-start gap-2 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="field-label">Email</label>
          <input type="email" name="email" required placeholder="you@email.com" className="field-input" />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="field-label mb-0">Password</label>
            <Link href="#" className="text-[12px] text-brass-600 link-underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              required
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
        <label className="flex items-center gap-2 text-[13px] text-ink-muted">
          <input type="checkbox" name="remember" className="h-4 w-4 accent-ink" /> Keep me signed in
        </label>
        <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        New to Meridian?{" "}
        <Link href="/account/signup" className="font-medium text-ink link-underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
