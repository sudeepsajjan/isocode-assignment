# PROJECT CONTEXT — COMPANY A WEB PLATFORM & CMS

## 1. Company Profile
* **Company**: Company A, Kochi, Kerala.
* **Business**: Tour operator selling Kerala and South India holiday packages to families, honeymooners, and foreign groups.
* **Scale**: 48 staff, ₹28–34 crore annual revenue, ~4,300 bookings/year across 60 packages.
* **Current Bottlenecks**:
  * 6-year-old freelance website: every package/price update costs ₹3,000 and 3 days.
  * Blogs sit on an isolated free platform with zero package conversion links.
  * Enquiries scattered across 5 channels (web form, chat, WhatsApp, email, phone) logged manually in Excel.
  * 25% of enquiries (~600/month) wait >12 hours for reply, halving conversion from 15% to 7% (costing ₹52.42L/yr lost margin).
  * Total annual inefficiency: **₹66.82 lakh/year**.

---

## 2. Target Business Metrics
| ID | Metric | Baseline | Target |
|---|---|---|---|
| **G1** | First human reply to enquiry (working hours) | ~25% wait >12 hrs | **90% within 1 hour** |
| **G2** | Package or seasonal price change in-house | 3 days, ₹3,000 | **≤ 10 minutes, ₹0** |
| **G3** | Blog to package linking | 0 links | **100% of new posts linked to ≥1 package** |
| **G4** | Organic search traffic | Current baseline | **+40% in 9 months** |
| **G5** | Enquiry-to-booking conversion | 15% | **18% in 9 months** |

---

## 3. Product Principles (Linear & Apple Notes Quality)
1. **Ruthless Simplicity**:
   - Every pixel and control must have a singular, clear purpose.
   - Cut taglines, decorative banners, filler descriptions, and secondary labels.
   - If a screen requires helper text to make sense, redesign the layout instead.
2. **Travel Sold by Feeling**:
   - Immersive, full-width curated photography.
   - Quiet, restrained typography hierarchy.
   - One singular, prominent `Enquire` button per package.
3. **Non-Technical Staff Usability**:
   - Changing a seasonal price must take under 5 minutes without prior training.
   - No hidden dropdown menus or complex nested modals.
4. **Zero-Fluff Agent & Developer Experience**:
   - Predictable server-rendered routing.
   - Immutable versioning for package CMS.
   - 100% free-tier architecture (SQLite / LibSQL, Cloudflare R2 / Cloudinary, Gemini Flash / Local NLP).

---

## 4. Roles & Access Matrix
* **Traveller (Public)**:
  * Browse destinations, packages, day-wise itineraries, inclusions, seasonal rates.
  * Filter/search packages.
  * Submit enquiry with explicit DPDP consent.
* **Admin (`admin / admin@123`)**:
  * Full access: package CMS, publish/rollback, role assignment, system settings, activity log.
* **Consultant (`consultant / consultant@123`)**:
  * Enquiry triage inbox, view AI extractions, edit & dispatch quotes, update enquiry status (`New`, `Quoted`, `Booked`, `Lost`).
  * Restricted from modifying package master prices.
* **Content Writer / Editor (`content / content@123`)**:
  * Create/edit draft packages, manage blog posts, link packages to articles. Cannot directly publish without admin review.

---

## 5. Non-Negotiable Invariants
1. **Pricing Invariant**:
   - Every package price displayed must explicitly read: `"per person, twin sharing, including GST"`.
   - AI is **strictly forbidden** from generating or altering prices. Prices in suggested quotes come solely from the database price table.
2. **DPDP Act 2023 Compliance**:
   - Form consent must be an **unticked checkbox** with clear privacy text.
   - Consent records timestamp, IP, and policy version.
   - 1-click consent withdrawal and data deletion requests.
   - AI service receives **message body only** (never customer name, phone, or email).
3. **SEO & Performance**:
   - Server-rendered pages with clean slugs (e.g., `/packages/munnar-thekkady-alleppey`).
   - Strict budget: < 2.5 seconds load time on 4G.
   - 301 redirects prepped for 140 legacy URLs.
   - Dynamic `sitemap.xml` generated automatically on publish.

---

## 6. Sample Seed Data
* **Package 1 (Published)**:
  * ID: `PKG-KL-07`
  * Title: *Munnar, Thekkady and Alleppey houseboat*
  * Duration: 6 Days (5 Nights)
  * Hotel Standard: 4 Star
  * Seasons:
    * Peak (Oct–Mar): ₹32,500 / person
    * Monsoon (Jun–Sep): ₹24,900 / person
* **Package 2 (Draft)**:
  * ID: `PKG-SI-12`
  * Title: *Madurai, Rameswaram and Kanyakumari*
  * Duration: 5 Days (4 Nights)
  * Hotel Standard: 3 Star
  * Price: ₹18,750 / person (All year)
* **Sample Enquiry**:
  * Text: *"Hi, 2 adults and 1 kid, Kerala 5-6 nights in December, budget around 1.2 lakh total, houseboat a must"*
  * Target Extraction: Destination=Kerala, Adults=2, Kids=1 (age unconfirmed), Nights=5-6, Month=December (Peak), Budget=₹1,20,000, MustHave=Houseboat.
  * Target Suggestion: `PKG-KL-07` (2 × ₹32,500 = ₹65,000 for adults; child price marked "to be confirmed").

