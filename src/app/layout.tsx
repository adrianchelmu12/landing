import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Imobify — Platforma completă pentru agenția ta imobiliară",
  description:
    "Gestionare proprietăți, clienți, pipeline vânzări și analytics. Totul într-un singur loc.",
  openGraph: {
    title: "Imobify — Platforma completă pentru agenția ta imobiliară",
    description:
      "Gestionare proprietăți, clienți, pipeline vânzări și analytics.",
    type: "website",
    locale: "ro_RO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html
        lang="ro"
        className={`${geistSans.variable} h-full antialiased scroll-smooth`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
