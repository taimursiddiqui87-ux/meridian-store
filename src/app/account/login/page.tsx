"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Apple, Chrome } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { img } from "@/lib/data";

export default function LoginPage() {
  const [show, setShow] = useState(false);

  return (
    <AuthShell
      image={img("1539874754764-5a96559165b0", 1200)}
      quote="A watch is the only jewellery a man truly needs."
    >
      <h1 className="font-serif text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-muted">Sign in to your Meridian account.</p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button className="btn border border-stone-300 py-3 text-sm hover:bg-cream">
          <Apple size={17} /> Apple
        </button>
        <button className="btn border border-stone-300 py-3 text-sm hover:bg-cream">
          <Chrome size={17} /> Google
        </button>
      </div>

      <div className="my-6 flex items-center gap-4 text-[11px] uppercase tracking-wider2 text-stone-400">
        <span className="h-px flex-1 bg-stone-200" /> or <span className="h-px flex-1 bg-stone-200" />
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="field-label">Email</label>
          <input type="email" required placeholder="you@email.com" className="field-input" />
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
          <input type="checkbox" className="h-4 w-4 accent-ink" /> Keep me signed in
        </label>
        <button type="submit" className="btn-primary w-full">
          Sign in
        </button>
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
