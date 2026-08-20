import type { Metadata } from "next";
import { Big_Shoulders_Stencil, PT_Sans, Martian_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const display = Big_Shoulders_Stencil({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-display",
});

const body = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "RentRadar — chirii Chișinău, urmărite zilnic",
  description:
    "Evoluția prețurilor la chirie în Chișinău, culeasă zilnic de pe 999.md.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}