import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-luxe grid min-h-[70vh] place-items-center py-20 text-center">
      <div>
        <p className="font-serif text-8xl leading-none text-brass-300">404</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">This page has slipped a second</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-muted">
          The page you’re looking for can’t be found. It may have moved, or the link may be out of time.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back home
          </Link>
          <Link href="/shop" className="btn-outline">
            Shop watches
          </Link>
        </div>
      </div>
    </div>
  );
}
