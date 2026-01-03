import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import { UnitProvider } from "@/context/UnitContext";
import GenerativeBackground from "@/components/layout/GenerativeBackground";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.className} ${syne.variable} antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}>
        <GenerativeBackground />
        <UnitProvider>
          {children}
        </UnitProvider>
      </body>
    </html>
  );
}
