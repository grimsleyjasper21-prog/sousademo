import type { Metadata, Viewport } from "next";
import LeadShell from "@/factory/pages/LeadShell";
import { sousaFontClass } from "@/leads/sousa/fonts";
import { sousa } from "@/leads/sousa/lead";

export const metadata: Metadata = {
  manifest: "/sousa/manifest.webmanifest",
  icons: {
    icon: "/leads/sousa/icons/favicon-32.png",
    apple: "/leads/sousa/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "SOUSA" },
};

export const viewport: Viewport = {
  themeColor: sousa.design.palette.ink,
  colorScheme: "dark",
};

export default function SousaLayout({ children }: LayoutProps<"/sousa">) {
  return (
    <div className={sousaFontClass}>
      <LeadShell lead={sousa}>{children}</LeadShell>
    </div>
  );
}
