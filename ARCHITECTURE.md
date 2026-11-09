# TECHNICAL ARCHITECTURE — COMPANY A PLATFORM

## 1. System Overview

```
                      [ PUBLIC TRAVELLER ]
                                │
                        (SSR / Fast 4G)
                                ▼
       ┌──────────────────────────────────────────────────┐
       │             Next.js 14 App Router                │
       │       (Edge Optimized, Server Components)        │
       └───────┬───────────────────────────────┬──────────┘
               │                               │
         [Public Routes]                 [Staff Workspace]
      / /packages /enquire            /admin/inbox /admin/packages
               │                               │
               ▼                               ▼
       ┌────────────────┐             ┌────────────────────┐
       │ Next Image CDN │             │ AI Extraction Bus  │
       │  (WebP / R2)   │             │ (Gemini + Offline) │
       └────────────────┘             └─────────┬──────────┘
               │                                │
               └───────────────┬────────────────┘
                               ▼
                 ┌───────────────────────────┐
                 │       Prisma ORM          │
                 │ SQLite (Dev) / Turso (Prod)│
                 └───────────────────────────┘
```

---

## 2. 100% Free-Tier Infrastructure Architecture

1. **Application Runtime & SSR**:
   - **Framework**: Next.js 14 (App Router, Server Actions, Server Components).
   - **Hosting**: Cloudflare Pages / Vercel Hobby ($0 forever).
   - **SSL & Domain**: Free automated SSL certificates.
2. **Database**:
   - **Local & Testing**: SQLite (`file:./dev.db`) — zero overhead, portable, versioned in migrations.
   - **Production Edge**: Turso (LibSQL / SQLite edge) with 9GB free storage, 500 databases, and 1B reads/month, or Cloudflare D1 (5GB free).
3. **Image Storage & High-Speed CDN**:
   - **Development**: Next.js `/public/packages` directory with curated high-res Kerala photography.
   - **Production ($0)**: Cloudflare R2 (10 GB free storage, zero egress fees) or Cloudinary free tier with automatic WebP conversion to hit the <2.5s 4G budget.
4. **AI Layer**:
   - **Engine A**: Gemini 1.5 Flash API free tier (15 requests/minute, 1,500 requests/day, $0 cost).
   - **Engine B (Offline Fallback)**: Built-in deterministic regex/heuristic extractor that runs 100% locally if no API key is provided or when offline.
   - **Price Safety Guard**: Extracted parameters are matched against `SeasonalPrice` database rows. AI is never allowed to inject or modify prices.

---

## 3. Database Schema Design (Prisma)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Staff Users & Auth
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      String   // "ADMIN" | "CONSULTANT" | "CONTENT"
  createdAt DateTime @default(now())
}

// Master Package
model Package {
  id              String           @id // e.g. "PKG-KL-07"
  slug            String           @unique
  title           String
  durationDays    Int
  hotelStandard   String           // e.g. "4 star"
  destinations    String           // JSON string or comma-delimited
  heroImage       String
  galleryImages   String           // JSON array
  status          String           @default("DRAFT") // "DRAFT" | "PUBLISHED" | "ARCHIVED"
  activeVersionId String?
  currentVersion  PackageVersion?  @relation("ActiveVersion", fields: [activeVersionId], references: [id])
  versions        PackageVersion[] @relation("AllVersions")
  seasonalPrices  SeasonalPrice[]
  enquiries       Enquiry[]
  quotes          Quote[]
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

// Immutable Package Versioning (Enables 1-Click Rollback)
model PackageVersion {
  id            String   @id @default(cuid())
  packageId     String
  package       Package  @relation("AllVersions", fields: [packageId], references: [id], onDelete: Cascade)
  versionNumber Int
  title         String
  durationDays  Int
  itineraryJson String   // Full day-by-day JSON snapshot
  inclusionsJson String  // Inclusions and exclusions snapshot
  changeSummary String?  // e.g., "Updated Peak season price to ₹32,500"
  authorRole    String
  authorName    String
  createdAt     DateTime @default(now())
  activeIn      Package[] @relation("ActiveVersion")
}

// Seasonal Pricing Matrix
model SeasonalPrice {
  id          String   @id @default(cuid())
  packageId   String
  package     Package  @relation(fields: [packageId], references: [id], onDelete: Cascade)
  seasonName  String   // "Peak", "Monsoon", "All year"
  startMonth  Int      // 1-12
  endMonth    Int      // 1-12
  priceInr    Int      // Price per person twin sharing
  taxIncluded Boolean  @default(true)
}

// Enquiries
model Enquiry {
  id                 String    @id @default(cuid())
  packageId          String?
  package            Package?  @relation(fields: [packageId], references: [id])
  sourceChannel      String    // "WEB_FORM" | "EMAIL" | "WHATSAPP" | "PHONE" | "CHAT"
  customerName       String
  customerEmail      String?
  customerPhone      String
  rawMessage         String
  status             String    @default("NEW") // "NEW" | "QUOTED" | "BOOKED" | "LOST"
  assigneeId         String?
  
  // AI Extracted Fields (Editable by Consultant)
  extractedDest      String?
  extractedDates     String?
  extractedAdults    Int?
  extractedKids      Int?
  extractedBudget    Int?
  extractedMustHaves String?
  
  // DPDP Consent Log
  dpdpConsentGiven   Boolean   @default(false)
  dpdpConsentAt      DateTime?
  dpdpConsentIp      String?

  firstRepliedAt     DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  quotes             Quote[]
}

// Generated Quotes
model Quote {
  id             String   @id @default(cuid())
  enquiryId      String
  enquiry        Enquiry  @relation(fields: [enquiryId], references: [id])
  packageId      String
  package        Package  @relation(fields: [packageId], references: [id])
  priceSnapshot  Int      // Frozen total quote price
  summaryJson    String   // Snapshot of itinerary & quote items
  pdfUrl         String?
  sentAt         DateTime @default(now())
}

// Audit & Activity Trail
model ActivityLog {
  id         String   @id @default(cuid())
  userRole   String
  userName   String
  action     String   // e.g. "PRICE_UPDATE", "ROLLBACK", "QUOTE_SENT"
  details    String
  timestamp  DateTime @default(now())
}
```

---

## 4. The 6–8 Core Screens

### Screen 1: Explore & Catalog (`/`)
* **Role**: Public Traveller.
* **Layout**: Full-width imagery, clean sans-serif typography, compact filter bar (Duration, Season, Budget).
* **Interactions**: Fast server-side rendered cards displaying duration, destinations, hotel tier, and starting price (`"per person, twin sharing, including GST"`).

### Screen 2: Package Detail (`/packages/[slug]`)
* **Role**: Public Traveller.
* **Layout**: Editorial layout. Hero photograph, sticky enquiry action bar, day-by-day itinerary accordion, inclusions & exclusions list, seasonal pricing table.
* **Invariant**: One prominent, high-contrast `Enquire` button.

### Screen 3: Enquiry Modal / Drawer (`/packages/[slug]?enquire=true`)
* **Role**: Public Traveller.
* **Layout**: Minimal form. Fields for dates, party size (adults, kids), budget, notes.
* **DPDP Checkbox**: Unticked checkbox with plain-language notice: *"We use your details solely to send your quote. We never share data without consent."*
* **Outcome**: Instant server action submission with visual confirmation.

### Screen 4: Staff Authentication & Switcher (`/login`)
* **Role**: Admin, Consultant, Content Writer.
* **Layout**: Clean Apple Notes-style sign-in with one-click quick switchers for demoing `admin@isocode.com`, `consultant@isocode.com`, and `content@isocode.com`.

### Screen 5: Unified Enquiry Inbox (`/admin/inbox`)
* **Role**: Consultant & Admin.
* **Layout**: Linear-style two-pane triage:
  * **Left**: Enquiries list with status pills (`New`, `Quoted`, `Booked`, `Lost`), response time badges, and search.
  * **Right**: Split view of the customer's raw enquiry + **AI Extraction Card** (dates, party, budget) + **Top 3 Suggested Packages** with guaranteed DB prices.
* **Action**: One-click "Generate & Send Quote" composer.

### Screen 6: Package CMS & Seasonal Price Editor (`/admin/packages/[id]`)
* **Role**: Admin & Editor.
* **Layout**: Distraction-free editing view. Edit itinerary, destinations, hotel tier.
* **Seasonal Price Table**: Add/edit seasons, rates, with automated conflict checking (flags overlapping date windows).
* **Speed Target**: Staff can complete and save a price update in <5 minutes.

### Screen 7: Version History & 1-Click Rollback (`/admin/packages/[id]/history`)
* **Role**: Admin.
* **Layout**: Timeline list of all saved revisions with author, timestamp, and diff summary.
* **Action**: One-click `Rollback to this version` instantly sets that version as active without code deploy.

### Screen 8: Live Staging Preview (`/admin/packages/[id]/preview`)
* **Role**: Editor & Admin.
* **Layout**: Accurate side-by-side or responsive device view showing how the draft package will render publicly before publishing.

---

## 5. DX & Implementation Plan
1. **Scaffold Next.js 14 App** in workspace with TypeScript and Tailwind CSS.
2. **Setup Prisma Schema & SQLite DB**: Generate client and create seed script with sample data (`PKG-KL-07`, `PKG-SI-12`, sample inquiries).
3. **Build Core Components & Design System**: Neutral palette, high-contrast typography, zero-fluff layout primitives.
4. **Build Public Routes (Screens 1, 2, 3)**: Server-rendered, fast 4G load, sticky enquire drawer, DPDP consent.
5. **Build Staff Workspace (Screens 4, 5, 6, 7, 8)**: Role authentication, triage inbox with AI card, versioned package CMS with rollback, live preview.
6. **Seed & Verify**: Verify in browser with test enquiries and price changes.

