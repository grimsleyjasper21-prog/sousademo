import { Archivo, Bodoni_Moda } from "next/font/google";

/**
 * SOUSA's typefaces. Each lead declares its own fonts in its own module so a
 * demo only ever downloads the two faces it actually uses — no shared font
 * registry dragging twenty families into every route.
 */
const display = Bodoni_Moda({
  variable: "--sousa-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Archivo({
  variable: "--sousa-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const sousaFontClass = `${display.variable} ${body.variable}`;

export const sousaFontStacks = {
  display: 'var(--sousa-display), "Bodoni Moda", Georgia, "Times New Roman", serif',
  body: 'var(--sousa-body), Archivo, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif',
};
