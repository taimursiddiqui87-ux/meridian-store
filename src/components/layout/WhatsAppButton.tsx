"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { waLink } from "@/lib/whatsapp";

/**
 * Floating WhatsApp contact button. Sits above the sticky mobile buy bar on
 * product pages so it never covers the Add-to-Cart action.
 */
export function WhatsAppButton({ number, message }: { number: string; message: string }) {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(true);

  // Product pages carry a sticky buy bar on small screens; lift the button
  // above it there. Set via style so no utility-class ordering can override it.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const href = waLink(number, message);
  if (!href) return null;

  const clearsBuyBar = pathname?.startsWith("/product/") && !isDesktop;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      style={{ bottom: clearsBuyBar ? "6rem" : "1.5rem" }}
      className="group fixed right-4 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] p-3.5 text-white shadow-lift transition-all duration-300 ease-luxe hover:pr-5 hover:brightness-105 active:scale-95 sm:right-6"
    >
      <WhatsAppIcon size={26} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-semibold opacity-0 transition-all duration-300 ease-luxe group-hover:max-w-[140px] group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
