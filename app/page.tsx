import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { PublicNav } from "@/components/PublicNav";

export const revalidate = 0; // Fresh server-rendered data
export const runtime = "edge";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { season?: string; destination?: string };
}) {
  const publishedPackages = await db.package.findMany({
    where: { status: "PUBLISHED" },
    include: {
      seasonalPrices: {
        orderBy: { priceInr: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      <PublicNav />

      {/* Photography Hero */}
      <section className="relative h-[65vh] w-full overflow-hidden bg-zinc-950">
        <Image
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=85"
          alt="Alleppey Backwaters Kerala"
          fill
          priority
          className="object-cover opacity-80"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 mx-auto max-w-6xl px-6 text-white">
          <p className="text-xs uppercase tracking-widest text-zinc-300">Kerala & South India</p>
          <h1 className="mt-2 text-4xl font-normal tracking-tight sm:text-5xl">
            Thoughtfully planned holiday journeys.
          </h1>
        </div>
      </section>

      {/* Packages Grid */}
      <main id="packages" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-normal tracking-tight text-zinc-900">Featured Packages</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Prices per person, twin sharing, including GST. Handled end-to-end by Company A, Kochi.
            </p>
          </div>
          <div className="text-xs text-zinc-400">
            {publishedPackages.length} package{publishedPackages.length === 1 ? "" : "s"} available
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {publishedPackages.map((pkg: any) => {
            const minPrice = pkg.seasonalPrices?.[0]?.priceInr;
            const destinations: string[] = JSON.parse(pkg.destinations || "[]");

            return (
              <Link
                key={pkg.id}
                href={`/packages/${pkg.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 transition-all hover:border-zinc-400"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                  <Image
                    src={pkg.heroImage}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 rounded bg-zinc-950/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
                    {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      {destinations.join(" · ")}
                    </p>
                    <h3 className="mt-2 text-lg font-medium tracking-tight text-zinc-950 group-hover:underline">
                      {pkg.title}
                    </h3>
                  </div>

                  <div className="mt-6 border-t border-zinc-100 pt-4">
                    <p className="text-xs text-zinc-500">From</p>
                    <div className="mt-0.5 flex items-baseline justify-between">
                      <p className="text-xl font-semibold tracking-tight text-zinc-950">
                        ₹{minPrice ? minPrice.toLocaleString("en-IN") : "Price on request"}
                      </p>
                      <span className="text-xs text-zinc-500">per person, twin sharing</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-10 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Company A, Kochi. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-zinc-900">
              Staff Portal
            </Link>
            <span className="text-zinc-400">DPDP Act 2023 Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

