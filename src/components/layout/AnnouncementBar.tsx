/** Thin trust strip under the sale bar — scrolling CMS announcements. */
export function AnnouncementBar({ messages }: { messages: string[] }) {
  const list = messages.length ? messages : ["Free worldwide shipping"];
  const items = [...list, ...list];
  return (
    <div className="group overflow-hidden border-b border-white/5 bg-[#100D0A] text-paper">
      <div className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
        {items.map((text, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-3 px-6 py-2 text-[10.5px] font-medium uppercase tracking-wider2 text-paper/80"
          >
            {text}
            <span aria-hidden className="h-1 w-1 rotate-45 bg-brass-400/80" />
          </span>
        ))}
      </div>
    </div>
  );
}
