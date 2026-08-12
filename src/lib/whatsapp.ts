/**
 * Builds a wa.me deep link. Returns null when no number is configured.
 *
 * wa.me needs the full international number with no leading zero. Pakistani
 * mobiles are usually written locally as 03xx-xxxxxxx, so a leading 0 on an
 * 11-digit number is rewritten to the +92 country code — otherwise a number
 * entered that way would produce a dead link.
 */
export function waLink(number?: string, message?: string): string | null {
  let digits = (number || "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0") && digits.length === 11) digits = `92${digits.slice(1)}`;
  const text = message?.trim() ? `?text=${encodeURIComponent(message.trim())}` : "";
  return `https://wa.me/${digits}${text}`;
}
