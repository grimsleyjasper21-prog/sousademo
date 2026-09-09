import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Archivo } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { PwaProvider } from "@/lib/pwa";
import { SALON } from "@/lib/services-data";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InstallBanner from "@/components/InstallBanner";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://sousa-demo.grimhart.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SOUSA — The Hair Expert · Peluquería en Palma de Mallorca",
  description:
    "SOUSA — The Hair Expert. Boutique de corte y color en Palma de Mallorca. Reserva tu cita online. Demostración digital de GRIMHART.",
  applicationName: "SOUSA",
  robots: { index: false, follow: false },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/favicon-32.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SOUSA",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "SOUSA — The Hair Expert",
    title: "SOUSA — The Hair Expert · Peluquería en Palma de Mallorca",
    description:
      "Boutique de corte y color en Palma de Mallorca. Reserva tu cita online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOUSA — The Hair Expert",
    description: "Boutique de corte y color en Palma de Mallorca.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0908",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: SALON.name,
  image: `${SITE_URL}/icons/icon-512.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Carrer Villalonga, 63, Bajo",
    addressLocality: "Palma de Mallorca",
    addressRegion: "Illes Balears",
    addressCountry: "ES",
  },
  telephone: SALON.phoneDisplay,
  sameAs: [SALON.instagramUrl],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: SALON.rating,
    reviewCount: SALON.reviewCount,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "09:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "09:00", closes: "18:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "09:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "09:00", closes: "18:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "18:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${bodoni.variable} ${archivo.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <I18nProvider>
          <PwaProvider>
            <a href="#main" className="skip-link">
              Ir al contenido principal / Skip to main content
            </a>
            <Nav />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <InstallBanner />
          </PwaProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
