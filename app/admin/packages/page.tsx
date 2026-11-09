import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Plus, History, Eye, Edit3 } from "lucide-react";

export const revalidate = 0;
export const runtime = "edge";

export default async function AdminPackagesPage() {
  const user = await getCurrentUser();

  const packages = await db.package.findMany({
    include: {
      seasonalPrices: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-zinc-950">
            Package CMS
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Manage itineraries, seasonal rates, and published versions in under 5 minutes without technical assistance.
          </p>
        </div>

        {user.role === "ADMIN" && (
          <Link
            href="/admin/packages/new"
            className="flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3.5 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-all self-start"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Package</span>
          </Link>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="divide-y divide-zinc-200">
          {packages.map((pkg) => {
            const activeVer = pkg.versions[0];
            const destinations: string[] = JSON.parse(pkg.destinations || "[]");

            return (
              <div
                key={pkg.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6 hover:bg-zinc-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-28 overflow-hidden rounded-lg bg-zinc-100 flex-shrink-0">
                    <Image
                      src={pkg.heroImage}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-zinc-400">
                        {pkg.id}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          pkg.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {pkg.status}
                      </span>
                      <span className="text-xs text-zinc-400">
                        v{activeVer?.versionNumber || 1}
                      </span>
                    </div>

                    <h3 className="mt-1 text-base font-medium text-zinc-950">
                      {pkg.title}
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
                      {pkg.durationDays} Days / {pkg.durationDays - 1} Nights • {destinations.join(", ")} • {pkg.hotelStandard} Hotels
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-600">
                      {pkg.seasonalPrices.map((sp) => (
                        <span key={sp.id} className="rounded bg-zinc-100 px-2 py-0.5">
                          {sp.seasonName}: <strong>₹{sp.priceInr.toLocaleString("en-IN")}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    href={`/admin/packages/${pkg.id}/preview`}
                    className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </Link>
                  <Link
                    href={`/admin/packages/${pkg.id}/history`}
                    className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>History</span>
                  </Link>
                  <Link
                    href={`/admin/packages/${pkg.id}`}
                    className="flex items-center gap-1 rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Rates & Content</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

