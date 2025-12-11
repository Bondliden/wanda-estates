import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "nav.home": "Home",
      "nav.properties": "Properties for sale",
      "nav.developments": "New developments",
      "nav.services": "Services",
      "nav.about": "About Us",
      "nav.contact": "Contact Us",
      
      "home.hero.title": "Luxury Apartments",
      "home.hero.subtitle": "Within a private estate",
      "home.hero.price": "Prices from €299,000",
      "home.hero.button": "View Property",
      
      "home.featured.title": "Featured Property",
      "home.featured.name": "Luxury Apartments",
      "home.featured.desc": "Within a private estate",
      "home.featured.price": "Prices from €299,000",
      "home.featured.button": "View Property",
      
      "home.services.title": "Our Services",
      "home.services.desc1": "Wanda Estate Property Group is a dynamic new real estate agency with a refreshing approach. Established by José Maria Esquerdo, Wanda Estate Property Group combines expertise from the real estate and financial sectors to help you make wise investments in real estate in Marbella and achieve maximum value from the property market.",
      "home.services.desc2": "We have a track record for delivering ambitious luxury resorts around the world for more than 20 years in hotel and real estate development, and significant experience tailoring investments to generate rapid profits for clients.",
      
      "home.contact.title": "Wanda Real Estate",
      "form.name": "Name",
      "form.email": "Email Address",
      "form.phone": "Phone",
      "form.message": "Message",
      "form.send": "Send",
      
      "footer.rights": "© {{year}} Wanda Estates. All rights reserved.",
      "footer.address": "El Rodeo Alto Nº4, Nueva Andalucía, 29660, Marbella, Málaga",
      
      "properties.title": "Properties for Sale",
      "properties.subtitle": "Discover our exclusive portfolio of luxury properties in Marbella and the Costa del Sol.",
      "properties.forsale": "For Sale",
      "properties.beds": "Beds",
      "properties.baths": "Baths",
      "properties.view": "View Details",
      
      "developments.title": "New Developments",
      "developments.subtitle": "Explore the finest new construction projects and off-plan investments in Marbella.",
      "developments.badge": "New Development",
      "developments.from": "From {{price}}",
      "developments.view": "View Project",
      
      "services.title": "Our Services",
      "services.subtitle": "Comprehensive real estate solutions tailored to your unique needs and lifestyle.",
      "services.why": "Why Choose Us?",
      "services.quote": "\"We combine industry expertise with financial acumen to help our clients make wise investments in real estate in Marbella.\"",
      "services.consultation": "Contact Us for a Consultation",
      
      "services.sales.title": "Property Sales",
      "services.sales.desc": "Our core business is the sale of luxury residential property. We guide you through the entire process, from property selection to completion, ensuring a seamless experience.",
      
      "services.investment.title": "Investment Consultancy",
      "services.investment.desc": "We provide expert advice on real estate investment opportunities in Marbella, helping you build a profitable portfolio with high potential for capital appreciation and rental yield.",
      
      "services.management.title": "Property Management",
      "services.management.desc": "Our comprehensive property management services ensure your investment is well-maintained and generating income when you're not in residence.",
      
      "services.project.title": "Project Development",
      "services.project.desc": "With our background in development, we can assist with refurbishment projects or new builds, connecting you with the best architects, contractors, and designers.",

      "about.title": "About Us",
      "about.subtitle": "A dynamic real estate agency with a refreshing approach to luxury property in Marbella.",
      "about.story.title": "Our Story",
      "about.story.heading": "Established by José Maria Esquerdo",
      "about.story.p1": "Wanda Estate Property Group is a dynamic new real estate agency with a refreshing approach. Established by José Maria Esquerdo, Wanda Estate Property Group combines expertise from the real estate and financial sectors to help you make wise investments in real estate in Marbella and achieve maximum value from the property market.",
      "about.story.p2": "We have a track record for delivering ambitious luxury resorts around the world for more than 20 years in hotel and real estate development, and significant experience tailoring investments to generate rapid profits for clients.",
      "about.story.p3": "Our mission is to provide a bespoke service that goes beyond the transaction. We aim to build long-lasting relationships with our clients, becoming their trusted advisors for all their real estate needs in Southern Spain.",
      "about.founder": "José Maria Esquerdo, Founder",
      
      "stats.experience": "Years Experience",
      "stats.sold": "Properties Sold",
      "stats.agents": "Expert Agents",
      "stats.volume": "Sales Volume",
      
      "about.cta.title": "Ready to find your dream property?",
      "about.cta.desc": "Contact our team today for a personalized consultation and let us help you navigate the Marbella real estate market.",
      "about.cta.button": "Contact Us",
      
      "contact.title": "Contact Us",
      "contact.subtitle": "Get in touch with our team to discuss your property requirements.",
      "contact.touch.title": "Get In Touch",
      "contact.touch.desc": "Whether you're looking to buy, sell, or invest in Marbella real estate, our team is here to assist you. Visit our office or contact us via phone or email.",
      "contact.visit": "Visit Us",
      "contact.call": "Call Us",
      "contact.email": "Email Us",
      "contact.hours": "Opening Hours",
      "contact.hours.week": "Monday - Friday: 9:00 - 18:00",
      "contact.hours.sat": "Saturday: By Appointment",
      "contact.hours.sun": "Sunday: Closed",
      "contact.form.title": "Send a Message",
      "contact.form.send": "Send Message"
    }
  },
  es: {
    translation: {
      "nav.home": "Inicio",
      "nav.properties": "Propiedades en venta",
      "nav.developments": "Nuevos desarrollos",
      "nav.services": "Servicios",
      "nav.about": "Sobre Nosotros",
      "nav.contact": "Contacto",
      
      "home.hero.title": "Apartamentos de Lujo",
      "home.hero.subtitle": "Dentro de una finca privada",
      "home.hero.price": "Precios desde 299.000 €",
      "home.hero.button": "Ver Propiedad",
      
      "home.featured.title": "Propiedad Destacada",
      "home.featured.name": "Apartamentos de Lujo",
      "home.featured.desc": "Dentro de una finca privada",
      "home.featured.price": "Precios desde 299.000 €",
      "home.featured.button": "Ver Propiedad",
      
      "home.services.title": "Nuestros Servicios",
      "home.services.desc1": "Wanda Estate Property Group es una nueva agencia inmobiliaria dinámica con un enfoque refrescante. Establecido por José María Esquerdo, Wanda Estate Property Group combina la experiencia de los sectores inmobiliario y financiero para ayudarle a realizar inversiones inteligentes en bienes raíces en Marbella y lograr el máximo valor del mercado inmobiliario.",
      "home.services.desc2": "Tenemos un historial de entrega de ambiciosos complejos de lujo en todo el mundo durante más de 20 años en el desarrollo hotelero e inmobiliario, y una experiencia significativa adaptando inversiones para generar beneficios rápidos para los clientes.",
      
      "home.contact.title": "Wanda Real Estate",
      "form.name": "Nombre",
      "form.email": "Correo Electrónico",
      "form.phone": "Teléfono",
      "form.message": "Mensaje",
      "form.send": "Enviar",
      
      "footer.rights": "© {{year}} Wanda Estates. Todos los derechos reservados.",
      "footer.address": "El Rodeo Alto Nº4, Nueva Andalucía, 29660, Marbella, Málaga",
      
      "properties.title": "Propiedades en Venta",
      "properties.subtitle": "Descubra nuestra exclusiva cartera de propiedades de lujo en Marbella y la Costa del Sol.",
      "properties.forsale": "En Venta",
      "properties.beds": "Dorm",
      "properties.baths": "Baños",
      "properties.view": "Ver Detalles",
      
      "developments.title": "Nuevos Desarrollos",
      "developments.subtitle": "Explore los mejores proyectos de nueva construcción e inversiones sobre plano en Marbella.",
      "developments.badge": "Nuevo Desarrollo",
      "developments.from": "Desde {{price}}",
      "developments.view": "Ver Proyecto",
      
      "services.title": "Nuestros Servicios",
      "services.subtitle": "Soluciones inmobiliarias integrales adaptadas a sus necesidades y estilo de vida únicos.",
      "services.why": "¿Por qué elegirnos?",
      "services.quote": "\"Combinamos la experiencia de la industria con la perspicacia financiera para ayudar a nuestros clientes a realizar inversiones inteligentes en bienes raíces en Marbella.\"",
      "services.consultation": "Contáctenos para una Consulta",
      
      "services.sales.title": "Venta de Propiedades",
      "services.sales.desc": "Nuestro negocio principal es la venta de propiedades residenciales de lujo. Le guiamos a través de todo el proceso, desde la selección de la propiedad hasta la finalización, asegurando una experiencia perfecta.",
      
      "services.investment.title": "Consultoría de Inversión",
      "services.investment.desc": "Ofrecemos asesoramiento experto sobre oportunidades de inversión inmobiliaria en Marbella, ayudándole a construir una cartera rentable con alto potencial de revalorización del capital y rendimiento de alquiler.",
      
      "services.management.title": "Gestión de Propiedades",
      "services.management.desc": "Nuestros servicios integrales de gestión de propiedades aseguran que su inversión esté bien mantenida y generando ingresos cuando no está en residencia.",
      
      "services.project.title": "Desarrollo de Proyectos",
      "services.project.desc": "Con nuestra experiencia en desarrollo, podemos ayudar con proyectos de reforma o nuevas construcciones, conectándole con los mejores arquitectos, contratistas y diseñadores.",

      "about.title": "Sobre Nosotros",
      "about.subtitle": "Una agencia inmobiliaria dinámica con un enfoque refrescante para la propiedad de lujo en Marbella.",
      "about.story.title": "Nuestra Historia",
      "about.story.heading": "Establecido por José María Esquerdo",
      "about.story.p1": "Wanda Estate Property Group es una nueva agencia inmobiliaria dinámica con un enfoque refrescante. Establecido por José María Esquerdo, Wanda Estate Property Group combina la experiencia de los sectores inmobiliario y financiero para ayudarle a realizar inversiones inteligentes en bienes raíces en Marbella y lograr el máximo valor del mercado inmobiliario.",
      "about.story.p2": "Tenemos un historial de entrega de ambiciosos complejos de lujo en todo el mundo durante más de 20 años en el desarrollo hotelero e inmobiliario, y una experiencia significativa adaptando inversiones para generar beneficios rápidos para los clientes.",
      "about.story.p3": "Nuestra misión es proporcionar un servicio a medida que va más allá de la transacción. Nuestro objetivo es construir relaciones duraderas con nuestros clientes, convirtiéndonos en sus asesores de confianza para todas sus necesidades inmobiliarias en el sur de España.",
      "about.founder": "José María Esquerdo, Fundador",
      
      "stats.experience": "Años de Experiencia",
      "stats.sold": "Propiedades Vendidas",
      "stats.agents": "Agentes Expertos",
      "stats.volume": "Volumen de Ventas",
      
      "about.cta.title": "¿Listo para encontrar la propiedad de sus sueños?",
      "about.cta.desc": "Contacte a nuestro equipo hoy para una consulta personalizada y permítanos ayudarle a navegar por el mercado inmobiliario de Marbella.",
      "about.cta.button": "Contáctenos",
      
      "contact.title": "Contacto",
      "contact.subtitle": "Póngase en contacto con nuestro equipo para discutir sus requisitos de propiedad.",
      "contact.touch.title": "Póngase en Contacto",
      "contact.touch.desc": "Ya sea que esté buscando comprar, vender o invertir en bienes raíces en Marbella, nuestro equipo está aquí para ayudarle. Visite nuestra oficina o contáctenos por teléfono o correo electrónico.",
      "contact.visit": "Visítenos",
      "contact.call": "Llámenos",
      "contact.email": "Envíenos un Email",
      "contact.hours": "Horario de Apertura",
      "contact.hours.week": "Lunes - Viernes: 9:00 - 18:00",
      "contact.hours.sat": "Sábado: Con Cita Previa",
      "contact.hours.sun": "Domingo: Cerrado",
      "contact.form.title": "Enviar un Mensaje",
      "contact.form.send": "Enviar Mensaje"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
