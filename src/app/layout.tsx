import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import { UnitProvider } from "@/context/UnitContext";

const GenerativeBackground = dynamic(
  () => import("@/components/layout/GenerativeBackground"),
  { ssr: false }
);

const syne = Syne({
  subsets: ["latin"],
  variable: '--font-syne',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Coffee Brew Tracker",
  description: "Track your coffee brewing sessions",
  themeColor: "#0b0704",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.className} ${syne.variable} antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-foreground focus:shadow-lg"
        >
          Skip to main content
        </a>
        <GenerativeBackground />
        <UnitProvider>
          {children}
        </UnitProvider>
      </body>
    </html>
  );
}
