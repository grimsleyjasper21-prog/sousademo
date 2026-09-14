/**
 * GRIMHART's own details — used by the proposals, never by a client demo.
 * (A client demo always uses the client's own contact details.)
 *
 * The WhatsApp number is the one every proposal's CTA opens. It is Jasper's
 * public business line, so it ships as the default and every deploy works with
 * no configuration; NEXT_PUBLIC_GRIMHART_WHATSAPP overrides it if the number
 * ever changes without a redeploy of this file.
 */
export const GRIMHART = {
  name: "GRIMHART",
  site: "grimhart.com",
  /** E.164, digits only — what wa.me expects. */
  whatsapp: "34613788381",
} as const;

export function grimhartWhatsappNumber(): string | null {
  const configured = process.env.NEXT_PUBLIC_GRIMHART_WHATSAPP?.replace(/\D/g, "");
  const number = configured && configured.length >= 8 ? configured : GRIMHART.whatsapp;
  return number.length >= 8 ? number : null;
}
