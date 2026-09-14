/**
 * GRIMHART's current commercial model. One source of truth: if it changes,
 * it changes here and every proposal follows.
 */
export const PRICING = {
  currency: "EUR",
  activation: 50,
  monthly: 50,
  appMonthly: 19,
  minimumMonths: 12,
} as const;

export const withApp = PRICING.monthly + PRICING.appMonthly;

export type PricingCopy = {
  activationLabel: string;
  monthlyLabel: string;
  webTitle: string;
  webBody: string;
  appTitle: string;
  appBody: string;
  appOptional: string;
  minimumTerm: string;
  perMonth: string;
  oneOff: string;
};

export const pricingCopy: Record<"es" | "en", PricingCopy> = {
  es: {
    activationLabel: "Activación",
    monthlyLabel: "Mensualidad",
    webTitle: "Web",
    webBody: "La web completa que estás viendo, con reservas integradas, actualizaciones y soporte.",
    appTitle: "Web + App",
    appBody: "Lo mismo, más la app de reservas propia del negocio para instalar en el móvil.",
    appOptional: "La app es opcional. La web ya incluye su propio sistema de reservas.",
    minimumTerm: "Permanencia mínima de 12 meses.",
    perMonth: "/mes",
    oneOff: "pago único",
  },
  en: {
    activationLabel: "Activation",
    monthlyLabel: "Monthly",
    webTitle: "Website",
    webBody: "The full site you're looking at, with booking built in, updates and support.",
    appTitle: "Website + App",
    appBody: "The same, plus the business's own installable booking app.",
    appOptional: "The app is optional. The website already includes its own booking system.",
    minimumTerm: "Minimum term of 12 months.",
    perMonth: "/month",
    oneOff: "one-off",
  },
};

export function grimhartWhatsapp(message: string): string | null {
  const number = process.env.NEXT_PUBLIC_GRIMHART_WHATSAPP?.replace(/\D/g, "");
  if (!number || number.length < 8) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
