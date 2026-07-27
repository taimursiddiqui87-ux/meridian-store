/** Builds a wa.me deep link. Returns null when no number is configured. */
export function waLink(number?: string, message?: string): string | null {
  const digits = (number || "").replace(/\D/g, "");
  if (!digits) return null;
  const text = message?.trim() ? `?text=${encodeURIComponent(message.trim())}` : "";
  return `https://wa.me/${digits}${text}`;
}
