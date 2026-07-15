import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/data";

export function AuthShell({
  children,
  image,
  quote,
}: {
  children: React.ReactNode;
  image: string;
  quote?: string;
}) {
  return (
    <div className="grid min-h-[calc(100vh-110px)] lg:grid-cols-2">
      <div className="relative hidden bg-ink lg:block">
        <Image src={image} alt="" fill sizes="50vw" className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-ink/10" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-[0.16em] text-paper">
            {BRAND.name}
          </Link>
          {quote && (
            <p className="max-w-sm font-serif text-3xl leading-tight text-paper/95">“{quote}”</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
