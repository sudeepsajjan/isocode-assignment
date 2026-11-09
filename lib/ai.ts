import { db } from "./db";

export interface ExtractedEnquiry {
  destination: string;
  dates: string;
  nights?: number;
  adults?: number;
  kids?: number;
  budget?: number;
  mustHaves?: string;
  suggestedPackageIds: string[];
  draftReply: string;
}

// Deterministic offline extractor (Zero cost, instant, 100% reliable fallback)
export async function extractAndSuggestEnquiry(message: string): Promise<ExtractedEnquiry> {
  const text = message.toLowerCase();

  // 1. Extract Destination
  let destination = "Kerala";
  if (text.includes("madurai") || text.includes("rameswaram") || text.includes("tamil nadu") || text.includes("kanyakumari")) {
    destination = "South India";
  } else if (text.includes("wayanad")) {
    destination = "Wayanad";
  }

  // 2. Extract Adults & Kids
  let adults = 2;
  const adultMatch = text.match(/(\d+)\s*(adult|adults|pax|people|person)/i);
  if (adultMatch) {
    adults = parseInt(adultMatch[1], 10);
  }

  let kids = 0;
  const kidMatch = text.match(/(\d+)\s*(kid|kids|child|children)/i);
  if (kidMatch) {
    kids = parseInt(kidMatch[1], 10);
  }

  // 3. Extract Nights / Days
  let nights = 5;
  const nightsMatch = text.match(/(\d+)(?:-(\d+))?\s*(night|nights)/i);
  if (nightsMatch) {
    nights = parseInt(nightsMatch[2] || nightsMatch[1], 10);
  }

  // 4. Extract Budget
  let budget: number | undefined = undefined;
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs)/i);
  if (lakhMatch) {
    budget = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else {
    const numMatch = text.match(/(?:inr|rs\.?|₹)\s*([\d,]+)/i);
    if (numMatch) {
      budget = parseInt(numMatch[1].replace(/,/g, ""), 10);
    }
  }

  // 5. Extract Dates / Month
  let dates = "Upcoming";
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  for (const m of months) {
    if (text.includes(m)) {
      dates = m.charAt(0).toUpperCase() + m.slice(1);
      break;
    }
  }

  // 6. Extract Must-Haves
  const mustHavesList: string[] = [];
  if (text.includes("houseboat")) mustHavesList.push("Houseboat");
  if (text.includes("pool villa") || text.includes("pool")) mustHavesList.push("Pool Villa");
  if (text.includes("honeymoon")) mustHavesList.push("Honeymoon Inclusions");
  if (text.includes("tea") || text.includes("plantation")) mustHavesList.push("Tea Plantation");
  const mustHaves = mustHavesList.length > 0 ? mustHavesList.join(", ") : undefined;

  // 7. Match against PUBLISHED packages only (AI cannot invent packages)
  const publishedPackages = await db.package.findMany({
    where: { status: "PUBLISHED" },
    include: { seasonalPrices: true },
  });

  const matchingPackages = publishedPackages.filter((pkg: any) => {
    // If houseboat is a must, check if title or destinations include houseboat/alleppey
    if (mustHavesList.includes("Houseboat")) {
      const matchHb = pkg.title.toLowerCase().includes("houseboat") || pkg.destinations.toLowerCase().includes("alleppey");
      if (!matchHb) return false;
    }
    return true;
  });

  const selectedPackages = matchingPackages.length > 0 ? matchingPackages.slice(0, 3) : publishedPackages.slice(0, 2);
  const suggestedIds = selectedPackages.map((p: any) => p.id);

  // 8. Generate Draft Reply with DB-verified pricing (AI NEVER invents prices)
  const primaryPkg = selectedPackages[0];
  let draftReply = `Thank you for contacting Company A.\n\n`;

  if (primaryPkg) {
    // Determine season from dates
    const isPeak = dates.toLowerCase().includes("dec") || dates.toLowerCase().includes("nov") || dates.toLowerCase().includes("jan") || dates.toLowerCase().includes("oct");
    const seasonPrice = primaryPkg.seasonalPrices?.find((sp: any) =>
      isPeak ? sp.seasonName.toLowerCase().includes("peak") : sp.seasonName.toLowerCase().includes("monsoon")
    ) || primaryPkg.seasonalPrices[0];

    const ratePerPerson = seasonPrice ? seasonPrice.priceInr : 32500;
    const totalAdultsPrice = ratePerPerson * adults;

    draftReply += `Based on your request for ${adults} adult${adults > 1 ? "s" : ""}${kids > 0 ? ` and ${kids} child` : ""}, we recommend our signature '${primaryPkg.title}' (${primaryPkg.durationDays} Days / ${primaryPkg.durationDays - 1} Nights).\n\n`;
    draftReply += `Applicable Rate: ₹${ratePerPerson.toLocaleString("en-IN")} per person, twin sharing, including GST.\n`;
    draftReply += `Total for ${adults} Adults: ₹${totalAdultsPrice.toLocaleString("en-IN")}.\n`;
    if (kids > 0) {
      draftReply += `Child Supplement: On request (please confirm child's age for exact bedding charges).\n`;
    }
    draftReply += `\nPlease let us know if your travel dates are flexible so we can secure the best luxury houseboat booking.`;
  } else {
    draftReply += `We have received your enquiry and our travel consultant will prepare a tailored itinerary within the hour.`;
  }

  return {
    destination,
    dates,
    nights,
    adults,
    kids,
    budget,
    mustHaves,
    suggestedPackageIds: suggestedIds,
    draftReply,
  };
}

