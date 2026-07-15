import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  paid: "bg-brass-100 text-brass-700",
  fulfilled: "bg-success/10 text-success",
  pending: "bg-stone-100 text-stone-600",
  cancelled: "bg-danger/10 text-danger",
};

export function OrderStatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
        tones[status] ?? tones.pending,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
