import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { PublicNav } from "@/components/PublicNav";
import { EnquiryDrawer } from "@/components/EnquiryDrawer";
import { Check, Clock, MapPin, Building, ShieldCheck } from "lucide-react";

export const revalidate = 0;
export const runtime = "edge";

export default async function PackageDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const pkg: any = await db.package.findUnique({
    where: { slug: params.slug },
    include: {
      seasonalPrices: {
        orderBy: { priceInr: "asc" },
      },
      versions: {
        where: { id: { not: undefined } },
        orderBy: { versionNumber: "desc" },
        take: 1,
      },
    },
  });

  if (!pkg || pkg.status !== "PUBLISHED") {
    notFound();
  }

  // Get active version details
  const activeVersion = pkg.versions[0];
  const itinerary: Array<{ day: number; title: string; description: string }> = activeVersion?.itineraryJson
    ? JSON.parse(activeVersion.itineraryJson)
    : [];

  const inclusionsData: { inclusions: string[]; exclusions: string[] } = activeVersion?.inclusionsJson
    ? JSON.parse(activeVersion.inclusionsJson)
    : { inclusions: [], exclusions: [] };

  const destinations: string[] = JSON.parse(pkg.destinations || "[]");
  const gallery: string[] = JSON.parse(pkg.galleryImages || "[]");

  const minPrice = pkg.seasonalPrices[0]?.priceInr;

  return (
    <div className="min-h-screen pb-32">
      <PublicNav />

      {/* Package Header / Hero */}
      <div className="relative h-[60vh] w-full bg-zinc-950">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          priority
          className="object-cover opacity-85"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="absolute bottom-10 left-0 right-0 mx-auto max-w-5xl px-6 text-white">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-zinc-300">
            <span>{pkg.durationDays} Days / {pkg.durationDays - 1} Nights</span>
            <span>•</span>
            <span>{pkg.hotelStandard} Hotels</span>
          </div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
            {pkg.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-300">
            <MapPin className="h-4 w-4" />
            {destinations.join(" → ")}
          </p>
        </div>
      </div>

      {/* Content Columns */}
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 px-6 lg:grid-cols-3">
        {/* Left 2 Cols: Itinerary & Inclusions */}
        <div className="space-y-12 lg:col-span-2">
          {/* Day by Day Itinerary */}
          <section>
            <h2 className="text-xl font-medium tracking-tight text-zinc-950">Day-by-Day Itinerary</h2>
            <div className="mt-6 space-y-6">
              {itinerary.map((item) => (
                <div key={item.day} className="flex gap-4 border-l border-zinc-200 pl-4">
                  <div className="text-xs font-semibold uppercase text-zinc-400">Day {item.day}</div>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-zinc-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Inclusions & Exclusions */}
          <section className="border-t border-zinc-200 pt-8">
            <h2 className="text-xl font-medium tracking-tight text-zinc-950">Inclusions & Exclusions</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">What is Included</h3>
                <ul className="mt-3 space-y-2 text-xs text-zinc-600">
                  {inclusionsData.inclusions?.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-zinc-900" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">What is Not Included</h3>
                <ul className="mt-3 space-y-2 text-xs text-zinc-600">
                  {inclusionsData.exclusions?.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-zinc-400 font-bold">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Gallery */}
          {gallery.length > 0 && (
            <section className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl font-medium tracking-tight text-zinc-950">Photography</h2>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {gallery.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
                    <Image src={img} alt={`${pkg.title} ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Col: Transparent Seasonal Pricing Box */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">Seasonal Rates</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Clear, transparent pricing. Per person, twin sharing, including GST.
            </p>

            <div className="mt-4 divide-y divide-zinc-100 border-t border-zinc-100">
              {pkg.seasonalPrices?.map((sp: any) => (
                <div key={sp.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{sp.seasonName}</p>
                    <p className="text-[11px] text-zinc-400">Twin sharing • GST included</p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-950">
                    ₹{sp.priceInr.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-zinc-50 p-3 text-[11px] text-zinc-500">
              <p className="flex items-center gap-1 font-medium text-zinc-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Direct Operator Guarantee
              </p>
              <p className="mt-1">
                Zero agent commissions. Managed and executed directly by Company A staff in Kochi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Enquiry Drawer Client Trigger */}
      <EnquiryDrawer
        packageId={pkg.id}
        packageTitle={pkg.title}
        initialSeasonPrice={minPrice}
      />
    </div>
  );
}

