/**
 * Brand marks for every payment method, drawn as inline SVG so they stay crisp,
 * add no network requests and carry no third-party image assets.
 */

const wordmark = (
  label: string,
  bg: string,
  fg: string,
  opts: { width?: number; italic?: boolean; letter?: number } = {},
) => (
  <svg
    viewBox={`0 0 ${opts.width ?? 78} 26`}
    className="h-6 w-auto"
    role="img"
    aria-label={label}
  >
    <rect width={opts.width ?? 78} height="26" rx="5" fill={bg} />
    <text
      x={(opts.width ?? 78) / 2}
      y="17.5"
      textAnchor="middle"
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="12"
      fontWeight="700"
      fontStyle={opts.italic ? "italic" : "normal"}
      letterSpacing={opts.letter ?? 0}
      fill={fg}
    >
      {label}
    </text>
  </svg>
);

export function PaymentMark({ method }: { method: string }) {
  switch (method) {
    case "cod":
      return (
        <svg viewBox="0 0 78 26" className="h-6 w-auto" role="img" aria-label="Cash on Delivery">
          <rect width="78" height="26" rx="5" fill="#0E7C4A" />
          <rect x="12" y="8" width="26" height="11" rx="2" fill="#FFFFFF" opacity="0.95" />
          <circle cx="25" cy="13.5" r="3" fill="#0E7C4A" />
          <text x="56" y="17.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#FFFFFF">
            COD
          </text>
        </svg>
      );
    case "card":
      return (
        <span className="flex items-center gap-1">
          {wordmark("VISA", "#1A1F71", "#FFFFFF", { width: 46, italic: true, letter: 0.6 })}
          <svg viewBox="0 0 46 26" className="h-6 w-auto" role="img" aria-label="Mastercard">
            <rect width="46" height="26" rx="5" fill="#F4F4F4" />
            <circle cx="19" cy="13" r="7.5" fill="#EB001B" />
            <circle cx="27" cy="13" r="7.5" fill="#F79E1B" fillOpacity="0.9" />
          </svg>
        </span>
      );
    case "stripe":
      return wordmark("stripe", "#635BFF", "#FFFFFF", { width: 62 });
    case "payoneer":
      return wordmark("payoneer", "#FF4800", "#FFFFFF", { width: 78 });
    case "fastpay":
      return wordmark("FastPay", "#0F9D8F", "#FFFFFF", { width: 68 });
    case "jazzcash":
      return wordmark("JazzCash", "#B01C2E", "#FFFFFF", { width: 72 });
    case "easypaisa":
      return wordmark("easypaisa", "#1FA64A", "#FFFFFF", { width: 78 });
    default:
      return null;
  }
}

/** Compact row of accepted-payment marks for the footer. */
export function PaymentMarksRow({ className = "" }: { className?: string }) {
  const methods = ["cod", "card", "stripe", "payoneer", "fastpay", "jazzcash", "easypaisa"];
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {methods.map((m) => (
        <PaymentMark key={m} method={m} />
      ))}
    </div>
  );
}
