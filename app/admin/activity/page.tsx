import { db } from "@/lib/db";
import { Clock, Shield, User, Sparkles } from "lucide-react";

export const revalidate = 0;
export const runtime = "edge";

export default async function ActivityLogPage() {
  const logs = await db.activityLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal tracking-tight text-zinc-950">
          Activity Log & Audit Trail
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Real-time record of all package edits, seasonal price updates, and customer quote dispatches.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="divide-y divide-zinc-200">
          {logs.map((log) => {
            const time = new Date(log.timestamp).toLocaleString();
            return (
              <div key={log.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-zinc-100 p-2">
                    {log.userRole === "ADMIN" ? (
                      <Shield className="h-3.5 w-3.5 text-zinc-950" />
                    ) : log.userRole === "CONSULTANT" ? (
                      <User className="h-3.5 w-3.5 text-blue-600" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{log.details}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-400">
                      By <strong className="text-zinc-600">{log.userName}</strong> ({log.userRole})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

