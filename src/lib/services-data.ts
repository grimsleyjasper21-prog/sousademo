// SOUSA — The Hair Expert. Demo service catalogue.
// Prices and durations are fictional, for demonstrating the booking flow only.
export type CategoryId = "corte" | "color" | "tratamientos" | "styling";

export const categories: { id: CategoryId; es: string; en: string }[] = [
  { id: "corte", es: "Corte", en: "Cut" },
  { id: "color", es: "Color", en: "Colour" },
  { id: "tratamientos", es: "Tratamientos", en: "Treatments" },
  { id: "styling", es: "Styling", en: "Styling" },
];

export type Service = {
  id: string;
  category: CategoryId;
  nameEs: string;
  nameEn: string;
  durationMin: number;
  priceEUR: number;
};

export const services: Service[] = [
  { id: "corte-mujer", category: "corte", nameEs: "Corte Mujer", nameEn: "Women's Cut", durationMin: 45, priceEUR: 35 },
  { id: "corte-styling", category: "corte", nameEs: "Corte + Styling", nameEn: "Cut + Styling", durationMin: 60, priceEUR: 45 },
  { id: "cambio-look", category: "corte", nameEs: "Cambio de Look", nameEn: "New Look Cut", durationMin: 75, priceEUR: 55 },
  { id: "flequillo", category: "corte", nameEs: "Flequillo / Retoque", nameEn: "Fringe Trim / Touch-up", durationMin: 20, priceEUR: 15 },

  { id: "color-raiz", category: "color", nameEs: "Color Raíz", nameEn: "Root Colour", durationMin: 75, priceEUR: 45 },
  { id: "color-completo", category: "color", nameEs: "Color Completo", nameEn: "Full Colour", durationMin: 120, priceEUR: 65 },
  { id: "balayage", category: "color", nameEs: "Balayage", nameEn: "Balayage", durationMin: 180, priceEUR: 95 },
  { id: "mechas", category: "color", nameEs: "Mechas", nameEn: "Highlights", durationMin: 150, priceEUR: 85 },
  { id: "matiz", category: "color", nameEs: "Matiz / Toner", nameEn: "Toner / Gloss", durationMin: 45, priceEUR: 35 },

  { id: "tratamiento-intensivo", category: "tratamientos", nameEs: "Tratamiento Intensivo", nameEn: "Intensive Treatment", durationMin: 45, priceEUR: 40 },
  { id: "hidratacion", category: "tratamientos", nameEs: "Hidratación Profunda", nameEn: "Deep Hydration", durationMin: 45, priceEUR: 35 },
  { id: "reparacion", category: "tratamientos", nameEs: "Reparación Capilar", nameEn: "Hair Repair", durationMin: 60, priceEUR: 45 },
  { id: "taninoplastia", category: "tratamientos", nameEs: "Taninoplastia", nameEn: "Tanino Smoothing Treatment", durationMin: 150, priceEUR: 90 },

  { id: "lavado-peinado", category: "styling", nameEs: "Lavado + Peinado", nameEn: "Wash + Blow-dry", durationMin: 45, priceEUR: 30 },
  { id: "ondas-styling", category: "styling", nameEs: "Ondas / Styling", nameEn: "Waves / Styling", durationMin: 45, priceEUR: 35 },
  { id: "recogido", category: "styling", nameEs: "Recogido", nameEn: "Updo", durationMin: 60, priceEUR: 45 },
];

export function serviceName(s: Service, lang: "es" | "en") {
  return lang === "en" ? s.nameEn : s.nameEs;
}

export function categoryLabel(id: CategoryId, lang: "es" | "en") {
  const c = categories.find((c) => c.id === id)!;
  return lang === "en" ? c.en : c.es;
}

// Salon opening hours. 0 = Sunday.
export const openingHours: Record<number, { open: string; close: string } | null> = {
  0: null,
  1: { open: "09:00", close: "17:00" },
  2: { open: "09:00", close: "18:30" },
  3: { open: "09:00", close: "17:00" },
  4: { open: "09:00", close: "18:30" },
  5: { open: "09:00", close: "18:30" },
  6: { open: "09:00", close: "13:00" },
};

export const SALON = {
  name: "SOUSA — The Hair Expert",
  address: "Carrer Villalonga, 63, Bajo, Palma de Mallorca, Spain",
  phoneDisplay: "+34 611 160 256",
  phoneE164: "34611160256",
  instagram: "@sousa.thehairexpert",
  instagramUrl: "https://www.instagram.com/sousa.thehairexpert",
  rating: 5.0,
  reviewCount: 40,
};
