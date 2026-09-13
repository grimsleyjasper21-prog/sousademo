import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Archivo } from "next/font/google";
import "./outreach-globals.css";
import Sidebar from "@/components/outreach/Sidebar";

const bodoni = Bodoni_Moda({
  variable: "--font-oe-bodoni",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const archivo = Archivo({
  variable: "--font-oe-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GRIMHART Outreach Engine",
  description: "Internal outbound sales tool for GRIMHART.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function OutreachRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${archivo.variable}`}>
      <body className="oe-root">
        <div className="oe-shell">
          <Sidebar />
          <main className="oe-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
