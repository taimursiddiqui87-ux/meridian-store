import { marqueeItems } from "@/lib/data";

export function AnnouncementBar() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="group border-b border-white/5 bg-ink text-paper">
      <div className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
        {items.map((text, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-3 px-6 py-2.5 text-[10.5px] font-medium uppercase tracking-wider2 text-paper/80"
          >
            {text}
            <span className="text-brass-400">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
