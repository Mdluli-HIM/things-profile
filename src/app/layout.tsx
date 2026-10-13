import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import "./globals.css";
import "./brand-ui.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thingsdesign.co.za"),
  title: "Things — Design & Development Studio",
  description:
    "Independent Cape Town studio creating graphic design, brand identities, websites and digital experiences. Working with businesses worldwide.",
  openGraph: {
    title: "Things — Design & Development Studio",
    description:
      "Independent Cape Town studio creating graphic design, brand identities, websites and digital experiences. Working with businesses worldwide.",
    url: "https://www.thingsdesign.co.za",
    siteName: "Things",
    images: [
      {
        url: "/images/brand/things-logo.png",
        width: 2172,
        height: 724,
        alt: "Things — Design & Development Studio",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Things — Design & Development Studio",
    description:
      "Independent Cape Town studio creating graphic design, brand identities, websites and digital experiences. Working with businesses worldwide.",
    images: [
      {
        url: "/images/brand/things-logo.png",
        alt: "Things — Design & Development Studio",
      },
    ],
  },
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
