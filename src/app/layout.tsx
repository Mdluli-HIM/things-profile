import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import "./globals.css";
import "./brand-ui.css";

export const metadata: Metadata = {
  title: "Things — Design & Development Studio",
  description:
    "Independent Cape Town studio working worldwide across strategy, design and development. We design digital things that matter."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
