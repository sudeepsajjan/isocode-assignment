import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Company A database...");

  // 1. Clean existing records
  await prisma.activityLog.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.seasonalPrice.deleteMany();
  await prisma.packageVersion.deleteMany();
  await prisma.package.deleteMany();
  await prisma.user.deleteMany();

  // 2. Staff Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@isocode.com",
      name: "Rajan (Founder & MD)",
      role: "ADMIN",
    },
  });

  const consultant = await prisma.user.create({
    data: {
      email: "consultant@isocode.com",
      name: "Chandran (Senior Consultant)",
      role: "CONSULTANT",
    },
  });

  const content = await prisma.user.create({
    data: {
      email: "content@isocode.com",
      name: "Leela (Content Staff)",
      role: "CONTENT",
    },
  });

  // 3. Package 1: PKG-KL-07 (Published)
  const pkg1 = await prisma.package.create({
    data: {
      id: "PKG-KL-07",
      slug: "munnar-thekkady-alleppey-houseboat",
      title: "Munnar, Thekkady and Alleppey houseboat",
      durationDays: 6,
      hotelStandard: "4 star",
      destinations: JSON.stringify(["Munnar", "Thekkady", "Alleppey", "Kochi"]),
      heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80"
      ]),
      status: "PUBLISHED",
      seasonalPrices: {
        create: [
          {
            seasonName: "Peak (Oct-Mar)",
            startMonth: 10,
            endMonth: 3,
            priceInr: 32500,
            taxIncluded: true,
          },
          {
            seasonName: "Monsoon (Jun-Sep)",
            startMonth: 6,
            endMonth: 9,
            priceInr: 24900,
            taxIncluded: true,
          },
        ],
      },
    },
  });

  // Package 1 Version History
  const pkg1Version1 = await prisma.packageVersion.create({
    data: {
      packageId: pkg1.id,
      versionNumber: 1,
      title: pkg1.title,
      durationDays: pkg1.durationDays,
      hotelStandard: pkg1.hotelStandard,
      destinations: pkg1.destinations,
      itineraryJson: JSON.stringify([
        { day: 1, title: "Arrival in Kochi to Munnar", description: "Scenic drive through Cheeyappara waterfalls to tea-clad Munnar hills. Check-in to 4-star resort." },
        { day: 2, title: "Munnar Tea Plantations & Eravikulam", description: "Witness the Nilgiri Tahr at Eravikulam National Park and explore the historic Mattupetty Dam." },
        { day: 3, title: "Munnar to Thekkady Spice Sanctuary", description: "Drive to Periyar Wildlife Sanctuary. Evening spice plantation tour and Kalaripayattu performance." },
        { day: 4, title: "Thekkady to Alleppey Houseboat", description: "Board a traditional luxury Kerala houseboat at 12:00 PM. Cruise palm-fringed backwaters with freshly caught Karimeen lunch." },
        { day: 5, title: "Alleppey Backwaters to Marari", description: "Morning backwater cruise, village walk, and transfer to serene beachfront resort in Marari." },
        { day: 6, title: "Departure from Kochi", description: "Visit Fort Kochi Chinese fishing nets and Jew Town before drop-off at Cochin International Airport." }
      ]),
      inclusionsJson: JSON.stringify({
        inclusions: [
          "Private AC sedan with experienced chauffeur for all 6 days",
          "5 Nights accommodation in hand-picked 4-star properties",
          "All meals on Alleppey houseboat (Lunch, Evening Tea/Snacks, Dinner, Breakfast)",
          "Daily buffet breakfast at all resorts",
          "Periyar sanctuary entry and spice garden guided tour",
          "All toll, parking, driver allowance and GST included"
        ],
        exclusions: [
          "Airfare / Train tickets to/from Kochi",
          "Personal expenses, laundry, and optional boating fees",
          "Anything not explicitly mentioned in inclusions"
        ]
      }),
      changeSummary: "Initial approved baseline version",
      authorRole: "ADMIN",
      authorName: "Rajan (Founder & MD)",
    },
  });

  // Update Package activeVersionId
  await prisma.package.update({
    where: { id: pkg1.id },
    data: { activeVersionId: pkg1Version1.id },
  });

  // 4. Package 2: PKG-SI-12 (Draft)
  const pkg2 = await prisma.package.create({
    data: {
      id: "PKG-SI-12",
      slug: "madurai-rameswaram-kanyakumari",
      title: "Madurai, Rameswaram and Kanyakumari",
      durationDays: 5,
      hotelStandard: "3 star",
      destinations: JSON.stringify(["Madurai", "Rameswaram", "Kanyakumari"]),
      heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80"
      ]),
      status: "DRAFT",
      seasonalPrices: {
        create: [
          {
            seasonName: "All year",
            startMonth: 1,
            endMonth: 12,
            priceInr: 18750,
            taxIncluded: true,
          },
        ],
      },
    },
  });

  const pkg2Version1 = await prisma.packageVersion.create({
    data: {
      packageId: pkg2.id,
      versionNumber: 1,
      title: pkg2.title,
      durationDays: pkg2.durationDays,
      hotelStandard: pkg2.hotelStandard,
      destinations: pkg2.destinations,
      itineraryJson: JSON.stringify([
        { day: 1, title: "Madurai Meenakshi Amman Temple", description: "Arrival in temple city Madurai and evening Meenakshi Amman darshan." },
        { day: 2, title: "Madurai to Rameswaram", description: "Cross the historic Pamban Bridge to sacred island of Rameswaram." },
        { day: 3, title: "Dhanushkodi to Kanyakumari", description: "Visit ghost town Dhanushkodi and drive to the southern tip of India." },
        { day: 4, title: "Kanyakumari Vivekananda Rock", description: "Sunrise view, Vivekananda Rock Memorial, and Thiruvalluvar Statue." },
        { day: 5, title: "Departure from Trivandrum", description: "Transfer to Trivandrum Airport." }
      ]),
      inclusionsJson: JSON.stringify({
        inclusions: [
          "4 Nights in comfortable 3-star hotels",
          "AC vehicle for intercity transfers",
          "Daily breakfast",
          "Toll, parking and driver charges"
        ],
        exclusions: ["Temple special darshan tickets", "Lunch and dinners"]
      }),
      changeSummary: "Draft creation by content team",
      authorRole: "CONTENT",
      authorName: "Leela (Content Staff)",
    },
  });

  await prisma.package.update({
    where: { id: pkg2.id },
    data: { activeVersionId: pkg2Version1.id },
  });

  // 5. Package 3: PKG-KL-03 (Published)
  const pkg3 = await prisma.package.create({
    data: {
      id: "PKG-KL-03",
      slug: "wayanad-rainforest-wildlife-retreat",
      title: "Wayanad Rainforest & Wildlife Retreat",
      durationDays: 4,
      hotelStandard: "4 star",
      destinations: JSON.stringify(["Wayanad", "Calicut"]),
      heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1600&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80"
      ]),
      status: "PUBLISHED",
      seasonalPrices: {
        create: [
          {
            seasonName: "Peak (Oct-Mar)",
            startMonth: 10,
            endMonth: 3,
            priceInr: 21000,
            taxIncluded: true,
          },
          {
            seasonName: "Monsoon (Jun-Sep)",
            startMonth: 6,
            endMonth: 9,
            priceInr: 16500,
            taxIncluded: true,
          },
        ],
      },
    },
  });

  // 6. Seed Sample Enquiries
  // Sample Enquiry A (from brief): The Nair Family
  const enqA = await prisma.enquiry.create({
    data: {
      packageId: pkg1.id,
      sourceChannel: "WEB_FORM",
      customerName: "Suresh Nair",
      customerEmail: "suresh.nair@example.com",
      customerPhone: "+91 98450 12345",
      rawMessage: "Hi, 2 adults and 1 kid, Kerala 5-6 nights in December, budget around 1.2 lakh total, houseboat a must",
      status: "NEW",
      extractedDest: "Kerala",
      extractedDates: "December (Exact dates to be confirmed)",
      extractedAdults: 2,
      extractedKids: 1,
      extractedBudget: 120000,
      extractedMustHaves: "Houseboat",
      suggestedPackageIds: JSON.stringify(["PKG-KL-07"]),
      draftReplyText: "Dear Suresh, thank you for reaching out to Company A. Based on your December holiday for 2 adults and 1 child, we recommend our premier 6-day 'Munnar, Thekkady and Alleppey houseboat' package (PKG-KL-07), which features a dedicated private houseboat cruise. The Peak season rate is ₹32,500 per person, twin sharing, including GST (total ₹65,000 for 2 adults). May we know the age of your child to confirm the applicable child supplement?",
      dpdpConsentGiven: true,
      dpdpConsentAt: new Date(),
      dpdpConsentIp: "103.21.124.5",
    },
  });

  // Sample Enquiry B: Kabir & Aditi (Honeymoon)
  const enqB = await prisma.enquiry.create({
    data: {
      packageId: pkg1.id,
      sourceChannel: "EMAIL",
      customerName: "Kabir & Aditi",
      customerEmail: "kabir.aditi@example.com",
      customerPhone: "+91 98110 45678",
      rawMessage: "Looking for a luxury Kerala honeymoon for 6 nights in November. Private pool villa and backwater cruise preferred.",
      status: "QUOTED",
      assigneeName: "Chandran (Senior Consultant)",
      extractedDest: "Kerala",
      extractedDates: "November",
      extractedAdults: 2,
      extractedKids: 0,
      extractedBudget: 100000,
      extractedMustHaves: "Private pool villa, backwater cruise",
      suggestedPackageIds: JSON.stringify(["PKG-KL-07"]),
      draftReplyText: "Dear Kabir & Aditi, congratulations! We have curated our 6-day signature itinerary with an upgraded private luxury houseboat and pool villa stay.",
      dpdpConsentGiven: true,
      dpdpConsentAt: new Date(Date.now() - 3600000 * 2),
      firstRepliedAt: new Date(Date.now() - 3600000 * 1.5),
    },
  });

  // Create Quote for Enquiry B
  await prisma.quote.create({
    data: {
      enquiryId: enqB.id,
      packageId: pkg1.id,
      priceSnapshot: 65000,
      summaryJson: JSON.stringify({
        packageTitle: "Munnar, Thekkady and Alleppey houseboat",
        adults: 2,
        kids: 0,
        rateBasis: "₹32,500 per person, twin sharing, including GST",
        totalInr: 65000,
        validityDays: 14,
      }),
      status: "SENT",
    },
  });

  // 7. Seed Activity Log
  await prisma.activityLog.createMany({
    data: [
      {
        userRole: "ADMIN",
        userName: "Rajan (Founder & MD)",
        action: "PACKAGE_PUBLISHED",
        details: "Published PKG-KL-07 Munnar, Thekkady and Alleppey houseboat",
      },
      {
        userRole: "CONSULTANT",
        userName: "Chandran (Senior Consultant)",
        action: "QUOTE_SENT",
        details: "Dispatched Quote #Q-101 for Enquiry Kabir & Aditi (₹65,000)",
      },
    ],
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

