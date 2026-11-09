import Link from "next/link";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-medium tracking-tight text-zinc-950">
          Company A <span className="text-xs font-normal text-zinc-500">Kochi</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-zinc-600 transition-colors hover:text-zinc-950">
            Destinations
          </Link>
          <Link href="/#packages" className="text-zinc-600 transition-colors hover:text-zinc-950">
            Packages
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Staff Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

