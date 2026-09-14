import { Archivo } from "next/font/google";

/** GRIMHART's own typeface — used by the proposals and the factory index, never by a client demo. */
const grimhart = Archivo({
  variable: "--font-grimhart",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const grimhartFontClass = grimhart.variable;
