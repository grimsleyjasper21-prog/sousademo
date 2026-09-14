import type { Catalogue } from "@/factory/types";
import { sousaImages } from "./images";

/**
 * SOUSA's service menu.
 *
 * `pricing: "indicative"` is the important line here: these prices and
 * durations are realistic for a Palma boutique salon but they are NOT SOUSA's
 * published prices, so every surface that shows them also shows the disclosure
 * (see PricingNote), and the structured data omits the offer catalogue entirely.
 * Replace the numbers with the salon's own and flip this to "verified".
 */
export const sousaCatalogue: Catalogue = {
  pricing: "indicative",
  pricingNote: {
    es: "Precios y duraciones de ejemplo para esta demostración. Se sustituyen por los reales de SOUSA antes de publicar.",
    en: "Example prices and durations for this demo. They are replaced with SOUSA's own before going live.",
  },
  categories: [
    {
      id: "corte",
      name: { es: "Corte", en: "Cut" },
      blurb: {
        es: "El corte se piensa desde la caída natural, la densidad y el movimiento del pelo — no desde una plantilla.",
        en: "A cut built around how the hair actually falls, its density and its movement — never from a template.",
      },
      image: sousaImages.scissorsCutting,
    },
    {
      id: "color",
      name: { es: "Color", en: "Colour" },
      blurb: {
        es: "Balayage, mechas y matices pensados para envejecer bien con la raíz.",
        en: "Balayage, highlights and toners designed to grow out well.",
      },
      image: sousaImages.portraitCopper,
    },
    {
      id: "tratamientos",
      name: { es: "Tratamientos", en: "Treatments" },
      blurb: {
        es: "Trabajo sobre la fibra: hidratación, reparación y control del frizz.",
        en: "Work on the hair itself: hydration, repair and frizz control.",
      },
      image: sousaImages.textureDetail,
    },
    {
      id: "styling",
      name: { es: "Styling", en: "Styling" },
      blurb: {
        es: "Peinado y acabado para un día concreto o para una ocasión.",
        en: "Finishing and styling, for a particular day or a particular occasion.",
      },
      image: sousaImages.movementBlur,
    },
  ],
  services: [
    {
      id: "corte-mujer",
      categoryId: "corte",
      name: { es: "Corte Mujer", en: "Women's Cut" },
      short: { es: "Lavado, corte y secado con acabado natural.", en: "Wash, cut and blow-dry with a natural finish." },
      description: {
        es: "Un corte trabajado sobre tu propia caída de pelo: densidad, remolinos, cómo lo llevas a diario y cuánto tiempo estás dispuesta a dedicarle por la mañana. El objetivo es que siga funcionando dentro de tres semanas, no solo al salir del salón.",
        en: "A cut worked around your own hair: density, cowlicks, how you wear it day to day and how much time you're willing to give it in the morning. The point is that it still works three weeks from now, not only on the way out of the salon.",
      },
      includes: {
        es: ["Lavado y masaje capilar", "Corte a medida", "Secado y acabado"],
        en: ["Wash and scalp massage", "Tailored cut", "Blow-dry and finish"],
      },
      durationMin: 45,
      price: { amount: 35 },
      image: sousaImages.scissorsCutting,
      featured: true,
    },
    {
      id: "corte-styling",
      categoryId: "corte",
      name: { es: "Corte + Styling", en: "Cut + Styling" },
      short: { es: "Corte con peinado trabajado al detalle.", en: "A cut finished with full styling." },
      description: {
        es: "El mismo corte, con el acabado llevado más lejos: ondas, liso pulido o textura, según lo que quieras enseñar. Buena opción cuando hay un evento cerca o cuando quieres ver exactamente cómo puede quedar en casa.",
        en: "The same cut, taken further at the finish: waves, a polished straight, or texture — whatever you want to show. A good choice when there's an event coming up, or when you want to see exactly how it can look at home.",
      },
      includes: {
        es: ["Lavado y tratamiento exprés", "Corte a medida", "Peinado completo"],
        en: ["Wash and express treatment", "Tailored cut", "Full styling"],
      },
      durationMin: 60,
      price: { amount: 45 },
      image: sousaImages.portraitBrunette,
      featured: true,
    },
    {
      id: "cambio-look",
      categoryId: "corte",
      name: { es: "Cambio de Look", en: "New Look Cut" },
      short: { es: "Cambio de largo o de forma, con asesoramiento previo.", en: "A change of length or shape, with a consultation first." },
      description: {
        es: "Para cuando el cambio es grande: bob, largo corto, flequillo nuevo o capas que no habías llevado nunca. Empezamos hablando de lo que quieres y de lo que tu pelo puede sostener, y desde ahí decidimos.",
        en: "For when the change is a big one: a bob, going short, a new fringe, or layers you've never worn. It starts with a conversation about what you want and what your hair will hold, and the decision comes from there.",
      },
      includes: {
        es: ["Asesoramiento previo", "Lavado", "Corte y rediseño de forma", "Peinado"],
        en: ["Consultation", "Wash", "Cut and reshaping", "Styling"],
      },
      practical: {
        es: ["Si tienes referencias guardadas, tráelas — ayudan más que cualquier descripción."],
        en: ["If you've saved any references, bring them — they help more than any description."],
      },
      durationMin: 75,
      price: { amount: 55 },
      image: sousaImages.movementBlur,
    },
    {
      id: "flequillo",
      categoryId: "corte",
      name: { es: "Flequillo / Retoque", en: "Fringe Trim / Touch-up" },
      short: { es: "Mantenimiento rápido entre citas.", en: "A quick tidy between appointments." },
      description: {
        es: "Retoque de flequillo o de puntas para mantener la forma entre corte y corte. Entra y sale en veinte minutos.",
        en: "A fringe or ends trim to hold the shape between cuts. In and out in twenty minutes.",
      },
      durationMin: 20,
      price: { amount: 15 },
      image: sousaImages.scissorsMacro,
    },
    {
      id: "color-raiz",
      categoryId: "color",
      name: { es: "Color Raíz", en: "Root Colour" },
      short: { es: "Mantenimiento de color en la raíz.", en: "Colour maintenance at the root." },
      description: {
        es: "Cobertura de raíz para mantener el tono que ya llevas, sin volver a trabajar todo el largo. Es el mantenimiento habitual entre servicios de color completos.",
        en: "Root coverage to hold the tone you already have, without reworking the lengths. This is the usual maintenance between full colour services.",
      },
      includes: {
        es: ["Aplicación en raíz", "Tiempo de exposición", "Lavado y secado"],
        en: ["Root application", "Processing time", "Wash and blow-dry"],
      },
      durationMin: 75,
      price: { amount: 45 },
      image: sousaImages.portraitBrunette,
    },
    {
      id: "color-completo",
      categoryId: "color",
      name: { es: "Color Completo", en: "Full Colour" },
      short: { es: "Cambio de tono en todo el cabello.", en: "A tone change through the whole head." },
      description: {
        es: "Color trabajado de raíz a puntas cuando quieres cambiar de tono o unificar un color que ha quedado desigual. Se decide el tono contigo antes de empezar.",
        en: "Colour worked from root to ends when you want a new tone, or to even out a colour that has gone patchy. The tone is agreed with you before anything starts.",
      },
      includes: {
        es: ["Valoración del tono", "Aplicación completa", "Lavado y secado"],
        en: ["Tone assessment", "Full application", "Wash and blow-dry"],
      },
      durationMin: 120,
      price: { amount: 65 },
      image: sousaImages.portraitCopper,
      featured: true,
    },
    {
      id: "balayage",
      categoryId: "color",
      name: { es: "Balayage", en: "Balayage" },
      short: { es: "Degradado a mano alzada, con raíz suave.", en: "Freehand graduation with a soft root." },
      description: {
        es: "Aclarado hecho a mano sobre los medios y las puntas, dejando la raíz suave para que crezca sin marcar una línea. Es el servicio que más tiempo lleva y el que menos mantenimiento pide después.",
        en: "Freehand lightening through the mid-lengths and ends, leaving the root soft so it grows out without a line. It's the longest service to do and the one that asks least of you afterwards.",
      },
      includes: {
        es: ["Estudio del color de partida", "Aclarado a mano alzada", "Matiz", "Lavado y peinado"],
        en: ["Assessment of the starting colour", "Freehand lightening", "Toner", "Wash and styling"],
      },
      practical: {
        es: ["El tono final se valora con luz natural antes de terminar."],
        en: ["The final tone is checked in daylight before finishing."],
      },
      durationMin: 180,
      price: { amount: 95 },
      image: sousaImages.portraitBlonde,
      featured: true,
    },
    {
      id: "mechas",
      categoryId: "color",
      name: { es: "Mechas", en: "Highlights" },
      short: { es: "Mechas con papel para un aclarado más definido.", en: "Foiled highlights for a more defined lift." },
      description: {
        es: "Aclarado mecha a mecha con papel, para ganar luz de forma más marcada y controlada que con el balayage. Se combina con un matiz al final para ajustar el tono.",
        en: "Section-by-section lightening in foils, for brightness that's more defined and more controlled than balayage. Finished with a toner to set the tone.",
      },
      includes: {
        es: ["Aclarado con papel", "Matiz", "Lavado y secado"],
        en: ["Foiled lightening", "Toner", "Wash and blow-dry"],
      },
      durationMin: 150,
      price: { amount: 85 },
      image: sousaImages.strandBlonde,
    },
    {
      id: "matiz",
      categoryId: "color",
      name: { es: "Matiz / Toner", en: "Toner / Gloss" },
      short: { es: "Ajuste de tono y brillo.", en: "Tone and shine adjustment." },
      description: {
        es: "Corrección de tono para quitar reflejos no deseados y devolver brillo a un color que se ha ido apagando. Es un servicio corto que alarga bastante la vida del color.",
        en: "A tone correction to take out unwanted reflections and bring shine back to colour that has dulled. A short service that noticeably extends the life of the colour.",
      },
      durationMin: 45,
      price: { amount: 35 },
      image: sousaImages.strandCopper,
    },
    {
      id: "tratamiento-intensivo",
      categoryId: "tratamientos",
      name: { es: "Tratamiento Intensivo", en: "Intensive Treatment" },
      short: { es: "Nutrición profunda para pelo castigado.", en: "Deep nourishment for stressed hair." },
      description: {
        es: "Tratamiento en cabina para pelo que ha pasado por color, calor o sol. Se aplica con masaje y tiempo de exposición, y se nota sobre todo en el tacto y en cómo se desenreda después.",
        en: "An in-salon treatment for hair that has been through colour, heat or sun. Applied with massage and proper processing time; you notice it most in the feel and in how it combs out afterwards.",
      },
      durationMin: 45,
      price: { amount: 40 },
      image: sousaImages.textureDetail,
    },
    {
      id: "hidratacion",
      categoryId: "tratamientos",
      name: { es: "Hidratación Profunda", en: "Deep Hydration" },
      short: { es: "Para pelo seco por sol, sal o cloro.", en: "For hair dried out by sun, salt or chlorine." },
      description: {
        es: "Pensado para el verano en Mallorca: playa, sal y sol dejan el pelo áspero y apagado. Este servicio devuelve elasticidad y facilita el peinado del día a día.",
        en: "Built for a Mallorcan summer: beach, salt and sun leave hair rough and dull. This brings back elasticity and makes day-to-day styling easier.",
      },
      durationMin: 45,
      price: { amount: 35 },
      image: sousaImages.strandBrunette,
    },
    {
      id: "reparacion",
      categoryId: "tratamientos",
      name: { es: "Reparación Capilar", en: "Hair Repair" },
      short: { es: "Refuerzo de la fibra tras procesos químicos.", en: "Strengthening the hair after chemical work." },
      description: {
        es: "Trabajo sobre la estructura interna del cabello, indicado después de aclarados o decoloraciones. Se suele combinar con el servicio de color en la misma cita.",
        en: "Work on the internal structure of the hair, suited to the aftermath of lightening or bleaching. Often combined with a colour service in the same appointment.",
      },
      durationMin: 60,
      price: { amount: 45 },
      image: sousaImages.brandBg,
    },
    {
      id: "taninoplastia",
      categoryId: "tratamientos",
      name: { es: "Taninoplastia", en: "Tanino Smoothing Treatment" },
      short: { es: "Alisado progresivo y control del frizz.", en: "Progressive smoothing and frizz control." },
      description: {
        es: "Alisado progresivo que reduce el volumen y el encrespamiento manteniendo movimiento — no deja el pelo completamente liso ni rígido. El resultado se va suavizando con los lavados.",
        en: "A progressive smoothing service that reduces volume and frizz while keeping movement — it doesn't leave the hair poker-straight or stiff. The result softens gradually with washes.",
      },
      durationMin: 150,
      price: { amount: 90 },
      image: sousaImages.toolsFlatlay,
    },
    {
      id: "lavado-peinado",
      categoryId: "styling",
      name: { es: "Lavado + Peinado", en: "Wash + Blow-dry" },
      short: { es: "Lavado, secado y acabado.", en: "Wash, dry and finish." },
      description: {
        es: "Lavado con masaje y secado con la forma que quieras: liso, con cuerpo o con movimiento. Media hora larga y sales lista.",
        en: "A wash with massage and a blow-dry in whatever shape you want: straight, with body, or with movement. A good half hour and you're out.",
      },
      durationMin: 45,
      price: { amount: 30 },
      image: sousaImages.salonAtmosphere,
    },
    {
      id: "ondas-styling",
      categoryId: "styling",
      name: { es: "Ondas / Styling", en: "Waves / Styling" },
      short: { es: "Ondas trabajadas para una noche o una sesión.", en: "Worked waves for an evening or a shoot." },
      description: {
        es: "Ondas marcadas o desestructuradas según lo que busques, con fijación pensada para que aguanten la noche entera.",
        en: "Defined or undone waves depending on what you're after, set to hold for the whole evening.",
      },
      durationMin: 45,
      price: { amount: 35 },
      image: sousaImages.portraitCopper,
    },
    {
      id: "recogido",
      categoryId: "styling",
      name: { es: "Recogido", en: "Updo" },
      short: { es: "Recogido para bodas, eventos y ocasiones.", en: "An updo for weddings, events and occasions." },
      description: {
        es: "Recogido trabajado para un evento concreto: boda, bautizo o una noche importante. Si es para una fecha señalada, cuéntanoslo al reservar.",
        en: "An updo worked for a specific occasion: a wedding, a christening or an evening that matters. If it's for a set date, tell us when you book.",
      },
      durationMin: 60,
      price: { amount: 45 },
      image: sousaImages.portraitBrunette,
    },
  ],
};
