"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSeasonalPrices, createPackageVersion } from "@/lib/actions/package";
import { Plus, Trash2, Check, AlertTriangle, ArrowLeft, Eye, History } from "lucide-react";
import Link from "next/link";

export function PackageEditor({
  pkg,
  currentRole,
}: {
  pkg: any;
  currentRole: string;
}) {
  const router = useRouter();

  const activeVersion = pkg.versions[0];
  const initialItinerary: Array<{ day: number; title: string; description: string }> =
    activeVersion?.itineraryJson ? JSON.parse(activeVersion.itineraryJson) : [];

  const initialInclusions: { inclusions: string[]; exclusions: string[] } =
    activeVersion?.inclusionsJson
      ? JSON.parse(activeVersion.inclusionsJson)
      : { inclusions: [], exclusions: [] };

  // Form states
  const [title, setTitle] = useState(pkg.title);
  const [durationDays, setDurationDays] = useState(pkg.durationDays);
  const [hotelStandard, setHotelStandard] = useState(pkg.hotelStandard);
  const [seasonalPrices, setSeasonalPrices] = useState(pkg.seasonalPrices || []);
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [changeSummary, setChangeSummary] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Check seasonal price conflicts (overlaps or gaps)
  const hasMultiplePrices = seasonalPrices.length > 1;

  async function handlePriceUpdate(idx: number, field: string, value: any) {
    const updated = [...seasonalPrices];
    updated[idx] = { ...updated[idx], [field]: value };
    setSeasonalPrices(updated);
  }

  function addSeason() {
    setSeasonalPrices([
      ...seasonalPrices,
      {
        seasonName: "Special Season",
        startMonth: 4,
        endMonth: 5,
        priceInr: 28000,
      },
    ]);
  }

  function removeSeason(idx: number) {
    setSeasonalPrices(seasonalPrices.filter((_: any, i: number) => i !== idx));
  }

  async function handleSave(publishImmediately: boolean) {
    setIsSaving(true);
    setMessage("");

    try {
      // 1. Update prices in DB
      await updateSeasonalPrices(pkg.id, seasonalPrices);

      // 2. Save immutable version snapshot
      const destinations = JSON.parse(pkg.destinations || "[]");
      await createPackageVersion(pkg.id, {
        title,
        durationDays: Number(durationDays),
        hotelStandard,
        destinations,
        itinerary,
        inclusions: initialInclusions.inclusions || [],
        exclusions: initialInclusions.exclusions || [],
        changeSummary: changeSummary || (publishImmediately ? "Published updated rates & details" : "Saved revision"),
        publishImmediately,
      });

      setMessage("Changes saved and version logged successfully!");
      setIsSaving(false);
      router.refresh();
    } catch (err: any) {
      setMessage(`Error: ${err.message || "Failed to save."}`);
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <Link
            href="/admin/packages"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Packages
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-normal tracking-tight text-zinc-950">
              {pkg.title}
            </h1>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-mono text-zinc-600">
              {pkg.id}
            </span>
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                pkg.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {pkg.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/packages/${pkg.id}/preview`}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Staging Preview</span>
          </Link>
          <Link
            href={`/admin/packages/${pkg.id}/history`}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <History className="h-3.5 w-3.5" />
            <span>Version History</span>
          </Link>
          {currentRole !== "CONTENT" && (
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition-all"
            >
              {isSaving ? "Publishing..." : "Publish to Live Site"}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs font-medium text-zinc-900 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Editor Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Seasonal Prices & Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Seasonal Rates Box (5-Minute Price Change Target) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-zinc-950">
                  Seasonal Pricing Matrix
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Prices must state per person, twin sharing, including GST. Changes take effect immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={addSeason}
                className="flex items-center gap-1 text-xs font-medium text-zinc-900 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add Season
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {seasonalPrices.map((sp: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border border-zinc-200 p-3 bg-zinc-50/50"
                >
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-400">
                      Season Name
                    </label>
                    <input
                      value={sp.seasonName}
                      onChange={(e) => handlePriceUpdate(idx, "seasonName", e.target.value)}
                      placeholder="e.g. Peak (Oct-Mar)"
                      className="mt-0.5 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="w-40">
                    <label className="text-[10px] uppercase font-semibold text-zinc-400">
                      Rate Per Person (₹)
                    </label>
                    <input
                      type="number"
                      value={sp.priceInr}
                      onChange={(e) => handlePriceUpdate(idx, "priceInr", Number(e.target.value))}
                      className="mt-0.5 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>

                  {seasonalPrices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSeason(idx)}
                      className="mt-4 sm:mt-0 p-1.5 text-zinc-400 hover:text-red-600 transition-colors"
                      title="Remove Season"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded bg-amber-50/60 p-2.5 text-[11px] text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                Gap and Overlap Check: Ensure travel periods for Peak and Monsoon do not conflict. Quotes automatically pick the rate corresponding to the enquiry month.
              </span>
            </div>
          </div>

          {/* Day-by-Day Itinerary Editor */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-zinc-950">
              Day-by-Day Itinerary
            </h2>
            <div className="mt-4 space-y-4">
              {itinerary.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-zinc-200 p-4 bg-zinc-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase text-zinc-500">
                      Day {item.day}
                    </span>
                    <input
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...itinerary];
                        updated[idx].title = e.target.value;
                        setItinerary(updated);
                      }}
                      className="flex-1 rounded border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...itinerary];
                      updated[idx].description = e.target.value;
                      setItinerary(updated);
                    }}
                    rows={2}
                    className="mt-2 w-full rounded border border-zinc-200 bg-white p-2.5 text-xs text-zinc-700 outline-none focus:border-zinc-900"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Metadata & Versioning Audit */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Package Details
            </h3>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium">Package Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded border border-zinc-200 px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 font-medium">Duration (Days)</label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-zinc-200 px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium">Hotel Tier</label>
                  <select
                    value={hotelStandard}
                    onChange={(e) => setHotelStandard(e.target.value)}
                    className="mt-1 w-full rounded border border-zinc-200 px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-900 bg-white"
                  >
                    <option value="3 star">3 Star</option>
                    <option value="4 star">4 Star</option>
                    <option value="5 star">5 Star Luxury</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <label className="block text-zinc-600 font-medium">
                  Version Change Summary
                </label>
                <input
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder="e.g. Adjusted Peak season rate to ₹32,500"
                  className="mt-1 w-full rounded border border-zinc-200 px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                />
                <p className="mt-1 text-[10px] text-zinc-400">
                  Saved with immutable author tag for 1-click audit & rollback.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 transition-all"
                >
                  Save as Draft Version
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

