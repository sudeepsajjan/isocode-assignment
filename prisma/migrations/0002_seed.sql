-- Seed Users
INSERT INTO "User" ("id", "email", "name", "role", "createdAt") VALUES
('usr_admin', 'admin@isocode.com', 'Rajan (Founder & MD)', 'ADMIN', CURRENT_TIMESTAMP),
('usr_consultant', 'consultant@isocode.com', 'Chandran (Senior Consultant)', 'CONSULTANT', CURRENT_TIMESTAMP),
('usr_content', 'content@isocode.com', 'Leela (Content Staff)', 'CONTENT', CURRENT_TIMESTAMP);

-- Seed Package 1: PKG-KL-07
INSERT INTO "Package" ("id", "slug", "title", "durationDays", "hotelStandard", "destinations", "heroImage", "galleryImages", "status", "activeVersionId", "createdAt", "updatedAt") VALUES
('PKG-KL-07', 'munnar-thekkady-alleppey-houseboat', 'Munnar, Thekkady and Alleppey houseboat', 6, '4 star', '["Munnar","Thekkady","Alleppey","Kochi"]', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80', '["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80"]', 'PUBLISHED', 'ver_pkg_kl_07_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Version 1 for PKG-KL-07
INSERT INTO "PackageVersion" ("id", "packageId", "versionNumber", "title", "durationDays", "hotelStandard", "destinations", "itineraryJson", "inclusionsJson", "changeSummary", "authorRole", "authorName", "createdAt") VALUES
('ver_pkg_kl_07_1', 'PKG-KL-07', 1, 'Munnar, Thekkady and Alleppey houseboat', 6, '4 star', '["Munnar","Thekkady","Alleppey","Kochi"]',
'[{"day":1,"title":"Arrival in Kochi to Munnar","description":"Scenic drive through Cheeyappara waterfalls to tea-clad Munnar hills. Check-in to 4-star resort."},{"day":2,"title":"Munnar Tea Plantations & Eravikulam","description":"Witness the Nilgiri Tahr at Eravikulam National Park and explore Mattupetty Dam."},{"day":3,"title":"Munnar to Thekkady Spice Sanctuary","description":"Drive to Periyar Wildlife Sanctuary with evening spice plantation tour."},{"day":4,"title":"Thekkady to Alleppey Houseboat","description":"Board a traditional luxury Kerala houseboat at 12:00 PM. Cruise palm-fringed backwaters with freshly cooked meals."},{"day":5,"title":"Alleppey Backwaters to Marari","description":"Morning backwater cruise, village walk, and transfer to beachfront resort in Marari."},{"day":6,"title":"Departure from Kochi","description":"Visit Fort Kochi Chinese fishing nets before drop-off at Cochin Airport."}]',
'{"inclusions":["Private AC sedan with experienced chauffeur for all 6 days","5 Nights accommodation in 4-star properties","All meals on Alleppey houseboat","Daily buffet breakfast","Periyar sanctuary entry and spice garden tour","All toll, parking, driver allowance and GST included"],"exclusions":["Airfare / Train tickets to Kochi","Personal expenses and laundry","Anything not explicitly mentioned in inclusions"]}',
'Initial approved baseline version', 'ADMIN', 'Rajan (Founder & MD)', CURRENT_TIMESTAMP);

-- Seasonal Prices for PKG-KL-07
INSERT INTO "SeasonalPrice" ("id", "packageId", "seasonName", "startMonth", "endMonth", "priceInr", "taxIncluded") VALUES
('sp_kl07_peak', 'PKG-KL-07', 'Peak (Oct-Mar)', 10, 3, 32500, 1),
('sp_kl07_monsoon', 'PKG-KL-07', 'Monsoon (Jun-Sep)', 6, 9, 24900, 1);

-- Seed Package 2: PKG-SI-12 (Draft)
INSERT INTO "Package" ("id", "slug", "title", "durationDays", "hotelStandard", "destinations", "heroImage", "galleryImages", "status", "activeVersionId", "createdAt", "updatedAt") VALUES
('PKG-SI-12', 'madurai-rameswaram-kanyakumari', 'Madurai, Rameswaram and Kanyakumari', 5, '3 star', '["Madurai","Rameswaram","Kanyakumari"]', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80', '[]', 'DRAFT', 'ver_pkg_si_12_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "PackageVersion" ("id", "packageId", "versionNumber", "title", "durationDays", "hotelStandard", "destinations", "itineraryJson", "inclusionsJson", "changeSummary", "authorRole", "authorName", "createdAt") VALUES
('ver_pkg_si_12_1', 'PKG-SI-12', 1, 'Madurai, Rameswaram and Kanyakumari', 5, '3 star', '["Madurai","Rameswaram","Kanyakumari"]',
'[{"day":1,"title":"Madurai Meenakshi Temple","description":"Arrival in temple city Madurai."},{"day":2,"title":"Madurai to Rameswaram","description":"Cross Pamban bridge to sacred island."},{"day":3,"title":"Dhanushkodi to Kanyakumari","description":"Drive to southern tip of India."},{"day":4,"title":"Kanyakumari Memorial","description":"Sunrise and Vivekananda Rock."},{"day":5,"title":"Departure from Trivandrum","description":"Transfer to Trivandrum Airport."}]',
'{"inclusions":["4 Nights in 3-star hotels","AC transfers","Daily breakfast"],"exclusions":["Special darshan tickets","Lunch and dinner"]}',
'Draft creation by content team', 'CONTENT', 'Leela (Content Staff)', CURRENT_TIMESTAMP);

INSERT INTO "SeasonalPrice" ("id", "packageId", "seasonName", "startMonth", "endMonth", "priceInr", "taxIncluded") VALUES
('sp_si12_allyear', 'PKG-SI-12', 'All year', 1, 12, 18750, 1);

-- Seed Package 3: PKG-KL-03 (Published)
INSERT INTO "Package" ("id", "slug", "title", "durationDays", "hotelStandard", "destinations", "heroImage", "galleryImages", "status", "activeVersionId", "createdAt", "updatedAt") VALUES
('PKG-KL-03', 'wayanad-rainforest-wildlife-retreat', 'Wayanad Rainforest & Wildlife Retreat', 4, '4 star', '["Wayanad","Calicut"]', 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1600&q=80', '[]', 'PUBLISHED', 'ver_pkg_kl_03_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "PackageVersion" ("id", "packageId", "versionNumber", "title", "durationDays", "hotelStandard", "destinations", "itineraryJson", "inclusionsJson", "changeSummary", "authorRole", "authorName", "createdAt") VALUES
('ver_pkg_kl_03_1', 'PKG-KL-03', 1, 'Wayanad Rainforest & Wildlife Retreat', 4, '4 star', '["Wayanad","Calicut"]',
'[{"day":1,"title":"Calicut to Wayanad Ghats","description":"Drive up Thamarassery Churam."},{"day":2,"title":"Edakkal Caves & Tea Estate","description":"Neolithic petroglyphs and plantation walk."},{"day":3,"title":"Muthanga Wildlife Safari","description":"Morning elephant spotting safari."},{"day":4,"title":"Departure","description":"Transfer to Calicut Airport."}]',
'{"inclusions":["3 Nights rainforest resort","Private car","Breakfast and plantation tours"],"exclusions":["Flight/train","Personal tips"]}',
'Published initial version', 'ADMIN', 'Rajan (Founder & MD)', CURRENT_TIMESTAMP);

INSERT INTO "SeasonalPrice" ("id", "packageId", "seasonName", "startMonth", "endMonth", "priceInr", "taxIncluded") VALUES
('sp_kl03_peak', 'PKG-KL-03', 'Peak (Oct-Mar)', 10, 3, 21000, 1),
('sp_kl03_monsoon', 'PKG-KL-03', 'Monsoon (Jun-Sep)', 6, 9, 16500, 1);

-- Seed Sample Enquiry from Brief
INSERT INTO "Enquiry" ("id", "packageId", "sourceChannel", "customerName", "customerEmail", "customerPhone", "rawMessage", "status", "extractedDest", "extractedDates", "extractedAdults", "extractedKids", "extractedBudget", "extractedMustHaves", "suggestedPackageIds", "draftReplyText", "dpdpConsentGiven", "dpdpConsentAt", "dpdpConsentIp", "createdAt", "updatedAt") VALUES
('enq_sample_brief', 'PKG-KL-07', 'WEB_FORM', 'Suresh Nair', 'suresh.nair@example.com', '+91 98450 12345', 'Hi, 2 adults and 1 kid, Kerala 5-6 nights in December, budget around 1.2 lakh total, houseboat a must', 'NEW', 'Kerala', 'December (Peak)', 2, 1, 120000, 'Houseboat', '["PKG-KL-07"]', 'Dear Suresh, based on your December holiday request for 2 adults and 1 child, we recommend our premier 6-day Munnar, Thekkady and Alleppey houseboat package (PKG-KL-07). Peak season rate is ₹32,500 per person, twin sharing, including GST (total ₹65,000 for 2 adults). Child supplement is on request upon confirming age.', 1, CURRENT_TIMESTAMP, '103.21.124.5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Activity Logs
INSERT INTO "ActivityLog" ("id", "userRole", "userName", "action", "details", "timestamp") VALUES
('act_1', 'ADMIN', 'Rajan (Founder & MD)', 'PACKAGE_PUBLISHED', 'Published PKG-KL-07 Munnar, Thekkady and Alleppey houseboat', CURRENT_TIMESTAMP),
('act_2', 'SYSTEM', 'D1 Cloud Engine', 'DATABASE_INITIALIZED', 'Cloudflare D1 APAC database initialized with zero-cost tier', CURRENT_TIMESTAMP);

