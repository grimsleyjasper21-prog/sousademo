/* Translation dictionary for Salón Vera — Palma Hair Studio (demo).
   Keys are dot-paths, e.g. "nav.services". Used by app.js to walk the DOM
   and fill any element carrying data-i18n / data-i18n-placeholder / data-i18n-aria. */
window.SALON_I18N = {
  es: {
    meta: {
      title: "Salón Vera — Peluquería en Palma de Mallorca",
      description: "Salón Vera, peluquería y color en el centro de Palma. Reserva tu cita online en segundos."
    },
    skip: "Ir al contenido principal",
    brand: { name: "Salón Vera", tagline: "Hair Studio · Palma de Mallorca" },
    nav: {
      home: "Inicio",
      services: "Servicios",
      gallery: "Galería",
      about: "Equipo",
      testimonials: "Opiniones",
      booking: "Reservar",
      contact: "Contacto",
      menu: "Menú",
      close: "Cerrar menú"
    },
    lang: { switchTo: "English", label: "Idioma" },
    install: {
      text: "Instala Salón Vera en tu móvil para reservar más rápido.",
      button: "Instalar app",
      dismiss: "Ahora no",
      iosHint: "En iPhone: pulsa Compartir y luego \"Añadir a pantalla de inicio\"."
    },
    offline: {
      badge: "Sin conexión",
      text: "Estás sin conexión. Algunas secciones ya visitadas siguen disponibles."
    },
    hero: {
      eyebrow: "Peluquería · Color · Novias",
      title: "Tu mejor versión empieza en Palma",
      subtitle: "Cortes, color y tratamientos a medida en el corazón de Palma de Mallorca. Equipo bilingüe, resultados naturales.",
      ctaPrimary: "Reservar cita",
      ctaSecondary: "Ver servicios",
      badge1: "+12 años en Palma",
      badge2: "Se habla español e inglés",
      badge3: "Productos veganos"
    },
    services: {
      title: "Servicios",
      subtitle: "Precios orientativos. El precio final depende de la longitud y densidad del cabello.",
      bookAction: "Reservar",
      duration: "min",
      from: "desde",
      list: {
        cut: { name: "Corte y peinado", desc: "Corte personalizado, lavado y finalizado profesional.", price: "35€", duration: "45" },
        color: { name: "Color y Balayage", desc: "Color completo, mechas o balayage con asesoramiento de tono.", price: "65€", duration: "90" },
        blowdry: { name: "Peinado de fiesta", desc: "Secado y peinado para cualquier ocasión especial.", price: "25€", duration: "30" },
        treatment: { name: "Tratamiento capilar", desc: "Keratina, reparación e hidratación profunda.", price: "45€", duration: "60" },
        bridal: { name: "Novias y eventos", desc: "Prueba y peinado el día del evento, a domicilio o en salón.", price: "90€", duration: "120" },
        grooming: { name: "Barbería", desc: "Corte de caballero, arreglo de barba y afeitado clásico.", price: "30€", duration: "40" }
      }
    },
    gallery: {
      title: "Galería",
      subtitle: "Un vistazo a nuestro espacio y trabajos recientes.",
      items: {
        space: "El salón, luz natural del centro de Palma",
        color: "Balayage en tonos miel",
        cut: "Corte bob moderno",
        bridal: "Peinado de novia recogido",
        treatment: "Brillo tras tratamiento de keratina",
        team: "El equipo de Salón Vera"
      }
    },
    about: {
      title: "Nuestro equipo",
      subtitle: "Profesionales formados en Barcelona, Londres y Palma.",
      team: {
        marta: { name: "Marta Bonet", role: "Fundadora y Colorista", bio: "Especialista en color natural con más de 15 años de experiencia." },
        jaume: { name: "Jaume Ferrer", role: "Estilista Senior", bio: "Cortes de precisión y estilismo masculino." },
        aina: { name: "Aina Roig", role: "Especialista en tratamientos", bio: "Rituales capilares y recuperación del cabello dañado." }
      }
    },
    testimonials: {
      title: "Lo que dicen nuestras clientas",
      items: {
        t1: { quote: "El mejor balayage que me han hecho nunca. Ambiente relajado y muy profesional.", name: "Ana G.", meta: "Cliente habitual" },
        t2: { quote: "Great English-speaking team, easy online booking. My go-to salon whenever I'm in Palma.", name: "Tom R.", meta: "Visitante" },
        t3: { quote: "Me hicieron el peinado de novia y fue perfecto durante toda la boda. ¡Gracias equipo!", name: "Laura M.", meta: "Novia 2025" }
      }
    },
    booking: {
      title: "Reserva tu cita",
      subtitle: "Reserva en 4 pasos. Recibirás la confirmación en pantalla al instante.",
      demoNotice: "Demo: las reservas se guardan solo en este dispositivo (localStorage), no se envían a ningún servidor.",
      steps: { service: "Servicio", datetime: "Fecha y hora", details: "Tus datos", confirm: "Confirmación" },
      stepLabel: "Paso",
      of: "de",
      serviceStep: { title: "Elige un servicio", helper: "Selecciona el servicio que quieres reservar." },
      dateStep: {
        title: "Elige fecha y hora",
        dateLabel: "Fecha",
        timeLabel: "Hora disponible",
        noSlots: "No hay horas disponibles ese día. Prueba otra fecha.",
        pastDate: "Elige una fecha a partir de hoy.",
        closedDay: "Los domingos el salón está cerrado. Elige otro día."
      },
      detailsStep: {
        title: "Tus datos",
        name: "Nombre completo",
        namePlaceholder: "Tu nombre",
        email: "Correo electrónico",
        emailPlaceholder: "tu@email.com",
        phone: "Teléfono",
        phonePlaceholder: "+34 600 000 000",
        stylist: "Estilista preferido (opcional)",
        stylistAny: "Sin preferencia",
        notes: "Notas (opcional)",
        notesPlaceholder: "Alergias, referencias de color, etc.",
        consent: "Acepto que mis datos se usen únicamente para gestionar esta reserva de demostración."
      },
      confirmStep: {
        title: "Confirma tu reserva",
        service: "Servicio",
        when: "Fecha y hora",
        stylist: "Estilista",
        name: "Nombre",
        contact: "Contacto",
        edit: "Editar",
        submit: "Confirmar reserva"
      },
      success: {
        title: "¡Reserva confirmada!",
        body: "Hemos guardado tu cita. Te esperamos en Salón Vera, Carrer de la Missió, 12, Palma.",
        reference: "Referencia",
        addAnother: "Reservar otra cita",
        manage: "Gestionar mis reservas"
      },
      manage: {
        title: "Tus reservas en este dispositivo",
        empty: "Todavía no tienes reservas guardadas en este dispositivo.",
        cancel: "Cancelar",
        cancelled: "Cancelada",
        close: "Cerrar"
      },
      nav: { back: "Atrás", next: "Siguiente" },
      errors: {
        required: "Este campo es obligatorio.",
        email: "Introduce un correo válido.",
        phone: "Introduce un teléfono válido.",
        selectService: "Selecciona un servicio para continuar.",
        selectSlot: "Selecciona una hora disponible.",
        consent: "Debes aceptar el uso de tus datos para continuar."
      }
    },
    contact: {
      title: "Visítanos",
      subtitle: "En pleno centro histórico de Palma.",
      addressLabel: "Dirección",
      address: "Carrer de la Missió, 12, 07003 Palma, Illes Balears",
      hoursLabel: "Horario",
      hours: "Lun–Sáb 9:30–20:00 · Dom cerrado",
      phoneLabel: "Teléfono",
      emailLabel: "Correo",
      mapCaption: "Mapa ilustrativo — demo sin proveedor de mapas externo."
    },
    footer: {
      tagline: "Peluquería y color en el corazón de Palma de Mallorca.",
      rights: "Todos los derechos reservados.",
      demo: "Sitio de demostración — sin actividad comercial real.",
      madeWith: "Sitio bilingüe con reserva online y modo sin conexión (PWA)."
    },
    a11y: { toggleTheme: "Cambiar tema", carouselPrev: "Anterior", carouselNext: "Siguiente" }
  },

  en: {
    meta: {
      title: "Salón Vera — Hair Studio in Palma de Mallorca",
      description: "Salón Vera, hair and colour studio in central Palma. Book your appointment online in seconds."
    },
    skip: "Skip to main content",
    brand: { name: "Salón Vera", tagline: "Hair Studio · Palma de Mallorca" },
    nav: {
      home: "Home",
      services: "Services",
      gallery: "Gallery",
      about: "Team",
      testimonials: "Reviews",
      booking: "Book",
      contact: "Contact",
      menu: "Menu",
      close: "Close menu"
    },
    lang: { switchTo: "Español", label: "Language" },
    install: {
      text: "Install Salón Vera on your phone for faster booking.",
      button: "Install app",
      dismiss: "Not now",
      iosHint: "On iPhone: tap Share, then \"Add to Home Screen\"."
    },
    offline: {
      badge: "Offline",
      text: "You're offline. Previously visited sections are still available."
    },
    hero: {
      eyebrow: "Hair · Colour · Bridal",
      title: "Your best hair starts in Palma",
      subtitle: "Tailored cuts, colour and treatments in the heart of Palma de Mallorca. Bilingual team, natural results.",
      ctaPrimary: "Book an appointment",
      ctaSecondary: "See services",
      badge1: "12+ years in Palma",
      badge2: "Spanish & English spoken",
      badge3: "Vegan-friendly products"
    },
    services: {
      title: "Services",
      subtitle: "Indicative prices. Final price depends on hair length and density.",
      bookAction: "Book",
      duration: "min",
      from: "from",
      list: {
        cut: { name: "Cut & Style", desc: "Personalised haircut with wash and professional finish.", price: "€35", duration: "45" },
        color: { name: "Colour & Balayage", desc: "Full colour, highlights or balayage with tone consultation.", price: "€65", duration: "90" },
        blowdry: { name: "Blow-dry & Styling", desc: "Blow-dry and styling for any special occasion.", price: "€25", duration: "30" },
        treatment: { name: "Hair Treatment", desc: "Keratin, repair and deep hydration therapy.", price: "€45", duration: "60" },
        bridal: { name: "Bridal & Events", desc: "Trial and event-day styling, in-salon or on location.", price: "€90", duration: "120" },
        grooming: { name: "Men's Grooming", desc: "Men's haircut, beard trim and classic shave.", price: "€30", duration: "40" }
      }
    },
    gallery: {
      title: "Gallery",
      subtitle: "A look at our space and recent work.",
      items: {
        space: "The studio, natural light in central Palma",
        color: "Honey-toned balayage",
        cut: "Modern bob cut",
        bridal: "Bridal updo styling",
        treatment: "Shine after a keratin treatment",
        team: "The Salón Vera team"
      }
    },
    about: {
      title: "Our team",
      subtitle: "Professionals trained in Barcelona, London and Palma.",
      team: {
        marta: { name: "Marta Bonet", role: "Founder & Colourist", bio: "Natural colour specialist with 15+ years of experience." },
        jaume: { name: "Jaume Ferrer", role: "Senior Stylist", bio: "Precision cutting and men's styling." },
        aina: { name: "Aina Roig", role: "Treatment Specialist", bio: "Hair rituals and repair for damaged hair." }
      }
    },
    testimonials: {
      title: "What our clients say",
      items: {
        t1: { quote: "Best balayage I've ever had. Relaxed atmosphere and very professional.", name: "Ana G.", meta: "Regular client" },
        t2: { quote: "Great English-speaking team, easy online booking. My go-to salon whenever I'm in Palma.", name: "Tom R.", meta: "Visitor" },
        t3: { quote: "They did my bridal updo and it held perfectly all through the wedding. Thank you!", name: "Laura M.", meta: "2025 bride" }
      }
    },
    booking: {
      title: "Book your appointment",
      subtitle: "Book in 4 steps. You'll get instant on-screen confirmation.",
      demoNotice: "Demo: bookings are saved only on this device (localStorage) and are never sent to a server.",
      steps: { service: "Service", datetime: "Date & time", details: "Your details", confirm: "Confirmation" },
      stepLabel: "Step",
      of: "of",
      serviceStep: { title: "Choose a service", helper: "Select the service you'd like to book." },
      dateStep: {
        title: "Choose date & time",
        dateLabel: "Date",
        timeLabel: "Available time",
        noSlots: "No available times that day. Try another date.",
        pastDate: "Please choose a date from today onward.",
        closedDay: "The salon is closed on Sundays. Please pick another day."
      },
      detailsStep: {
        title: "Your details",
        name: "Full name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "you@email.com",
        phone: "Phone",
        phonePlaceholder: "+34 600 000 000",
        stylist: "Preferred stylist (optional)",
        stylistAny: "No preference",
        notes: "Notes (optional)",
        notesPlaceholder: "Allergies, colour references, etc.",
        consent: "I agree that my details are used only to manage this demo booking."
      },
      confirmStep: {
        title: "Confirm your booking",
        service: "Service",
        when: "Date & time",
        stylist: "Stylist",
        name: "Name",
        contact: "Contact",
        edit: "Edit",
        submit: "Confirm booking"
      },
      success: {
        title: "Booking confirmed!",
        body: "Your appointment is saved. We look forward to seeing you at Salón Vera, Carrer de la Missió, 12, Palma.",
        reference: "Reference",
        addAnother: "Book another appointment",
        manage: "Manage my bookings"
      },
      manage: {
        title: "Your bookings on this device",
        empty: "You don't have any bookings saved on this device yet.",
        cancel: "Cancel",
        cancelled: "Cancelled",
        close: "Close"
      },
      nav: { back: "Back", next: "Next" },
      errors: {
        required: "This field is required.",
        email: "Please enter a valid email.",
        phone: "Please enter a valid phone number.",
        selectService: "Please select a service to continue.",
        selectSlot: "Please select an available time.",
        consent: "You must agree to the use of your details to continue."
      }
    },
    contact: {
      title: "Visit us",
      subtitle: "Right in Palma's historic centre.",
      addressLabel: "Address",
      address: "Carrer de la Missió, 12, 07003 Palma, Balearic Islands",
      hoursLabel: "Hours",
      hours: "Mon–Sat 9:30am–8pm · Closed Sundays",
      phoneLabel: "Phone",
      emailLabel: "Email",
      mapCaption: "Illustrative map — demo with no external map provider."
    },
    footer: {
      tagline: "Hair and colour studio in the heart of Palma de Mallorca.",
      rights: "All rights reserved.",
      demo: "Demo website — no real business activity.",
      madeWith: "Bilingual site with online booking and offline mode (PWA)."
    },
    a11y: { toggleTheme: "Toggle theme", carouselPrev: "Previous", carouselNext: "Next" }
  }
};
