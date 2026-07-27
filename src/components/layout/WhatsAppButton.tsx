"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { waLink } from "@/lib/whatsapp";

/**
 * Floating WhatsApp contact button. Sits above the sticky mobile buy bar on
 * product pages so it never covers the Add-to-Cart action.
 */
export function WhatsAppButton({ number, message }: { number: string; message: string }) {
  const pathname = usePathname();
  const href = waLink(number, message);
  if (!href) return null;

  const onProductPage = pathname?.startsWith("/product/");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`group fixed right-4 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] p-3.5 text-white shadow-lift transition-all duration-300 ease-luxe hover:pr-5 hover:brightness-105 active:scale-95 sm:right-6 ${
        onProductPage ? "bottom-24 lg:bottom-6" : "bottom-6"
      }`}
    >
      <WhatsAppIcon size={26} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-semibold opacity-0 transition-all duration-300 ease-luxe group-hover:max-w-[140px] group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
