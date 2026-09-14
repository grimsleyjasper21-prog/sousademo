import type { Metadata, Viewport } from "next";
import "./sender-globals.css";

export const metadata: Metadata = {
  title: "GRIMHART Sender",
  description: "One-tap WhatsApp outreach sender.",
  applicationName: "GRIMHART Sender",
  robots: { index: false, follow: false },
  manifest: "/sender-manifest.json",
  icons: {
    icon: "/icons/sender-favicon-32.png",
    apple: "/icons/sender-apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sender",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function SenderRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="snd-root">{children}</body>
    </html>
  );
}
