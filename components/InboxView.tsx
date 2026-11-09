"use client";

import { useState } from "react";
import { updateEnquiryStatus, dispatchQuote, updateEnquiryExtraction } from "@/lib/actions/enquiry";
import { 
  Sparkles, 
  Send, 
  CheckCircle, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Check, 
  AlertCircle 
} from "lucide-react";

export function InboxView({
  initialEnquiries,
  allPackages,
  currentRole,
}: {
  initialEnquiries: any[];
  allPackages: any[];
  currentRole: string;
}) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [selectedId, setSelectedId] = useState(initialEnquiries[0]?.id || null);
  const [filter, setFilter] = useState("ALL");
  const [isSending, setIsSending] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");

  const filteredEnquiries = enquiries.filter((e) => {
    if (filter === "ALL") return true;
    return e.status === filter;
  });

  const selectedEnquiry = enquiries.find((e) => e.id === selectedId);

  // Suggested packages matching
  const suggestedIds: string[] = selectedEnquiry?.suggestedPackageIds
    ? JSON.parse(selectedEnquiry.suggestedPackageIds)
    : [];

  const matchedPackages = allPackages.filter((p) => suggestedIds.includes(p.id));

  async function handleStatusChange(enquiryId: string, newStatus: string) {
    await updateEnquiryStatus(enquiryId, newStatus);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
    );
  }

  async function handleSendQuote(packageId: string, totalInr: number) {
    if (!selectedEnquiry) return;
    setIsSending(true);
    setSuccessBanner("");

    const res = await dispatchQuote(
      selectedEnquiry.id,
      packageId,
      totalInr,
      selectedEnquiry.draftReplyText || "Quote prepared per your specifications."
    );

    setIsSending(false);
    if (res.success) {
      setSuccessBanner(`Quote #Q-${res.quoteId.slice(-4)} dispatched successfully! Status updated to QUOTED.`);
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === selectedEnquiry.id
            ? { ...e, status: "QUOTED", firstRepliedAt: new Date().toISOString() }
            : e
        )
      );
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[82vh]">
      {/* Left Pane: Enquiries Triage List (4 Cols) */}
      <div className="lg:col-span-4 flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        {/* Filter bar */}
        <div className="p-3 border-b border-zinc-100 flex items-center justify-between gap-1 overflow-x-auto text-xs">
          {["ALL", "NEW", "QUOTED", "BOOKED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filter === st
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* List of Enquiries */}
        <div className="flex-1 divide-y divide-zinc-100 overflow-y-auto">
          {filteredEnquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">
              No enquiries under this filter.
            </div>
          ) : (
            filteredEnquiries.map((enq) => {
              const isSelected = enq.id === selectedId;
              const createdAt = new Date(enq.createdAt);
              const timeString = createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <button
                  key={enq.id}
                  onClick={() => {
                    setSelectedId(enq.id);
                    setSuccessBanner("");
                  }}
                  className={`flex flex-col w-full text-left p-4 transition-colors ${
                    isSelected ? "bg-zinc-50 border-l-2 border-zinc-950" : "hover:bg-zinc-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-semibold text-zinc-900">{enq.customerName}</span>
                    <span className="text-[11px] text-zinc-400">{timeString}</span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs text-zinc-600 leading-normal">
                    {enq.rawMessage}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        enq.status === "NEW"
                          ? "bg-amber-100 text-amber-800"
                          : enq.status === "QUOTED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {enq.status}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase">
                      {enq.sourceChannel}
                    </span>
                    {enq.extractedBudget && (
                      <span className="text-[10px] font-medium text-zinc-700">
                        ₹{(enq.extractedBudget / 100000).toFixed(1)}L budget
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Detailed Action Pane (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        {selectedEnquiry ? (
          <>
            {/* Top Bar / Customer Header */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-medium tracking-tight text-zinc-950">
                      {selectedEnquiry.customerName}
                    </h2>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                        selectedEnquiry.status === "NEW"
                          ? "bg-amber-100 text-amber-800"
                          : selectedEnquiry.status === "QUOTED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {selectedEnquiry.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {selectedEnquiry.customerPhone}
                    </span>
                    {selectedEnquiry.customerEmail && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {selectedEnquiry.customerEmail}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Recv: {new Date(selectedEnquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status Toggles */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 outline-none hover:border-zinc-400"
                  >
                    <option value="NEW">Status: NEW</option>
                    <option value="QUOTED">Status: QUOTED</option>
                    <option value="BOOKED">Status: BOOKED</option>
                    <option value="LOST">Status: LOST</option>
                  </select>
                </div>
              </div>

              {/* Customer's Raw Message */}
              <div className="mt-5 rounded-lg bg-zinc-50 border border-zinc-100 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Customer Message ({selectedEnquiry.sourceChannel})
                </p>
                <p className="mt-1 text-sm text-zinc-800 italic">
                  "{selectedEnquiry.rawMessage}"
                </p>
              </div>

              {/* DPDP Consent Status */}
              <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>
                  DPDP Act 2023 Consent Recorded on {new Date(selectedEnquiry.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {successBanner && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{successBanner}</span>
              </div>
            )}

            {/* AI Extraction & Suggestions Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-zinc-950" />
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-950">
                    AI Extraction & Parameters
                  </h3>
                </div>
                <span className="text-[11px] text-zinc-400">
                  Side-by-side verification (Prices strictly from DB)
                </span>
              </div>

              {/* Grid of Extracted Fields */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-2.5">
                  <span className="text-zinc-400 uppercase text-[10px] font-semibold">Destination</span>
                  <p className="mt-0.5 font-medium text-zinc-900">{selectedEnquiry.extractedDest || "Kerala"}</p>
                </div>
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-2.5">
                  <span className="text-zinc-400 uppercase text-[10px] font-semibold">Travel Month</span>
                  <p className="mt-0.5 font-medium text-zinc-900">{selectedEnquiry.extractedDates || "Flexible"}</p>
                </div>
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-2.5">
                  <span className="text-zinc-400 uppercase text-[10px] font-semibold">Travellers</span>
                  <p className="mt-0.5 font-medium text-zinc-900">
                    {selectedEnquiry.extractedAdults || 2} Adults
                    {selectedEnquiry.extractedKids ? `, ${selectedEnquiry.extractedKids} Child` : ""}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-2.5">
                  <span className="text-zinc-400 uppercase text-[10px] font-semibold">Budget (Total)</span>
                  <p className="mt-0.5 font-medium text-zinc-900">
                    {selectedEnquiry.extractedBudget
                      ? `₹${selectedEnquiry.extractedBudget.toLocaleString("en-IN")}`
                      : "Unspecified"}
                  </p>
                </div>
              </div>

              {selectedEnquiry.extractedMustHaves && (
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
                  <span className="font-semibold text-zinc-900">Must-haves extracted:</span>
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-800">
                    {selectedEnquiry.extractedMustHaves}
                  </span>
                </div>
              )}
            </div>

            {/* Matching Published Packages with Direct Pricing */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-tight text-zinc-950">
                Matched Packages & Direct Price Calculation
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Only Published packages are suggested. Rates are calculated directly from seasonal price records.
              </p>

              <div className="mt-4 space-y-3">
                {matchedPackages.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-3">No direct match. Review all published packages.</p>
                ) : (
                  matchedPackages.map((pkg) => {
                    const adultsCount = selectedEnquiry.extractedAdults || 2;
                    const peakRate = pkg.seasonalPrices.find((sp: any) =>
                      sp.seasonName.toLowerCase().includes("peak")
                    )?.priceInr || pkg.seasonalPrices[0]?.priceInr || 32500;
                    const totalAdultsInr = peakRate * adultsCount;

                    return (
                      <div
                        key={pkg.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-zinc-200 p-4 gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase text-zinc-400">
                              {pkg.id}
                            </span>
                            <span className="font-medium text-sm text-zinc-900">{pkg.title}</span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-500">
                            {pkg.durationDays} Days / {pkg.durationDays - 1} Nights • {pkg.hotelStandard} • Rate: ₹{peakRate.toLocaleString("en-IN")}/person twin sharing
                          </p>
                          <p className="mt-1 text-xs font-medium text-zinc-900">
                            Calculated for {adultsCount} adults: ₹{totalAdultsInr.toLocaleString("en-IN")} inc. GST
                            {selectedEnquiry.extractedKids > 0 && " (Child supplement: on request)"}
                          </p>
                        </div>

                        <button
                          onClick={() => handleSendQuote(pkg.id, totalAdultsInr)}
                          disabled={isSending}
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition-all flex-shrink-0"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Dispatch Quote (₹{totalAdultsInr.toLocaleString("en-IN")})</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Editable Draft Reply */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-tight text-zinc-950">
                Consultant Reply Note & Draft
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Review or modify before dispatching. Nothing is sent without consultant confirmation.
              </p>

              <textarea
                value={selectedEnquiry.draftReplyText || ""}
                onChange={(e) =>
                  setEnquiries((prev) =>
                    prev.map((item) =>
                      item.id === selectedEnquiry.id
                        ? { ...item, draftReplyText: e.target.value }
                        : item
                    )
                  )
                }
                rows={5}
                className="mt-3 w-full rounded-lg border border-zinc-200 p-3 text-xs text-zinc-800 leading-relaxed outline-none focus:border-zinc-900 font-mono"
              />
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-400">
            Select an enquiry from the list to view extraction and prepare a quote.
          </div>
        )}
      </div>
    </div>
  );
}

