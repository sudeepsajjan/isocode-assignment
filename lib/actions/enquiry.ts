"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { extractAndSuggestEnquiry } from "../ai";

export async function submitPublicEnquiry(prevState: any, formData: FormData) {
  try {
    const packageId = formData.get("packageId") as string | null;
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerEmail = formData.get("customerEmail") as string | null;
    const rawMessage = formData.get("rawMessage") as string;
    const consent = formData.get("dpdpConsent") === "on";

    if (!customerName || !customerPhone || !rawMessage) {
      return { success: false, error: "Please provide your name, phone number, and message." };
    }

    if (!consent) {
      return { success: false, error: "Please agree to the privacy notice to receive your quote." };
    }

    // Run AI / Heuristic extraction
    const extraction = await extractAndSuggestEnquiry(rawMessage);

    const enquiry = await db.enquiry.create({
      data: {
        packageId: packageId || undefined,
        sourceChannel: "WEB_FORM",
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        rawMessage,
        status: "NEW",
        extractedDest: extraction.destination,
        extractedDates: extraction.dates,
        extractedAdults: extraction.adults,
        extractedKids: extraction.kids,
        extractedBudget: extraction.budget,
        extractedMustHaves: extraction.mustHaves,
        suggestedPackageIds: JSON.stringify(extraction.suggestedPackageIds),
        draftReplyText: extraction.draftReply,
        dpdpConsentGiven: true,
        dpdpConsentAt: new Date(),
        dpdpConsentIp: "127.0.0.1",
      },
    });

    await db.activityLog.create({
      data: {
        userRole: "SYSTEM",
        userName: "Enquiry Engine",
        action: "ENQUIRY_RECEIVED",
        details: `Received enquiry #${enquiry.id.slice(-5)} from ${customerName}`,
      },
    });

    revalidatePath("/admin/inbox");
    return { success: true, enquiryId: enquiry.id };
  } catch (err: any) {
    console.error("Enquiry submission failed:", err);
    return { success: false, error: "Failed to submit enquiry. Please try again." };
  }
}

export async function updateEnquiryStatus(enquiryId: string, status: string, assigneeName?: string) {
  await db.enquiry.update({
    where: { id: enquiryId },
    data: {
      status,
      assigneeName: assigneeName || undefined,
      firstRepliedAt: status === "QUOTED" ? new Date() : undefined,
    },
  });

  await db.activityLog.create({
    data: {
      userRole: "CONSULTANT",
      userName: assigneeName || "Consultant",
      action: "STATUS_CHANGE",
      details: `Enquiry #${enquiryId.slice(-5)} moved to ${status}`,
    },
  });

  revalidatePath("/admin/inbox");
}

export async function updateEnquiryExtraction(
  enquiryId: string,
  data: {
    extractedDest?: string;
    extractedDates?: string;
    extractedAdults?: number;
    extractedKids?: number;
    extractedBudget?: number;
    extractedMustHaves?: string;
    draftReplyText?: string;
  }
) {
  await db.enquiry.update({
    where: { id: enquiryId },
    data,
  });

  revalidatePath("/admin/inbox");
}

export async function dispatchQuote(enquiryId: string, packageId: string, totalInr: number, customMessage: string) {
  const enquiry = await db.enquiry.findUnique({ where: { id: enquiryId } });
  if (!enquiry) throw new Error("Enquiry not found");

  const quote = await db.quote.create({
    data: {
      enquiryId,
      packageId,
      priceSnapshot: totalInr,
      summaryJson: JSON.stringify({
        notes: customMessage,
        adults: enquiry.extractedAdults || 2,
        kids: enquiry.extractedKids || 0,
        currency: "INR",
        priceBasis: "per person, twin sharing, including GST",
      }),
      status: "SENT",
    },
  });

  await db.enquiry.update({
    where: { id: enquiryId },
    data: {
      status: "QUOTED",
      firstRepliedAt: enquiry.firstRepliedAt || new Date(),
    },
  });

  await db.activityLog.create({
    data: {
      userRole: "CONSULTANT",
      userName: enquiry.assigneeName || "Chandran (Consultant)",
      action: "QUOTE_SENT",
      details: `Dispatched quote #Q-${quote.id.slice(-4)} for ₹${totalInr.toLocaleString("en-IN")} to ${enquiry.customerName}`,
    },
  });

  revalidatePath("/admin/inbox");
  return { success: true, quoteId: quote.id };
}

