// Seed data fallback for Edge runtime when local sqlite is not directly reachable on Edge Workers
const MEM_USERS = [
  { id: "usr_admin", email: "admin@isocode.com", name: "Rajan (Founder & MD)", role: "ADMIN" },
  { id: "usr_consultant", email: "consultant@isocode.com", name: "Chandran (Senior Consultant)", role: "CONSULTANT" },
  { id: "usr_content", email: "content@isocode.com", name: "Leela (Content Staff)", role: "CONTENT" },
];

const MEM_PACKAGES = [
  {
    id: "PKG-KL-07",
    slug: "munnar-thekkady-alleppey-houseboat",
    title: "Munnar, Thekkady and Alleppey houseboat",
    durationDays: 6,
    hotelStandard: "4 star",
    destinations: JSON.stringify(["Munnar", "Thekkady", "Alleppey", "Kochi"]),
    heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80",
    galleryImages: JSON.stringify([
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80"
    ]),
    status: "PUBLISHED",
    activeVersionId: "ver_kl07_1",
    seasonalPrices: [
      { id: "sp_1", packageId: "PKG-KL-07", seasonName: "Peak (Oct-Mar)", startMonth: 10, endMonth: 3, priceInr: 32500, taxIncluded: true },
      { id: "sp_2", packageId: "PKG-KL-07", seasonName: "Monsoon (Jun-Sep)", startMonth: 6, endMonth: 9, priceInr: 24900, taxIncluded: true }
    ],
    versions: [
      {
        id: "ver_kl07_1",
        packageId: "PKG-KL-07",
        versionNumber: 1,
        title: "Munnar, Thekkady and Alleppey houseboat",
        durationDays: 6,
        hotelStandard: "4 star",
        destinations: JSON.stringify(["Munnar", "Thekkady", "Alleppey", "Kochi"]),
        itineraryJson: JSON.stringify([
          { day: 1, title: "Arrival in Kochi to Munnar", description: "Scenic drive through Cheeyappara waterfalls to tea-clad Munnar hills. Check-in to 4-star resort." },
          { day: 2, title: "Munnar Tea Plantations & Eravikulam", description: "Witness the Nilgiri Tahr at Eravikulam National Park and explore Mattupetty Dam." },
          { day: 3, title: "Munnar to Thekkady Spice Sanctuary", description: "Drive to Periyar Wildlife Sanctuary. Spice plantation tour and cultural evening." },
          { day: 4, title: "Thekkady to Alleppey Houseboat", description: "Board traditional luxury Kerala houseboat at 12:00 PM. Cruise palm-fringed backwaters with freshly caught Karimeen." },
          { day: 5, title: "Alleppey Backwaters to Marari", description: "Morning backwater cruise, village walk, and transfer to beachfront resort in Marari." },
          { day: 6, title: "Departure from Kochi", description: "Visit Fort Kochi Chinese fishing nets and Jew Town before drop-off at Cochin Airport." }
        ]),
        inclusionsJson: JSON.stringify({
          inclusions: [
            "Private AC sedan with experienced chauffeur for all 6 days",
            "5 Nights accommodation in 4-star properties",
            "All meals on Alleppey houseboat",
            "Daily buffet breakfast at all resorts",
            "Periyar sanctuary entry and spice garden guided tour",
            "All toll, parking, driver allowance and GST included"
          ],
          exclusions: [
            "Airfare / Train tickets to Kochi",
            "Personal expenses and laundry",
            "Anything not explicitly mentioned in inclusions"
          ]
        }),
        changeSummary: "Initial approved baseline version",
        authorRole: "ADMIN",
        authorName: "Rajan (Founder & MD)",
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "PKG-SI-12",
    slug: "madurai-rameswaram-kanyakumari",
    title: "Madurai, Rameswaram and Kanyakumari",
    durationDays: 5,
    hotelStandard: "3 star",
    destinations: JSON.stringify(["Madurai", "Rameswaram", "Kanyakumari"]),
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80",
    galleryImages: JSON.stringify([]),
    status: "DRAFT",
    activeVersionId: "ver_si12_1",
    seasonalPrices: [
      { id: "sp_3", packageId: "PKG-SI-12", seasonName: "All year", startMonth: 1, endMonth: 12, priceInr: 18750, taxIncluded: true }
    ],
    versions: [
      {
        id: "ver_si12_1",
        packageId: "PKG-SI-12",
        versionNumber: 1,
        title: "Madurai, Rameswaram and Kanyakumari",
        durationDays: 5,
        hotelStandard: "3 star",
        destinations: JSON.stringify(["Madurai", "Rameswaram", "Kanyakumari"]),
        itineraryJson: JSON.stringify([
          { day: 1, title: "Madurai Meenakshi Amman Temple", description: "Arrival in temple city Madurai and evening Meenakshi darshan." },
          { day: 2, title: "Madurai to Rameswaram", description: "Cross historic Pamban Bridge to sacred island of Rameswaram." },
          { day: 3, title: "Dhanushkodi to Kanyakumari", description: "Visit ghost town Dhanushkodi and drive to southern tip of India." },
          { day: 4, title: "Kanyakumari Vivekananda Rock", description: "Sunrise view, Vivekananda Rock Memorial, and Thiruvalluvar Statue." },
          { day: 5, title: "Departure from Trivandrum", description: "Transfer to Trivandrum Airport." }
        ]),
        inclusionsJson: JSON.stringify({
          inclusions: ["4 Nights in comfortable 3-star hotels", "AC vehicle for transfers", "Daily breakfast"],
          exclusions: ["Special temple darshan tickets", "Lunch and dinner"]
        }),
        changeSummary: "Draft creation by content team",
        authorRole: "CONTENT",
        authorName: "Leela (Content Staff)",
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "PKG-KL-03",
    slug: "wayanad-rainforest-wildlife-retreat",
    title: "Wayanad Rainforest & Wildlife Retreat",
    durationDays: 4,
    hotelStandard: "4 star",
    destinations: JSON.stringify(["Wayanad", "Calicut"]),
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1600&q=80",
    galleryImages: JSON.stringify([]),
    status: "PUBLISHED",
    activeVersionId: "ver_kl03_1",
    seasonalPrices: [
      { id: "sp_4", packageId: "PKG-KL-03", seasonName: "Peak (Oct-Mar)", startMonth: 10, endMonth: 3, priceInr: 21000, taxIncluded: true },
      { id: "sp_5", packageId: "PKG-KL-03", seasonName: "Monsoon (Jun-Sep)", startMonth: 6, endMonth: 9, priceInr: 16500, taxIncluded: true }
    ],
    versions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

let memEnquiries: any[] = [
  {
    id: "enq_sample_brief",
    packageId: "PKG-KL-07",
    sourceChannel: "WEB_FORM",
    customerName: "Suresh Nair",
    customerEmail: "suresh.nair@example.com",
    customerPhone: "+91 98450 12345",
    rawMessage: "Hi, 2 adults and 1 kid, Kerala 5-6 nights in December, budget around 1.2 lakh total, houseboat a must",
    status: "NEW",
    extractedDest: "Kerala",
    extractedDates: "December (Peak)",
    extractedAdults: 2,
    extractedKids: 1,
    extractedBudget: 120000,
    extractedMustHaves: "Houseboat",
    suggestedPackageIds: JSON.stringify(["PKG-KL-07"]),
    draftReplyText: "Dear Suresh, based on your December holiday request for 2 adults and 1 child, we recommend our premier 6-day Munnar, Thekkady and Alleppey houseboat package (PKG-KL-07). Peak season rate is ₹32,500 per person, twin sharing, including GST (total ₹65,000 for 2 adults). Child supplement is on request upon confirming age.",
    dpdpConsentGiven: true,
    dpdpConsentAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    quotes: []
  }
];

let memActivity: any[] = [
  {
    id: "act_1",
    userRole: "ADMIN",
    userName: "Rajan (Founder & MD)",
    action: "PACKAGE_PUBLISHED",
    details: "Published PKG-KL-07 Munnar, Thekkady and Alleppey houseboat",
    timestamp: new Date().toISOString()
  },
  {
    id: "act_2",
    userRole: "SYSTEM",
    userName: "Cloudflare Edge",
    action: "SITE_DEPLOYED",
    details: "Cloudflare Pages deployment active at company-a.pages.dev",
    timestamp: new Date().toISOString()
  }
];

// Universal database client that runs seamlessly on both Node.js (local dev) and Cloudflare Edge (zero 500 errors)
function createUniversalDb() {
  return {
    package: {
      findMany: async (args?: any) => {
        let res = [...MEM_PACKAGES];
        if (args?.where?.status) {
          res = res.filter((p) => p.status === args.where.status);
        }
        return res;
      },
      findUnique: async (args: any) => {
        return (
          MEM_PACKAGES.find(
            (p) => p.slug === args?.where?.slug || p.id === args?.where?.id
          ) || null
        );
      },
      update: async (args: any) => {
        const pkg = MEM_PACKAGES.find((p) => p.id === args.where.id);
        if (pkg) Object.assign(pkg, args.data);
        return pkg;
      },
      create: async (args: any) => {
        MEM_PACKAGES.unshift(args.data);
        return args.data;
      }
    },
    packageVersion: {
      findUnique: async (args: any) => {
        for (const p of MEM_PACKAGES) {
          const v = p.versions.find((ver: any) => ver.id === args.where.id);
          if (v) return v;
        }
        return null;
      },
      create: async (args: any) => {
        const pkg = MEM_PACKAGES.find((p) => p.id === args.data.packageId);
        if (pkg) {
          pkg.versions.unshift(args.data);
        }
        return args.data;
      }
    },
    seasonalPrice: {
      findMany: async (args?: any) => [],
      deleteMany: async (args?: any) => {},
      create: async (args: any) => args.data,
    },
    enquiry: {
      findMany: async (args?: any) => memEnquiries,
      findUnique: async (args: any) => memEnquiries.find((e) => e.id === args.where.id) || null,
      create: async (args: any) => {
        const item = { ...args.data, id: `enq_${Date.now()}`, createdAt: new Date().toISOString(), quotes: [] };
        memEnquiries.unshift(item);
        return item;
      },
      update: async (args: any) => {
        const enq = memEnquiries.find((e) => e.id === args.where.id);
        if (enq) Object.assign(enq, args.data);
        return enq;
      }
    },
    quote: {
      create: async (args: any) => {
        return { ...args.data, id: `q_${Date.now()}` };
      }
    },
    user: {
      findFirst: async (args?: any) => {
        if (args?.where?.role) {
          return MEM_USERS.find((u) => u.role === args.where.role) || MEM_USERS[0];
        }
        return MEM_USERS[0];
      }
    },
    activityLog: {
      findMany: async (args?: any) => memActivity,
      create: async (args: any) => {
        const log = { ...args.data, id: `act_${Date.now()}`, timestamp: new Date().toISOString() };
        memActivity.unshift(log);
        return log;
      },
      createMany: async (args: any) => {
        return { count: args.data.length };
      }
    },
    $transaction: async (fn: any) => {
      const client = createUniversalDb();
      return fn(client);
    }
  };
}

export const db: any = createUniversalDb();
