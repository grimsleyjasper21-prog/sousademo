"use client";
import { useI18n } from "./i18n";
import { SALON } from "./services-data";

export function useWhatsAppMessage() {
  const { lang } = useI18n();
  const message =
    lang === "en"
      ? "Hi SOUSA! I'd like to book an appointment."
      : "¡Hola SOUSA! Quiero reservar una cita.";
  return `https://wa.me/${SALON.phoneE164}?text=${encodeURIComponent(message)}`;
}
