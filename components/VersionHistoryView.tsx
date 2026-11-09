"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { rollbackToVersion } from "@/lib/actions/package";
import { ArrowLeft, RotateCcw, Check, CheckCircle2 } from "lucide-react";

export function VersionHistoryView({
  pkg,
  versions,
  activeVersionId,
  currentRole,
}: {
  pkg: any;
  versions: any[];
  activeVersionId: string | null;
  currentRole: string;
}) {
  const router = useRouter();
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  async function handleRollback(versionId: string) {
    if (!confirm("Are you sure you want to restore this version as the active version?")) {
      return;
    }
    setIsRollingBack(true);
    setSuccessMsg("");

    try {
      await rollbackToVersion(pkg.id, versionId);
      setSuccessMsg("Package successfully rolled back to selected version!");
      setIsRollingBack(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Rollback failed.");
      setIsRollingBack(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div>
          <Link
            href={`/admin/packages/${pkg.id}`}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Package Editor
          </Link>
          <h1 className="mt-2 text-2xl font-normal tracking-tight text-zinc-950">
            Version History & Audit: {pkg.title}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            Immutable snapshots created upon every save. 1-click instant rollback without engineering support.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="divide-y divide-zinc-200">
          {versions.map((ver) => {
            const isActive = ver.id === activeVersionId;
            const createdAt = new Date(ver.createdAt).toLocaleString();
            const itinerary: Array<{ day: number; title: string }> = ver.itineraryJson
              ? JSON.parse(ver.itineraryJson)
              : [];

            return (
              <div
                key={ver.id}
                className={`p-6 transition-colors ${
                  isActive ? "bg-emerald-50/30" : "hover:bg-zinc-50/50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-900">
                        v{ver.versionNumber}
                      </span>
                      {isActive && (
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase">
                          Active Version
                        </span>
                      )}
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs text-zinc-500">{createdAt}</span>
                    </div>

                    <h3 className="mt-1 text-sm font-medium text-zinc-950">
                      {ver.changeSummary || "Routine update"}
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
                      Authored by: <strong className="text-zinc-700">{ver.authorName}</strong> ({ver.authorRole}) • {ver.durationDays} Days • {itinerary.length} Days Itinerary
                    </p>
                  </div>

                  {!isActive && currentRole === "ADMIN" && (
                    <button
                      onClick={() => handleRollback(ver.id)}
                      disabled={isRollingBack}
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 disabled:opacity-50 transition-all self-start sm:self-center"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-zinc-600" />
                      <span>Rollback to v{ver.versionNumber}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

