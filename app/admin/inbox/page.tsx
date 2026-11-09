import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { InboxView } from "@/components/InboxView";

export const revalidate = 0;
export const runtime = "edge";

export default async function AdminInboxPage() {
  const user = await getCurrentUser();

  const enquiries = await db.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      package: true,
      quotes: true,
    },
  });

  const packages = await db.package.findMany({
    where: { status: "PUBLISHED" },
    include: {
      seasonalPrices: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-zinc-950">
            Enquiry Inbox
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Triage customer enquiries across all channels. 90% SLA: first human reply within 1 hour.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-600 shadow-sm">
            Total Enquiries: <span className="font-semibold text-zinc-950">{enquiries.length}</span>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-600 shadow-sm">
            Awaiting Reply:{" "}
            <span className="font-semibold text-amber-600">
              {enquiries.filter((e: any) => e.status === "NEW").length}
            </span>
          </div>
        </div>
      </div>

      <InboxView
        initialEnquiries={enquiries}
        allPackages={packages}
        currentRole={user.role}
      />
    </div>
  );
}

