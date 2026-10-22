import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Martin Angell",
  description: "Martin Angell's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="bg-bg text-fg font-sans antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
