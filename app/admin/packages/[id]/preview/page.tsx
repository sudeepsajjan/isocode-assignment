import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowLeft, Check, ShieldAlert, MapPin } from "lucide-react";

export const revalidate = 0;

export default async function PackagePreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const pkg = await db.package.findUnique({
    where: { id: params.id },
    include: {
      seasonalPrices: {
        orderBy: { priceInr: "asc" },
      },
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1,
      },
    },
  });

  if (!pkg) {
    notFound();
  }

  const activeVersion = pkg.versions[0];
  const itinerary: Array<{ day: number; title: string; description: string }> = activeVersion?.itineraryJson
    ? JSON.parse(activeVersion.itineraryJson)
    : [];

  const inclusionsData: { inclusions: string[]; exclusions: string[] } = activeVersion?.inclusionsJson
    ? JSON.parse(activeVersion.inclusionsJson)
    : { inclusions: [], exclusions: [] };

  const destinations: string[] = JSON.parse(pkg.destinations || "[]");

  return (
    <div className="space-y-6">
      {/* Draft Staging Banner */}
      <div className="flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-700" />
          <span>
            <strong>Staging Preview Mode:</strong> You are viewing v{activeVersion?.versionNumber || 1} as rendered by the public engine.
          </span>
        </div>
        <Link
          href={`/admin/packages/${pkg.id}`}
          className="rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
        >
          Return to Editor
        </Link>
      </div>

      {/* Simulated Public Render */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        {/* Hero */}
        <div className="relative h-[45vh] w-full bg-zinc-950">
          <Image
            src={pkg.heroImage}
            alt={pkg.title}
            fill
            className="object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 mx-auto max-w-4xl px-6 text-white">
            <span className="text-xs uppercase tracking-wider text-zinc-300">
              {pkg.durationDays} Days / {pkg.durationDays - 1} Nights • {pkg.hotelStandard} Hotels
            </span>
            <h1 className="mt-1 text-3xl font-medium tracking-tight sm:text-4xl">
              {pkg.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-300">
              <MapPin className="h-3.5 w-3.5" />
              {destinations.join(" → ")}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl p-8 space-y-10">
          {/* Seasonal Prices preview */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Verified Seasonal Rates
            </h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pkg.seasonalPrices.map((sp) => (
                <div key={sp.id} className="rounded-lg border border-zinc-200 p-4">
                  <p className="text-xs text-zinc-500 font-medium">{sp.seasonName}</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-950">
                    ₹{sp.priceInr.toLocaleString("en-IN")}{" "}
                    <span className="text-xs font-normal text-zinc-500">per person, twin sharing</span>
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-400">Inclusive of GST</p>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Itinerary
            </h3>
            <div className="mt-4 space-y-4">
              {itinerary.map((item) => (
                <div key={item.day} className="flex gap-4 border-l border-zinc-200 pl-4">
                  <span className="text-xs font-semibold uppercase text-zinc-400">Day {item.day}</span>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900">{item.title}</h4>
                    <p className="mt-1 text-xs text-zinc-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Inclusions & Exclusions
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-100">
                <p className="font-semibold text-zinc-900 mb-2">Included</p>
                <ul className="space-y-1.5 text-zinc-600">
                  {inclusionsData.inclusions?.map((inc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-zinc-900 flex-shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-100">
                <p className="font-semibold text-zinc-900 mb-2">Excluded</p>
                <ul className="space-y-1.5 text-zinc-600">
                  {inclusionsData.exclusions?.map((exc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-zinc-400">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

