"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Lock, User, AlertCircle, ArrowRight } from "lucide-react";
import { adminLoginAction, type AdminAuthState } from "@/app/actions/admin-auth";
import { BRAND } from "@/lib/data";

function SignInButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 bg-brass-500 py-3.5 text-[13px] font-medium uppercase tracking-wider2 text-ink transition-colors hover:bg-brass-400 disabled:opacity-60"
    >
      {pending ? "Signing in…" : <>Sign in <ArrowRight size={16} /></>}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState<AdminAuthState, FormData>(adminLoginAction, {});

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-5 text-paper">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="font-serif text-3xl font-semibold tracking-[0.16em]">{BRAND.name}</span>
          <p className="mt-2 text-[11px] uppercase tracking-luxe text-brass-300">Admin Panel</p>
        </div>

        <div className="mt-10 border border-white/10 bg-white/5 p-7 backdrop-blur">
          <h1 className="font-serif text-2xl">Sign in to your dashboard</h1>
          <p className="mt-1 text-[13px] text-paper/50">Enter your admin credentials.</p>

          {state.error && (
            <div className="mt-5 flex items-start gap-2 border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {state.error}
            </div>
          )}

          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-wider2 text-paper/50">Username</label>
              <div className="flex items-center gap-2 border border-white/15 bg-ink/40 px-3">
                <User size={16} className="text-paper/40" />
                <input
                  name="username"
                  required
                  autoFocus
                  autoComplete="username"
                  placeholder="admin"
                  className="w-full bg-transparent py-3 text-sm text-paper outline-none placeholder:text-paper/30"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-wider2 text-paper/50">Password</label>
              <div className="flex items-center gap-2 border border-white/15 bg-ink/40 px-3">
                <Lock size={16} className="text-paper/40" />
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••"
                  className="w-full bg-transparent py-3 text-sm text-paper outline-none placeholder:text-paper/30"
                />
              </div>
            </div>
            <SignInButton />
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-paper/40">
          Customer?{" "}
          <a href="/account/login" className="text-brass-300 hover:text-brass-200">
            Shopper sign in →
          </a>
        </p>
      </div>
    </div>
  );
}
