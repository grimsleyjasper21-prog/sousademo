import type { Lead } from "@/factory/types";
import { sousaCatalogue } from "./services";
import { sousaDesign } from "./design";
import { sousaImageMap } from "./images";

/**
 * SOUSA — The Hair Expert · Palma de Mallorca.
 *
 * Verified from the salon's own public presence: name, address, phone,
 * Instagram, opening hours and the Google rating. Not verified, and therefore
 * flagged as such in the catalogue: the price list.
 */
export const sousa: Lead = {
  slug: "sousa",
  vertical: "hair",
  business: {
    name: "SOUSA — The Hair Expert",
    shortName: "SOUSA",
    kicker: {
      es: "Palma de Mallorca · Corte + Color",
      en: "Palma de Mallorca · Cut + Colour",
    },
    tagline: {
      es: "Belleza, cuidado personal y buena música. Corte y color en Palma de Mallorca.",
      en: "Beauty, self-care and good music. Cut and colour in Palma de Mallorca.",
    },
  },
  locales: ["es", "en"],
  defaultLocale: "es",
  routes: {
    services: "servicios",
    booking: "reservar",
    location: "donde-estamos",
    contact: "contacto",
    app: "app",
  },
  contact: {
    phoneE164: "+34611160256",
    phoneDisplay: "+34 611 160 256",
    whatsappE164: "+34611160256",
    instagram: {
      handle: "@sousa.thehairexpert",
      url: "https://www.instagram.com/sousa.thehairexpert",
    },
  },
  location: {
    addressLines: ["Carrer Villalonga, 63, Bajo"],
    locality: "Palma de Mallorca",
    region: "Illes Balears",
    countryCode: "ES",
    mapsQuery: "SOUSA The Hair Expert, Carrer Villalonga 63, Palma de Mallorca",
    image: sousaImageMap.salonAtmosphere,
  },
  hours: {
    verified: true,
    timezone: "Europe/Madrid",
    week: {
      0: null,
      1: [{ open: "09:00", close: "17:00" }],
      2: [{ open: "09:00", close: "18:30" }],
      3: [{ open: "09:00", close: "17:00" }],
      4: [{ open: "09:00", close: "18:30" }],
      5: [{ open: "09:00", close: "18:30" }],
      6: [{ open: "09:00", close: "13:00" }],
    },
  },
  catalogue: sousaCatalogue,
  reputation: {
    rating: { value: 5.0, count: 40, source: "google" },
    // Deliberately empty: no verified review text has been collected, and an
    // invented quote would be worse than no quote.
    reviews: [],
  },
  booking: {
    enabled: true,
    // Demo mode: availability comes from the opening hours, and bookings land on
    // the GRIMHART demo calendar. Switch to "apps-script" once SOUSA's own
    // script is deployed — see google-apps-script/README.md.
    mode: "demo",
    calendarRef: "SOUSA",
    eventPrefix: "[SOUSA DEMO]",
    slotStepMin: 15,
    bufferMin: 0,
    leadTimeMin: 60,
    horizonDays: 90,
    requireEmail: false,
    whatsappFallback: true,
  },
  design: sousaDesign,
  copy: {
    statement: {
      eyebrow: { es: "El salón", en: "The salon" },
      title: {
        es: "Belleza, cuidado personal y buena música.",
        en: "Beauty, self-care and good music.",
      },
      body: {
        es: [
          "Es como SOUSA describe su propio sitio, y es exactamente lo que se busca al entrar: que te atiendan sin prisa, en un espacio donde apetece estar.",
        ],
        en: [
          "That is how SOUSA describes its own place, and it is exactly what you want walking in: unhurried attention, in a room you're happy to sit in.",
        ],
      },
    },
    about: {
      eyebrow: { es: "Oficio", en: "Craft" },
      title: { es: "Dos técnicas. Un mismo criterio.", en: "Two techniques. One standard." },
      body: {
        es: [
          "Cada corte se piensa a partir de la caída natural, la densidad y el movimiento del cabello — nunca de una plantilla. La precisión no es rigidez: es entender cómo va a caer el pelo dentro de una semana, no solo hoy.",
          "En color, balayage, mechas y matices se trabajan para envejecer bien con la raíz. El objetivo no es un color de foto, es un color que acompañe tu día a día en Palma, con luz natural y sal de mar de por medio.",
        ],
        en: [
          "Every cut starts from how the hair actually falls, its density and its movement — never from a template. Precision isn't rigidity: it's understanding how the hair will sit in a week's time, not only today.",
          "In colour, balayage, highlights and toners are worked so they grow out well. The aim isn't a colour that photographs well once, it's a colour that survives daily life in Palma, with strong daylight and sea salt in the mix.",
        ],
      },
      imageKey: "scissorsCutting",
    },
    cta: {
      title: { es: "Tu pelo merece esto.", en: "Your hair deserves this." },
      body: {
        es: "Reserva en menos de un minuto, o escríbenos por WhatsApp si prefieres contarlo antes.",
        en: "Book in under a minute, or send a WhatsApp first if you'd rather talk it through.",
      },
      imageKey: "movementBlur",
    },
  },
  images: sousaImageMap,
  meta: {
    title: {
      es: "SOUSA — The Hair Expert · Peluquería en Palma de Mallorca",
      en: "SOUSA — The Hair Expert · Hair Salon in Palma de Mallorca",
    },
    description: {
      es: "Corte, color y tratamientos en Palma de Mallorca. Reserva tu cita online en SOUSA — The Hair Expert.",
      en: "Cut, colour and treatments in Palma de Mallorca. Book your appointment online at SOUSA — The Hair Expert.",
    },
    demoDisclosure: true,
  },
  proposal: {
    locale: "es",
    intro:
      "He montado esta web alrededor de SOUSA para que puedas verla funcionando antes de decidir nada. Está hecha con vuestros servicios, vuestro horario y vuestra dirección: no es una plantilla con el logo cambiado.",
    noticed: [
      "Tenéis 40 opiniones y un 5,0 en Google. Esa reputación ahora mismo solo existe dentro de Google — en una web propia se ve desde el primer segundo.",
      "No encontré una web propia enlazada: quien os busca acaba en Instagram, y ahí no se ven los servicios ni las duraciones de un vistazo.",
      "Para pedir cita hay que escribir y esperar respuesta. Eso funciona, pero obliga a contestar a mano cada mensaje, también fuera de horario.",
      "Buena parte de quien os busca lo hace desde el móvil. Todo lo que viene después de ese primer toque tiene que ser fácil en una pantalla pequeña.",
    ],
    idea:
      "Una web que enseñe lo que hacéis y que deje pedir cita sola, a cualquier hora, sin que nadie tenga que contestar un mensaje.",
    customerCan: [
      "Ver todos los servicios con su duración y su precio, sin preguntar.",
      "Entrar en la ficha de cada servicio y entender qué incluye antes de reservar.",
      "Pedir cita eligiendo servicio, día y hora, con las horas ajustadas a vuestro horario real.",
      "Recibir la reserva directamente en el calendario del salón.",
      "Escribir por WhatsApp con el servicio y la hora ya puestos en el mensaje, si prefieren hablarlo.",
      "Ver dónde estáis, abrir Google Maps y llegar sin buscar la dirección.",
      "Leerlo todo en español o en inglés, según de dónde vengan.",
    ],
    features: [
      {
        title: "Reservas conectadas al calendario",
        body: "Cuando alguien reserva, la cita aparece en el calendario del salón. Sin apuntarla a mano, sin cadenas de mensajes.",
      },
      {
        title: "Horario real",
        body: "Las horas que se ofrecen salen de vuestro horario de apertura y de la duración de cada servicio. Nadie puede pedir un balayage veinte minutos antes de cerrar.",
      },
      {
        title: "WhatsApp con contexto",
        body: "Quien prefiera escribir, escribe — pero el mensaje llega ya con el servicio y la hora dentro.",
      },
      {
        title: "Ficha por servicio",
        body: "Cada servicio tiene su propia página, con lo que incluye y su precio. Eso también es lo que os encuentra Google.",
      },
      {
        title: "Español e inglés",
        body: "La web entera cambia de idioma, incluido el proceso de reserva. Palma recibe clientes de fuera todo el año.",
      },
      {
        title: "Hecha para el móvil",
        body: "Se diseñó primero para el teléfono, que es desde donde la va a abrir casi todo el mundo.",
      },
    ],
    showAppUpsell: true,
    closing:
      "Si te encaja, la dejo lista con vuestros precios reales y vuestras fotos, y conectamos las reservas a vuestro calendario. Si no, te quedas con la demo vista y no pasa nada.",
    ctaLabel: "Me interesa",
    whatsappMessage: "Hola Jasper, he visto la demo de SOUSA y me interesa.",
  },
};
