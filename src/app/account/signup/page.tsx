"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signupAction, type AuthState } from "@/app/actions/auth";
import { img } from "@/lib/data";

export default function SignupPage() {
  const [show, setShow] = useState(false);
  const [state, formAction] = useFormState<AuthState, FormData>(signupAction, {});

  return (
    <AuthShell
      image={img("1524592094714-0f0654e20314", 1200)}
      quote="Time you enjoy wasting is not wasted time."
    >
      <h1 className="font-serif text-4xl">Create your account</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Join for order tracking, faster checkout and member releases.
      </p>

      {state.error && (
        <div className="mt-6 flex items-start gap-2 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">First name</label>
            <input name="firstName" required placeholder="First" className="field-input" />
          </div>
          <div>
            <label className="field-label">Last name</label>
            <input name="lastName" required placeholder="Last" className="field-input" />
          </div>
        </div>
        <div>
          <label className="field-label">Email</label>
          <input type="email" name="email" required placeholder="you@email.com" className="field-input" />
        </div>
        <div>
          <label className="field-label">Password</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              required
              minLength={8}
              placeholder="Create a password"
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
          <p className="mt-1.5 text-[12px] text-stone-400">At least 8 characters.</p>
        </div>
        <label className="flex items-start gap-2 text-[13px] text-ink-muted">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-ink" />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-ink link-underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-ink link-underline">Privacy Policy</Link>.
          </span>
        </label>
        <SubmitButton pendingText="Creating account…">Create account</SubmitButton>
      </form>

      <div className="mt-6 space-y-2">
        {["Free worldwide shipping", "Order tracking & history", "Exclusive member releases"].map((b) => (
          <p key={b} className="flex items-center gap-2 text-[13px] text-ink-muted">
            <Check size={15} className="text-success" /> {b}
          </p>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/account/login" className="font-medium text-ink link-underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
