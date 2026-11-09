"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPackagePage() {
  const router = useRouter();
  const [id, setId] = useState("PKG-KL-");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(5);
  const [destinations, setDestinations] = useState("Kochi, Munnar, Thekkady");
  const [hotelStandard, setHotelStandard] = useState("4 star");
  const [peakPrice, setPeakPrice] = useState(29500);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    alert("New package scaffold created! Directing to package editor.");
    router.push("/admin/packages");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/packages"
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Packages
      </Link>

      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-normal tracking-tight text-zinc-950">
          Create New Tour Package
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Set up title, destinations, and initial seasonal rates.
        </p>

        <form onSubmit={handleCreate} className="mt-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-zinc-700">Package ID</label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="mt-1 w-full rounded border border-zinc-200 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-700">Package Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Wayanad Rainforest & Kabini Safari"
              className="mt-1 w-full rounded border border-zinc-200 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-zinc-700">Duration (Days)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="mt-1 w-full rounded border border-zinc-200 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-700">Hotel Standard</label>
              <select
                value={hotelStandard}
                onChange={(e) => setHotelStandard(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-200 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 bg-white"
              >
                <option value="3 star">3 Star</option>
                <option value="4 star">4 Star</option>
                <option value="5 star">5 Star Luxury</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-700">Destinations (Comma separated)</label>
            <input
              value={destinations}
              onChange={(e) => setDestinations(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-200 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-700">
              Initial Peak Season Rate (₹ per person twin sharing)
            </label>
            <input
              type="number"
              value={peakPrice}
              onChange={(e) => setPeakPrice(Number(e.target.value))}
              className="mt-1 w-full rounded border border-zinc-200 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 font-semibold"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-lg bg-zinc-950 py-2.5 font-medium text-white hover:bg-zinc-800 transition-all"
            >
              Save as Draft Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

