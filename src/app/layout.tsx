import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * Root layout stays deliberately empty of identity: every lead's fonts, colours
 * and chrome are applied by its own layout, so two demos in this one app share
 * nothing but the reset.
 */
export const metadata: Metadata = {
  title: "GRIMHART",
  description: "GRIMHART — demo environment.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
