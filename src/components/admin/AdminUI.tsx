import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl leading-none">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-stone-200 bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHead({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
      <h2 className="text-[13px] font-semibold uppercase tracking-wider2 text-ink">{title}</h2>
      {action}
    </div>
  );
}

const tones: Record<string, string> = {
  Paid: "bg-brass-100 text-brass-700",
  Fulfilled: "bg-success/10 text-success",
  Delivered: "bg-success/10 text-success",
  "Out for delivery": "bg-brass-100 text-brass-700",
  "In transit": "bg-[#E6EDF2] text-[#3f5568]",
  Pending: "bg-stone-100 text-stone-600",
  Processing: "bg-stone-100 text-stone-600",
  Refunded: "bg-danger/10 text-danger",
  Cancelled: "bg-danger/10 text-danger",
  Active: "bg-success/10 text-success",
  Draft: "bg-stone-100 text-stone-600",
  VIP: "bg-brass-100 text-brass-700",
  Returning: "bg-[#E6EDF2] text-[#3f5568]",
  New: "bg-success/10 text-success",
};

export function Pill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium",
        tones[status] ?? "bg-stone-100 text-stone-600",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
