import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { AdminNavSwitcher } from "@/components/AdminNavSwitcher";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900">
      {/* Linear-style workspace header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white px-6">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/inbox" className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-zinc-950 inline-block" />
              <span className="font-semibold tracking-tight text-zinc-950 text-sm">
                Company A <span className="font-normal text-zinc-400">Workspace</span>
              </span>
            </Link>

            <nav className="flex items-center gap-6 text-xs font-medium">
              <Link
                href="/admin/inbox"
                className="text-zinc-600 hover:text-zinc-950 transition-colors"
              >
                Enquiry Inbox
              </Link>
              <Link
                href="/admin/packages"
                className="text-zinc-600 hover:text-zinc-950 transition-colors"
              >
                Packages CMS
              </Link>
              <Link
                href="/admin/activity"
                className="text-zinc-600 hover:text-zinc-950 transition-colors"
              >
                Activity Log
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              View Public Site ↗
            </Link>
            <AdminNavSwitcher currentUser={user} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}

