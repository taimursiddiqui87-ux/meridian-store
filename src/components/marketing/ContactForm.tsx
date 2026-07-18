"use client";

import { useFormState } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";

export function ContactForm() {
  const [state, formAction] = useFormState<ContactState, FormData>(sendContactMessage, {});

  if (state.success) {
    return (
      <div className="flex items-start gap-2 border border-success/30 bg-success/5 px-4 py-4 text-sm text-success">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
        {state.success}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-start gap-2 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Name</label>
          <input name="name" required placeholder="Your name" className="field-input" />
        </div>
        <div>
          <label className="field-label">Email</label>
          <input type="email" name="email" required placeholder="you@email.com" className="field-input" />
        </div>
      </div>
      <div>
        <label className="field-label">Subject</label>
        <input name="subject" placeholder="How can we help?" className="field-input" />
      </div>
      <div>
        <label className="field-label">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us a little more…"
          className="field-input resize-none"
        />
      </div>
      <SubmitButton pendingText="Sending…">Send message</SubmitButton>
    </form>
  );
}
