import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company A — Kerala & South India Journeys",
  description: "Curated South India holidays, backwater houseboat cruises, and hill station retreats.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}

