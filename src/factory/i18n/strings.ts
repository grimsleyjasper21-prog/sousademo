import type { Locale } from "../types";

/**
 * Shared interface copy — everything that is not business content.
 * Every key exists in every language: a demo must never show a half-translation.
 */
export type UiStrings = {
  nav: { menu: string; close: string; services: string; booking: string; location: string; contact: string; reviews: string; about: string; app: string; home: string; language: string };
  common: {
    bookNow: string; bookThis: string; viewServices: string; viewAll: string; call: string; whatsapp: string;
    directions: string; openInMaps: string; openNow: string; closedNow: string; from: string; consult: string;
    duration: string; minutes: string; price: string; hours: string; address: string; phone: string; email: string;
    follow: string; backTo: string; related: string; skipToContent: string; more: string; less: string;
  };
  services: { title: string; intro: string; indicativeNote: string; includes: string; practical: string; noPrice: string; category: string };
  reviews: { title: string; onGoogle: string; ratingOf: string; reviewCount: string; readMore: string };
  location: { title: string; howToFind: string; hoursTitle: string; timezoneNote: string };
  contact: { title: string; preferWhatsapp: string; writeUs: string; callUs: string; visitUs: string };
  booking: {
    title: string; intro: string;
    step: string; of: string;
    stepService: string; stepDate: string; stepTime: string; stepDetails: string; stepConfirm: string;
    chooseCategory: string; chooseService: string; chooseDate: string; chooseTime: string;
    noSlots: string; closedThatDay: string; loadingSlots: string; slotsError: string; retry: string;
    name: string; surname: string; phone: string; email: string; notes: string; notesHint: string; optional: string;
    required: string; invalidPhone: string; invalidEmail: string; invalidName: string;
    summary: string; service: string; date: string; time: string; total: string; back: string; next: string; confirm: string;
    sending: string; successTitle: string; successBody: string; reference: string; addAnother: string;
    errorTitle: string; errorBody: string; slotTakenTitle: string; slotTakenBody: string; chooseAnother: string;
    whatsappInstead: string; whatsappMessage: string; calendarNote: string; demoNote: string;
  };
  demo: { badge: string; footerNote: string; byGrimhart: string };
  pwa: {
    title: string; body: string; install: string; dismiss: string; installed: string;
    iosTitle: string; iosStep1: string; iosStep2: string; iosStep3: string;
    androidNote: string; back: string; disclaimer: string; nfcNote: string;
  };
};

const es: UiStrings = {
  nav: { menu: "Menú", close: "Cerrar", services: "Servicios", booking: "Reservar", location: "Dónde estamos", contact: "Contacto", reviews: "Opiniones", about: "El centro", app: "App", home: "Inicio", language: "Idioma" },
  common: {
    bookNow: "Reservar cita", bookThis: "Reservar este servicio", viewServices: "Ver servicios", viewAll: "Ver todos",
    call: "Llamar", whatsapp: "WhatsApp", directions: "Cómo llegar", openInMaps: "Abrir en Google Maps",
    openNow: "Abierto ahora", closedNow: "Cerrado ahora", from: "desde", consult: "Consultar",
    duration: "Duración", minutes: "min", price: "Precio", hours: "Horario", address: "Dirección",
    phone: "Teléfono", email: "Email", follow: "Síguenos", backTo: "Volver a", related: "También te puede interesar",
    skipToContent: "Ir al contenido", more: "Ver más", less: "Ver menos",
  },
  services: {
    title: "Servicios", intro: "Todo lo que hacemos, con su duración y su precio.",
    indicativeNote: "Precios y duraciones de ejemplo para esta demostración. Se ajustan a los reales antes de publicar.",
    includes: "Qué incluye", practical: "Antes de tu cita", noPrice: "Precio a consultar", category: "Categoría",
  },
  reviews: { title: "Opiniones", onGoogle: "en Google", ratingOf: "de 5", reviewCount: "opiniones", readMore: "Ver todas las opiniones" },
  location: { title: "Dónde estamos", howToFind: "Cómo llegar", hoursTitle: "Horario", timezoneNote: "Hora local" },
  contact: { title: "Contacto", preferWhatsapp: "Lo más rápido es WhatsApp.", writeUs: "Escríbenos", callUs: "Llámanos", visitUs: "Visítanos" },
  booking: {
    title: "Reservar cita", intro: "Elige servicio, día y hora. Tarda menos de un minuto.",
    step: "Paso", of: "de",
    stepService: "Servicio", stepDate: "Día", stepTime: "Hora", stepDetails: "Tus datos", stepConfirm: "Confirmar",
    chooseCategory: "Elige una categoría", chooseService: "Elige un servicio", chooseDate: "Elige un día", chooseTime: "Elige una hora",
    noSlots: "No quedan horas libres ese día.", closedThatDay: "Ese día está cerrado.", loadingSlots: "Buscando horas libres…",
    slotsError: "No hemos podido cargar las horas. Inténtalo otra vez.", retry: "Reintentar",
    name: "Nombre", surname: "Apellidos", phone: "Teléfono", email: "Email", notes: "Notas", notesHint: "Algo que debamos saber (opcional)", optional: "opcional",
    required: "Este campo es obligatorio", invalidPhone: "Escribe un teléfono válido", invalidEmail: "Escribe un email válido", invalidName: "Escribe tu nombre",
    summary: "Resumen", service: "Servicio", date: "Día", time: "Hora", total: "Total", back: "Atrás", next: "Continuar", confirm: "Confirmar reserva",
    sending: "Enviando…", successTitle: "Cita confirmada", successBody: "Te esperamos. Guarda esta referencia por si necesitas cambiarla.",
    reference: "Referencia", addAnother: "Hacer otra reserva",
    errorTitle: "No hemos podido confirmar la cita", errorBody: "Algo ha fallado al enviar la reserva. Puedes reintentarlo o escribirnos por WhatsApp.",
    slotTakenTitle: "Esa hora ya no está libre", slotTakenBody: "Alguien acaba de cogerla. Elige otra y seguimos.", chooseAnother: "Elegir otra hora",
    whatsappInstead: "Prefiero reservar por WhatsApp", whatsappMessage: "Hola, me gustaría reservar",
    calendarNote: "La reserva se envía directamente al calendario del centro.",
    demoNote: "Demostración: las horas mostradas se generan a partir del horario de apertura.",
  },
  demo: { badge: "Demo", footerNote: "Sitio de demostración creado por GRIMHART.", byGrimhart: "Una demostración de GRIMHART" },
  pwa: {
    title: "{name} en tu móvil",
    body: "Instálalo y tu próxima cita queda a un toque.",
    install: "Instalar",
    dismiss: "Ahora no",
    installed: "Ya está instalado en este dispositivo.",
    iosTitle: "En iPhone",
    iosStep1: "Pulsa el icono de Compartir",
    iosStep2: "Elige \"Añadir a pantalla de inicio\"",
    iosStep3: "Pulsa Añadir",
    androidNote: "En Android, el navegador te ofrecerá instalarlo automáticamente.",
    back: "Volver al sitio",
    disclaimer: "Es una aplicación web instalable, no una app de App Store o Google Play.",
    nfcNote: "Tarjeta NFC en el local → instalar → la próxima cita, a un toque.",
  },
};

const en: UiStrings = {
  nav: { menu: "Menu", close: "Close", services: "Services", booking: "Book", location: "Find us", contact: "Contact", reviews: "Reviews", about: "About", app: "App", home: "Home", language: "Language" },
  common: {
    bookNow: "Book an appointment", bookThis: "Book this service", viewServices: "View services", viewAll: "View all",
    call: "Call", whatsapp: "WhatsApp", directions: "Get directions", openInMaps: "Open in Google Maps",
    openNow: "Open now", closedNow: "Closed now", from: "from", consult: "On request",
    duration: "Duration", minutes: "min", price: "Price", hours: "Opening hours", address: "Address",
    phone: "Phone", email: "Email", follow: "Follow us", backTo: "Back to", related: "You might also like",
    skipToContent: "Skip to content", more: "Show more", less: "Show less",
  },
  services: {
    title: "Services", intro: "Everything we do, with times and prices.",
    indicativeNote: "Example prices and durations for this demo. They are set to the real ones before going live.",
    includes: "What's included", practical: "Before your appointment", noPrice: "Price on request", category: "Category",
  },
  reviews: { title: "Reviews", onGoogle: "on Google", ratingOf: "out of 5", reviewCount: "reviews", readMore: "Read all reviews" },
  location: { title: "Find us", howToFind: "Getting here", hoursTitle: "Opening hours", timezoneNote: "Local time" },
  contact: { title: "Contact", preferWhatsapp: "WhatsApp is the quickest way to reach us.", writeUs: "Message us", callUs: "Call us", visitUs: "Visit us" },
  booking: {
    title: "Book an appointment", intro: "Pick a service, a day and a time. It takes under a minute.",
    step: "Step", of: "of",
    stepService: "Service", stepDate: "Day", stepTime: "Time", stepDetails: "Your details", stepConfirm: "Confirm",
    chooseCategory: "Choose a category", chooseService: "Choose a service", chooseDate: "Choose a day", chooseTime: "Choose a time",
    noSlots: "No times left on that day.", closedThatDay: "We're closed that day.", loadingSlots: "Checking available times…",
    slotsError: "We couldn't load the times. Please try again.", retry: "Try again",
    name: "First name", surname: "Last name", phone: "Phone", email: "Email", notes: "Notes", notesHint: "Anything we should know (optional)", optional: "optional",
    required: "This field is required", invalidPhone: "Enter a valid phone number", invalidEmail: "Enter a valid email", invalidName: "Enter your name",
    summary: "Summary", service: "Service", date: "Day", time: "Time", total: "Total", back: "Back", next: "Continue", confirm: "Confirm booking",
    sending: "Sending…", successTitle: "Appointment confirmed", successBody: "See you then. Keep this reference in case you need to change it.",
    reference: "Reference", addAnother: "Make another booking",
    errorTitle: "We couldn't confirm the appointment", errorBody: "Something went wrong sending the booking. Try again, or message us on WhatsApp.",
    slotTakenTitle: "That time has just gone", slotTakenBody: "Someone booked it a moment ago. Pick another and we'll carry on.", chooseAnother: "Choose another time",
    whatsappInstead: "I'd rather book on WhatsApp", whatsappMessage: "Hi, I'd like to book",
    calendarNote: "Bookings go straight to the salon's calendar.",
    demoNote: "Demo: the times shown are generated from the opening hours.",
  },
  demo: { badge: "Demo", footerNote: "Demonstration site built by GRIMHART.", byGrimhart: "A GRIMHART demonstration" },
  pwa: {
    title: "{name} on your phone",
    body: "Install it and your next appointment is one tap away.",
    install: "Install",
    dismiss: "Not now",
    installed: "Already installed on this device.",
    iosTitle: "On iPhone",
    iosStep1: "Tap the Share icon",
    iosStep2: "Choose \"Add to Home Screen\"",
    iosStep3: "Tap Add",
    androidNote: "On Android your browser will offer to install it automatically.",
    back: "Back to the site",
    disclaimer: "This is an installable web app, not an App Store or Google Play app.",
    nfcNote: "NFC card in the salon → install → the next appointment, one tap away.",
  },
};

const de: UiStrings = {
  nav: { menu: "Menü", close: "Schließen", services: "Leistungen", booking: "Termin", location: "Anfahrt", contact: "Kontakt", reviews: "Bewertungen", about: "Über uns", app: "App", home: "Start", language: "Sprache" },
  common: {
    bookNow: "Termin buchen", bookThis: "Diese Leistung buchen", viewServices: "Leistungen ansehen", viewAll: "Alle ansehen",
    call: "Anrufen", whatsapp: "WhatsApp", directions: "Route", openInMaps: "In Google Maps öffnen",
    openNow: "Jetzt geöffnet", closedNow: "Jetzt geschlossen", from: "ab", consult: "Auf Anfrage",
    duration: "Dauer", minutes: "Min.", price: "Preis", hours: "Öffnungszeiten", address: "Adresse",
    phone: "Telefon", email: "E-Mail", follow: "Folgen", backTo: "Zurück zu", related: "Das könnte auch passen",
    skipToContent: "Zum Inhalt springen", more: "Mehr anzeigen", less: "Weniger anzeigen",
  },
  services: {
    title: "Leistungen", intro: "Alles, was wir anbieten – mit Dauer und Preis.",
    indicativeNote: "Beispielpreise und -zeiten für diese Demo. Vor dem Livegang werden sie durch die echten ersetzt.",
    includes: "Enthalten", practical: "Vor dem Termin", noPrice: "Preis auf Anfrage", category: "Kategorie",
  },
  reviews: { title: "Bewertungen", onGoogle: "bei Google", ratingOf: "von 5", reviewCount: "Bewertungen", readMore: "Alle Bewertungen lesen" },
  location: { title: "Anfahrt", howToFind: "So finden Sie uns", hoursTitle: "Öffnungszeiten", timezoneNote: "Ortszeit" },
  contact: { title: "Kontakt", preferWhatsapp: "Am schnellsten erreichen Sie uns per WhatsApp.", writeUs: "Schreiben Sie uns", callUs: "Rufen Sie an", visitUs: "Besuchen Sie uns" },
  booking: {
    title: "Termin buchen", intro: "Leistung, Tag und Uhrzeit wählen. Dauert keine Minute.",
    step: "Schritt", of: "von",
    stepService: "Leistung", stepDate: "Tag", stepTime: "Uhrzeit", stepDetails: "Ihre Daten", stepConfirm: "Bestätigen",
    chooseCategory: "Kategorie wählen", chooseService: "Leistung wählen", chooseDate: "Tag wählen", chooseTime: "Uhrzeit wählen",
    noSlots: "An dem Tag ist nichts mehr frei.", closedThatDay: "An dem Tag haben wir geschlossen.", loadingSlots: "Freie Zeiten werden geladen…",
    slotsError: "Die Zeiten konnten nicht geladen werden. Bitte erneut versuchen.", retry: "Erneut versuchen",
    name: "Vorname", surname: "Nachname", phone: "Telefon", email: "E-Mail", notes: "Notizen", notesHint: "Was wir wissen sollten (optional)", optional: "optional",
    required: "Pflichtfeld", invalidPhone: "Bitte gültige Telefonnummer eingeben", invalidEmail: "Bitte gültige E-Mail eingeben", invalidName: "Bitte Namen eingeben",
    summary: "Übersicht", service: "Leistung", date: "Tag", time: "Uhrzeit", total: "Gesamt", back: "Zurück", next: "Weiter", confirm: "Termin bestätigen",
    sending: "Wird gesendet…", successTitle: "Termin bestätigt", successBody: "Bis dann. Bewahren Sie die Referenz auf, falls Sie etwas ändern möchten.",
    reference: "Referenz", addAnother: "Weiteren Termin buchen",
    errorTitle: "Termin konnte nicht bestätigt werden", errorBody: "Beim Senden ist etwas schiefgelaufen. Bitte erneut versuchen oder per WhatsApp schreiben.",
    slotTakenTitle: "Diese Uhrzeit ist gerade weg", slotTakenBody: "Jemand war schneller. Wählen Sie eine andere Zeit.", chooseAnother: "Andere Uhrzeit wählen",
    whatsappInstead: "Lieber per WhatsApp buchen", whatsappMessage: "Hallo, ich möchte gern buchen",
    calendarNote: "Die Buchung geht direkt in den Kalender des Salons.",
    demoNote: "Demo: Die Zeiten werden aus den Öffnungszeiten erzeugt.",
  },
  demo: { badge: "Demo", footerNote: "Demo-Seite von GRIMHART.", byGrimhart: "Eine GRIMHART-Demo" },
  pwa: {
    title: "{name} auf dem Handy",
    body: "Installieren, und der nächste Termin ist einen Tipp entfernt.",
    install: "Installieren",
    dismiss: "Jetzt nicht",
    installed: "Auf diesem Gerät bereits installiert.",
    iosTitle: "Auf dem iPhone",
    iosStep1: "Auf das Teilen-Symbol tippen",
    iosStep2: "\"Zum Home-Bildschirm\" wählen",
    iosStep3: "Auf Hinzufügen tippen",
    androidNote: "Unter Android bietet der Browser die Installation automatisch an.",
    back: "Zurück zur Seite",
    disclaimer: "Eine installierbare Web-App, keine App aus dem App Store oder von Google Play.",
    nfcNote: "NFC-Karte im Salon → installieren → der nächste Termin, ein Tipp.",
  },
};

const ca: UiStrings = {
  nav: { menu: "Menú", close: "Tancar", services: "Serveis", booking: "Reservar", location: "On som", contact: "Contacte", reviews: "Opinions", about: "El centre", app: "App", home: "Inici", language: "Idioma" },
  common: {
    bookNow: "Reservar cita", bookThis: "Reservar aquest servei", viewServices: "Veure serveis", viewAll: "Veure'ls tots",
    call: "Trucar", whatsapp: "WhatsApp", directions: "Com arribar", openInMaps: "Obrir a Google Maps",
    openNow: "Obert ara", closedNow: "Tancat ara", from: "des de", consult: "Consultar",
    duration: "Durada", minutes: "min", price: "Preu", hours: "Horari", address: "Adreça",
    phone: "Telèfon", email: "Correu", follow: "Segueix-nos", backTo: "Tornar a", related: "També et pot interessar",
    skipToContent: "Anar al contingut", more: "Veure'n més", less: "Veure'n menys",
  },
  services: {
    title: "Serveis", intro: "Tot el que fem, amb durada i preu.",
    indicativeNote: "Preus i durades d'exemple per a aquesta demostració. S'ajusten als reals abans de publicar.",
    includes: "Què inclou", practical: "Abans de la cita", noPrice: "Preu a consultar", category: "Categoria",
  },
  reviews: { title: "Opinions", onGoogle: "a Google", ratingOf: "de 5", reviewCount: "opinions", readMore: "Veure totes les opinions" },
  location: { title: "On som", howToFind: "Com arribar", hoursTitle: "Horari", timezoneNote: "Hora local" },
  contact: { title: "Contacte", preferWhatsapp: "El més ràpid és WhatsApp.", writeUs: "Escriu-nos", callUs: "Truca'ns", visitUs: "Visita'ns" },
  booking: {
    title: "Reservar cita", intro: "Tria servei, dia i hora. Es fa en menys d'un minut.",
    step: "Pas", of: "de",
    stepService: "Servei", stepDate: "Dia", stepTime: "Hora", stepDetails: "Les teves dades", stepConfirm: "Confirmar",
    chooseCategory: "Tria una categoria", chooseService: "Tria un servei", chooseDate: "Tria un dia", chooseTime: "Tria una hora",
    noSlots: "No queden hores lliures aquell dia.", closedThatDay: "Aquell dia està tancat.", loadingSlots: "Cercant hores lliures…",
    slotsError: "No hem pogut carregar les hores. Torna-ho a provar.", retry: "Tornar a provar",
    name: "Nom", surname: "Cognoms", phone: "Telèfon", email: "Correu", notes: "Notes", notesHint: "Alguna cosa que hàgim de saber (opcional)", optional: "opcional",
    required: "Aquest camp és obligatori", invalidPhone: "Escriu un telèfon vàlid", invalidEmail: "Escriu un correu vàlid", invalidName: "Escriu el teu nom",
    summary: "Resum", service: "Servei", date: "Dia", time: "Hora", total: "Total", back: "Enrere", next: "Continuar", confirm: "Confirmar la reserva",
    sending: "Enviant…", successTitle: "Cita confirmada", successBody: "T'hi esperem. Guarda aquesta referència per si l'has de canviar.",
    reference: "Referència", addAnother: "Fer una altra reserva",
    errorTitle: "No hem pogut confirmar la cita", errorBody: "Alguna cosa ha fallat en enviar la reserva. Pots tornar-ho a provar o escriure'ns per WhatsApp.",
    slotTakenTitle: "Aquesta hora ja no és lliure", slotTakenBody: "Algú acaba d'agafar-la. Tria'n una altra i seguim.", chooseAnother: "Triar una altra hora",
    whatsappInstead: "Prefereixo reservar per WhatsApp", whatsappMessage: "Hola, m'agradaria reservar",
    calendarNote: "La reserva s'envia directament al calendari del centre.",
    demoNote: "Demostració: les hores mostrades es generen a partir de l'horari d'obertura.",
  },
  demo: { badge: "Demo", footerNote: "Lloc de demostració creat per GRIMHART.", byGrimhart: "Una demostració de GRIMHART" },
  pwa: {
    title: "{name} al mòbil",
    body: "Instal·la'l i la propera cita queda a un toc.",
    install: "Instal·lar",
    dismiss: "Ara no",
    installed: "Ja està instal·lat en aquest dispositiu.",
    iosTitle: "A l'iPhone",
    iosStep1: "Prem la icona de Compartir",
    iosStep2: "Tria \"Afegir a la pantalla d'inici\"",
    iosStep3: "Prem Afegir",
    androidNote: "A Android, el navegador t'oferirà instal·lar-lo automàticament.",
    back: "Tornar al lloc",
    disclaimer: "És una aplicació web instal·lable, no una app de l'App Store ni de Google Play.",
    nfcNote: "Targeta NFC al local → instal·lar → la propera cita, a un toc.",
  },
};

export const ui: Record<Locale, UiStrings> = { es, en, de, ca };
