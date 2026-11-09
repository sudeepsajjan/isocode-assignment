"use client";

import { useState } from "react";
import { submitPublicEnquiry } from "@/lib/actions/enquiry";
import { CheckCircle2, X } from "lucide-react";

export function EnquiryDrawer({
  packageId,
  packageTitle,
  initialSeasonPrice,
}: {
  packageId: string;
  packageTitle: string;
  initialSeasonPrice?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("packageId", packageId);

    const res = await submitPublicEnquiry(null, formData);
    setIsPending(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMessage(res.error || "Submission failed.");
    }
  }

  return (
    <>
      {/* Sticky Bottom Bar on Mobile/Desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Starting from</p>
            <p className="text-lg font-semibold tracking-tight text-zinc-950">
              ₹{initialSeasonPrice ? initialSeasonPrice.toLocaleString("en-IN") : "32,500"}{" "}
              <span className="text-xs font-normal text-zinc-500">per person, twin sharing, inc. GST</span>
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-lg bg-zinc-950 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800"
          >
            Enquire Now
          </button>
        </div>
      </div>

      {/* Slide-out / Modal Enquiry Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSuccess(false);
              }}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900"
            >
              <X className="h-5 w-5" />
            </button>

            {isSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-zinc-950" />
                <h3 className="mt-4 text-xl font-medium tracking-tight text-zinc-950">
                  Enquiry Received
                </h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Our consultant in Kochi will review your dates and share a customized quote with verified pricing within the hour.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-6 rounded-lg bg-zinc-950 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-medium tracking-tight text-zinc-950">
                  Enquire for {packageTitle}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Get a personalized quote directly from our travel consultants in Kochi.
                </p>

                {errorMessage && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700">Full Name</label>
                    <input
                      name="customerName"
                      required
                      placeholder="e.g. Suresh Nair"
                      className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700">Phone / WhatsApp</label>
                      <input
                        name="customerPhone"
                        required
                        placeholder="+91 98450 12345"
                        className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700">Email (Optional)</label>
                      <input
                        type="email"
                        name="customerEmail"
                        placeholder="suresh@example.com"
                        className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700">
                      Message & Requirements
                    </label>
                    <textarea
                      name="rawMessage"
                      required
                      rows={3}
                      placeholder="e.g. 2 adults and 1 kid, Kerala 5-6 nights in December, budget around 1.2 lakh total, houseboat a must"
                      className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>

                  {/* DPDP Act 2023 Plain Language Notice & Consent */}
                  <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="dpdpConsent"
                        required
                        className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                      <span className="text-xs text-zinc-600 leading-relaxed">
                        I agree to Company A contacting me regarding this holiday enquiry. My details will only be used to prepare this quote and never sold or shared.
                      </span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full rounded-lg bg-zinc-950 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {isPending ? "Sending Enquiry..." : "Request Detailed Quote"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

