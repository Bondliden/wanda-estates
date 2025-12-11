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
  },
  nl: {
    translation: {
      "nav.home": "Home",
      "nav.properties": "Huizen te koop",
      "nav.developments": "Nieuwbouw",
      "nav.services": "Diensten",
      "nav.about": "Over ons",
      "nav.contact": "Contact",
      
      "home.hero.title": "Luxe Appartementen",
      "home.hero.subtitle": "Binnen een privélandgoed",
      "home.hero.price": "Prijzen vanaf €299.000",
      "home.hero.button": "Bekijk Eigendom",
      
      "home.featured.title": "Uitgelichte Woning",
      "home.featured.name": "Luxe Appartementen",
      "home.featured.desc": "Binnen een privélandgoed",
      "home.featured.price": "Prijzen vanaf €299.000",
      "home.featured.button": "Bekijk Eigendom",
      
      "home.services.title": "Onze Diensten",
      "home.services.desc1": "Wanda Estate Property Group is een dynamisch nieuw makelaarskantoor met een verfrissende aanpak. Opgericht door José Maria Esquerdo, combineert Wanda Estate Property Group expertise uit de vastgoed- en financiële sectoren om u te helpen verstandig te investeren in onroerend goed in Marbella en maximale waarde uit de vastgoedmarkt te halen.",
      "home.services.desc2": "We hebben een staat van dienst in het leveren van ambitieuze luxe resorts over de hele wereld gedurende meer dan 20 jaar in hotel- en vastgoedontwikkeling, en aanzienlijke ervaring in het op maat maken van investeringen om snelle winsten voor klanten te genereren.",
      
      "home.contact.title": "Wanda Real Estate",
      "form.name": "Naam",
      "form.email": "E-mailadres",
      "form.phone": "Telefoon",
      "form.message": "Bericht",
      "form.send": "Verzenden",
      
      "footer.rights": "© {{year}} Wanda Estates. Alle rechten voorbehouden.",
      "footer.address": "El Rodeo Alto Nº4, Nueva Andalucía, 29660, Marbella, Málaga",
      
      "properties.title": "Huizen te Koop",
      "properties.subtitle": "Ontdek onze exclusieve portefeuille van luxe eigendommen in Marbella en aan de Costa del Sol.",
      "properties.forsale": "Te Koop",
      "properties.beds": "Slp",
      "properties.baths": "Bad",
      "properties.view": "Bekijk Details",
      
      "developments.title": "Nieuwbouwprojecten",
      "developments.subtitle": "Ontdek de mooiste nieuwbouwprojecten en off-plan investeringen in Marbella.",
      "developments.badge": "Nieuwbouw",
      "developments.from": "Vanaf {{price}}",
      "developments.view": "Bekijk Project",
      
      "services.title": "Onze Diensten",
      "services.subtitle": "Uitgebreide vastgoedoplossingen afgestemd op uw unieke behoeften en levensstijl.",
      "services.why": "Waarom voor ons kiezen?",
      "services.quote": "\"We combineren branche-expertise met financieel inzicht om onze klanten te helpen verstandig te investeren in onroerend goed in Marbella.\"",
      "services.consultation": "Neem contact op voor een consult",
      
      "services.sales.title": "Verkoop van Vastgoed",
      "services.sales.desc": "Onze kernactiviteit is de verkoop van luxe residentieel vastgoed. Wij begeleiden u door het hele proces, van vastgoedselectie tot afronding, voor een naadloze ervaring.",
      
      "services.investment.title": "Investeringsadvies",
      "services.investment.desc": "Wij bieden deskundig advies over vastgoedinvesteringen in Marbella, zodat u een winstgevende portefeuille kunt opbouwen met een hoog potentieel voor waardestijging en huurrendement.",
      
      "services.management.title": "Vastgoedbeheer",
      "services.management.desc": "Onze uitgebreide vastgoedbeheerdiensten zorgen ervoor dat uw investering goed wordt onderhouden en inkomsten genereert wanneer u er niet bent.",
      
      "services.project.title": "Projectontwikkeling",
      "services.project.desc": "Met onze achtergrond in ontwikkeling kunnen wij u helpen met renovatieprojecten of nieuwbouw, en u in contact brengen met de beste architecten, aannemers en ontwerpers.",

      "about.title": "Over Ons",
      "about.subtitle": "Een dynamisch makelaarskantoor met een verfrissende aanpak van luxe vastgoed in Marbella.",
      "about.story.title": "Ons Verhaal",
      "about.story.heading": "Opgericht door José Maria Esquerdo",
      "about.story.p1": "Wanda Estate Property Group is een dynamisch nieuw makelaarskantoor met een verfrissende aanpak. Opgericht door José Maria Esquerdo, combineert Wanda Estate Property Group expertise uit de vastgoed- en financiële sectoren om u te helpen verstandig te investeren in onroerend goed in Marbella en maximale waarde uit de vastgoedmarkt te halen.",
      "about.story.p2": "We hebben een staat van dienst in het leveren van ambitieuze luxe resorts over de hele wereld gedurende meer dan 20 jaar in hotel- en vastgoedontwikkeling, en aanzienlijke ervaring in het op maat maken van investeringen om snelle winsten voor klanten te genereren.",
      "about.story.p3": "Onze missie is om een service op maat te bieden die verder gaat dan de transactie. We streven ernaar langdurige relaties met onze klanten op te bouwen en hun vertrouwde adviseurs te worden voor al hun vastgoedbehoeften in Zuid-Spanje.",
      "about.founder": "José Maria Esquerdo, Oprichter",
      
      "stats.experience": "Jaren Ervaring",
      "stats.sold": "Huizen Verkocht",
      "stats.agents": "Expert Makelaars",
      "stats.volume": "Verkoopvolume",
      
      "about.cta.title": "Klaar om uw droomhuis te vinden?",
      "about.cta.desc": "Neem vandaag nog contact op met ons team voor een persoonlijk consult en laat ons u helpen navigeren op de vastgoedmarkt van Marbella.",
      "about.cta.button": "Neem Contact Op",
      
      "contact.title": "Contact",
      "contact.subtitle": "Neem contact op met ons team om uw vastgoedwensen te bespreken.",
      "contact.touch.title": "Neem Contact Op",
      "contact.touch.desc": "Of u nu vastgoed in Marbella wilt kopen, verkopen of investeren, ons team staat klaar om u te helpen. Bezoek ons kantoor of neem contact met ons op via telefoon of e-mail.",
      "contact.visit": "Bezoek Ons",
      "contact.call": "Bel Ons",
      "contact.email": "Mail Ons",
      "contact.hours": "Openingstijden",
      "contact.hours.week": "Maandag - Vrijdag: 9:00 - 18:00",
      "contact.hours.sat": "Zaterdag: Op afspraak",
      "contact.hours.sun": "Zondag: Gesloten",
      "contact.form.title": "Stuur een bericht",
      "contact.form.send": "Verstuur bericht"
    }
  },
  sv: {
    translation: {
      "nav.home": "Hem",
      "nav.properties": "Fastigheter till salu",
      "nav.developments": "Nyproduktion",
      "nav.services": "Tjänster",
      "nav.about": "Om oss",
      "nav.contact": "Kontakt",
      
      "home.hero.title": "Lyxiga Lägenheter",
      "home.hero.subtitle": "Inom ett privat område",
      "home.hero.price": "Priser från €299,000",
      "home.hero.button": "Visa Fastighet",
      
      "home.featured.title": "Utvald Fastighet",
      "home.featured.name": "Lyxiga Lägenheter",
      "home.featured.desc": "Inom ett privat område",
      "home.featured.price": "Priser från €299,000",
      "home.featured.button": "Visa Fastighet",
      
      "home.services.title": "Våra Tjänster",
      "home.services.desc1": "Wanda Estate Property Group är en dynamisk ny fastighetsbyrå med ett uppfriskande tillvägagångssätt. Grundat av José Maria Esquerdo, kombinerar Wanda Estate Property Group expertis från fastighets- och finanssektorerna för att hjälpa dig göra kloka investeringar i fastigheter i Marbella och uppnå maximalt värde från fastighetsmarknaden.",
      "home.services.desc2": "Vi har en historia av att leverera ambitiösa lyxresorter runt om i världen i över 20 år inom hotell- och fastighetsutveckling, och betydande erfarenhet av att skräddarsy investeringar för att generera snabba vinster för kunder.",
      
      "home.contact.title": "Wanda Real Estate",
      "form.name": "Namn",
      "form.email": "E-postadress",
      "form.phone": "Telefon",
      "form.message": "Meddelande",
      "form.send": "Skicka",
      
      "footer.rights": "© {{year}} Wanda Estates. Alla rättigheter förbehållna.",
      "footer.address": "El Rodeo Alto Nº4, Nueva Andalucía, 29660, Marbella, Málaga",
      
      "properties.title": "Fastigheter till Salu",
      "properties.subtitle": "Upptäck vår exklusiva portfölj av lyxfastigheter i Marbella och på Costa del Sol.",
      "properties.forsale": "Till Salu",
      "properties.beds": "Sovrum",
      "properties.baths": "Badrum",
      "properties.view": "Visa Detaljer",
      
      "developments.title": "Nyproduktion",
      "developments.subtitle": "Utforska de finaste nybyggnadsprojekten och off-plan investeringarna i Marbella.",
      "developments.badge": "Nyproduktion",
      "developments.from": "Från {{price}}",
      "developments.view": "Visa Projekt",
      
      "services.title": "Våra Tjänster",
      "services.subtitle": "Omfattande fastighetslösningar skräddarsydda för dina unika behov och livsstil.",
      "services.why": "Varför välja oss?",
      "services.quote": "\"Vi kombinerar branschexpertis med finansiellt skarpsinne för att hjälpa våra kunder att göra kloka investeringar i fastigheter i Marbella.\"",
      "services.consultation": "Kontakta oss för en konsultation",
      
      "services.sales.title": "Fastighetsförsäljning",
      "services.sales.desc": "Vår kärnverksamhet är försäljning av lyxiga bostadsfastigheter. Vi guidar dig genom hela processen, från fastighetsval till slutförande, för en smidig upplevelse.",
      
      "services.investment.title": "Investeringsrådgivning",
      "services.investment.desc": "Vi erbjuder expertrådgivning om fastighetsinvesteringsmöjligheter i Marbella, vilket hjälper dig att bygga en lönsam portfölj med hög potential för värdeökning och hyresintäkter.",
      
      "services.management.title": "Fastighetsförvaltning",
      "services.management.desc": "Våra omfattande fastighetsförvaltningstjänster säkerställer att din investering underhålls väl och genererar inkomst när du inte är på plats.",
      
      "services.project.title": "Projektutveckling",
      "services.project.desc": "Med vår bakgrund inom utveckling kan vi hjälpa till med renoveringsprojekt eller nybyggnationer genom att koppla ihop dig med de bästa arkitekterna, entreprenörerna och designers.",

      "about.title": "Om Oss",
      "about.subtitle": "En dynamisk fastighetsbyrå med ett uppfriskande tillvägagångssätt för lyxfastigheter i Marbella.",
      "about.story.title": "Vår Historia",
      "about.story.heading": "Grundat av José Maria Esquerdo",
      "about.story.p1": "Wanda Estate Property Group är en dynamisk ny fastighetsbyrå med ett uppfriskande tillvägagångssätt. Grundat av José Maria Esquerdo, kombinerar Wanda Estate Property Group expertis från fastighets- och finanssektorerna för att hjälpa dig göra kloka investeringar i fastigheter i Marbella och uppnå maximalt värde från fastighetsmarknaden.",
      "about.story.p2": "Vi har en historia av att leverera ambitiösa lyxresorter runt om i världen i över 20 år inom hotell- och fastighetsutveckling, och betydande erfarenhet av att skräddarsy investeringar för att generera snabba vinster för kunder.",
      "about.story.p3": "Vårt uppdrag är att erbjuda en skräddarsydd tjänst som går utöver transaktionen. Vi strävar efter att bygga långvariga relationer med våra kunder och bli deras pålitliga rådgivare för alla deras fastighetsbehov i södra Spanien.",
      "about.founder": "José Maria Esquerdo, Grundare",
      
      "stats.experience": "Års Erfarenhet",
      "stats.sold": "Sålda Fastigheter",
      "stats.agents": "Expertmäklare",
      "stats.volume": "Försäljningsvolym",
      
      "about.cta.title": "Redo att hitta din drömfastighet?",
      "about.cta.desc": "Kontakta vårt team idag för en personlig konsultation och låt oss hjälpa dig att navigera på Marbellas fastighetsmarknad.",
      "about.cta.button": "Kontakta Oss",
      
      "contact.title": "Kontakt",
      "contact.subtitle": "Hör av dig till vårt team för att diskutera dina fastighetskrav.",
      "contact.touch.title": "Hör av dig",
      "contact.touch.desc": "Oavsett om du vill köpa, sälja eller investera i fastigheter i Marbella är vårt team här för att hjälpa dig. Besök vårt kontor eller kontakta oss via telefon eller e-post.",
      "contact.visit": "Besök Oss",
      "contact.call": "Ring Oss",
      "contact.email": "Mejla Oss",
      "contact.hours": "Öppettider",
      "contact.hours.week": "Måndag - Fredag: 9:00 - 18:00",
      "contact.hours.sat": "Lördag: Enligt överenskommelse",
      "contact.hours.sun": "Söndag: Stängt",
      "contact.form.title": "Skicka ett meddelande",
      "contact.form.send": "Skicka Meddelande"
    }
  },
  pl: {
    translation: {
      "nav.home": "Strona główna",
      "nav.properties": "Nieruchomości na sprzedaż",
      "nav.developments": "Nowe inwestycje",
      "nav.services": "Usługi",
      "nav.about": "O nas",
      "nav.contact": "Kontakt",
      
      "home.hero.title": "Luksusowe Apartamenty",
      "home.hero.subtitle": "Na terenie prywatnej posiadłości",
      "home.hero.price": "Ceny od €299,000",
      "home.hero.button": "Zobacz Nieruchomość",
      
      "home.featured.title": "Wyróżniona Nieruchomość",
      "home.featured.name": "Luksusowe Apartamenty",
      "home.featured.desc": "Na terenie prywatnej posiadłości",
      "home.featured.price": "Ceny od €299,000",
      "home.featured.button": "Zobacz Nieruchomość",
      
      "home.services.title": "Nasze Usługi",
      "home.services.desc1": "Wanda Estate Property Group to dynamiczna nowa agencja nieruchomości ze świeżym podejściem. Założona przez José Marię Esquerdo, Wanda Estate Property Group łączy wiedzę z sektorów nieruchomości i finansów, aby pomóc Ci mądrze inwestować w nieruchomości w Marbelli i osiągnąć maksymalną wartość z rynku nieruchomości.",
      "home.services.desc2": "Mamy udokumentowane doświadczenie w realizacji ambitnych luksusowych kurortów na całym świecie od ponad 20 lat w branży hotelarskiej i deweloperskiej, a także znaczące doświadczenie w dostosowywaniu inwestycji w celu generowania szybkich zysków dla klientów.",
      
      "home.contact.title": "Wanda Real Estate",
      "form.name": "Imię",
      "form.email": "Adres Email",
      "form.phone": "Telefon",
      "form.message": "Wiadomość",
      "form.send": "Wyślij",
      
      "footer.rights": "© {{year}} Wanda Estates. Wszelkie prawa zastrzeżone.",
      "footer.address": "El Rodeo Alto Nº4, Nueva Andalucía, 29660, Marbella, Málaga",
      
      "properties.title": "Nieruchomości na Sprzedaż",
      "properties.subtitle": "Odkryj nasze ekskluzywne portfolio luksusowych nieruchomości w Marbelli i na Costa del Sol.",
      "properties.forsale": "Na Sprzedaż",
      "properties.beds": "Syp",
      "properties.baths": "Łaz",
      "properties.view": "Zobacz Szczegóły",
      
      "developments.title": "Nowe Inwestycje",
      "developments.subtitle": "Poznaj najlepsze nowe projekty budowlane i inwestycje deweloperskie w Marbelli.",
      "developments.badge": "Nowa Inwestycja",
      "developments.from": "Od {{price}}",
      "developments.view": "Zobacz Projekt",
      
      "services.title": "Nasze Usługi",
      "services.subtitle": "Kompleksowe rozwiązania w zakresie nieruchomości dostosowane do Twoich unikalnych potrzeb i stylu życia.",
      "services.why": "Dlaczego my?",
      "services.quote": "\"Łączymy wiedzę branżową z przenikliwością finansową, aby pomóc naszym klientom mądrze inwestować w nieruchomości w Marbelli.\"",
      "services.consultation": "Skontaktuj się z nami w sprawie konsultacji",
      
      "services.sales.title": "Sprzedaż Nieruchomości",
      "services.sales.desc": "Naszą podstawową działalnością jest sprzedaż luksusowych nieruchomości mieszkalnych. Przeprowadzimy Cię przez cały proces, od wyboru nieruchomości po finalizację, zapewniając bezproblemowe doświadczenie.",
      
      "services.investment.title": "Doradztwo Inwestycyjne",
      "services.investment.desc": "Zapewniamy fachowe porady dotyczące możliwości inwestowania w nieruchomości w Marbelli, pomagając zbudować zyskowny portfel z wysokim potencjałem wzrostu wartości kapitału i dochodu z wynajmu.",
      
      "services.management.title": "Zarządzanie Nieruchomościami",
      "services.management.desc": "Nasze kompleksowe usługi zarządzania nieruchomościami zapewniają, że Twoja inwestycja jest dobrze utrzymana i generuje dochód, gdy nie przebywasz na miejscu.",
      
      "services.project.title": "Rozwój Projektów",
      "services.project.desc": "Dzięki naszemu doświadczeniu w deweloperce możemy pomóc w projektach renowacji lub nowych budowach, łącząc Cię z najlepszymi architektami, wykonawcami i projektantami.",

      "about.title": "O Nas",
      "about.subtitle": "Dynamiczna agencja nieruchomości ze świeżym podejściem do luksusowych nieruchomości w Marbelli.",
      "about.story.title": "Nasza Historia",
      "about.story.heading": "Założona przez José Marię Esquerdo",
      "about.story.p1": "Wanda Estate Property Group to dynamiczna nowa agencja nieruchomości ze świeżym podejściem. Założona przez José Marię Esquerdo, Wanda Estate Property Group łączy wiedzę z sektorów nieruchomości i finansów, aby pomóc Ci mądrze inwestować w nieruchomości w Marbelli i osiągnąć maksymalną wartość z rynku nieruchomości.",
      "about.story.p2": "Mamy udokumentowane doświadczenie w realizacji ambitnych luksusowych kurortów na całym świecie od ponad 20 lat w branży hotelarskiej i deweloperskiej, a także znaczące doświadczenie w dostosowywaniu inwestycji w celu generowania szybkich zysków dla klientów.",
      "about.story.p3": "Naszą misją jest świadczenie usług na miarę, które wykraczają poza transakcję. Dążymy do budowania długotrwałych relacji z naszymi klientami, stając się ich zaufanymi doradcami we wszystkich potrzebach związanych z nieruchomościami w południowej Hiszpanii.",
      "about.founder": "José Maria Esquerdo, Założyciel",
      
      "stats.experience": "Lat Doświadczenia",
      "stats.sold": "Sprzedanych Nieruchomości",
      "stats.agents": "Ekspertów",
      "stats.volume": "Wolumen Sprzedaży",
      
      "about.cta.title": "Gotowy, aby znaleźć swoją wymarzoną nieruchomość?",
      "about.cta.desc": "Skontaktuj się z naszym zespołem już dziś w celu uzyskania spersonalizowanej konsultacji i pozwól nam pomóc Ci poruszać się po rynku nieruchomości w Marbelli.",
      "about.cta.button": "Skontaktuj się z Nami",
      
      "contact.title": "Kontakt",
      "contact.subtitle": "Skontaktuj się z naszym zespołem, aby omówić swoje wymagania dotyczące nieruchomości.",
      "contact.touch.title": "Bądźmy w kontakcie",
      "contact.touch.desc": "Niezależnie od tego, czy chcesz kupić, sprzedać czy zainwestować w nieruchomości w Marbelli, nasz zespół jest tutaj, aby Ci pomóc. Odwiedź nasze biuro lub skontaktuj się z nami telefonicznie lub mailowo.",
      "contact.visit": "Odwiedź Nas",
      "contact.call": "Zadzwoń",
      "contact.email": "Napisz do Nas",
      "contact.hours": "Godziny Otwarcia",
      "contact.hours.week": "Poniedziałek - Piątek: 9:00 - 18:00",
      "contact.hours.sat": "Sobota: Po umówieniu",
      "contact.hours.sun": "Niedziela: Zamknięte",
      "contact.form.title": "Wyślij Wiadomość",
      "contact.form.send": "Wyślij Wiadomość"
    }
  },
  fr: {
    translation: {
      "nav.home": "Accueil",
      "nav.properties": "Propriétés à vendre",
      "nav.developments": "Nouveaux projets",
      "nav.services": "Services",
      "nav.about": "À propos",
      "nav.contact": "Contact",
      
      "home.hero.title": "Appartements de Luxe",
      "home.hero.subtitle": "Au sein d'un domaine privé",
      "home.hero.price": "Prix à partir de 299 000 €",
      "home.hero.button": "Voir la Propriété",
      
      "home.featured.title": "Propriété en Vedette",
      "home.featured.name": "Appartements de Luxe",
      "home.featured.desc": "Au sein d'un domaine privé",
      "home.featured.price": "Prix à partir de 299 000 €",
      "home.featured.button": "Voir la Propriété",
      
      "home.services.title": "Nos Services",
      "home.services.desc1": "Wanda Estate Property Group est une nouvelle agence immobilière dynamique avec une approche rafraîchissante. Fondée par José Maria Esquerdo, Wanda Estate Property Group combine l'expertise des secteurs immobilier et financier pour vous aider à investir judicieusement dans l'immobilier à Marbella et à obtenir une valeur maximale du marché immobilier.",
      "home.services.desc2": "Nous avons fait nos preuves dans la réalisation de complexes de luxe ambitieux dans le monde entier depuis plus de 20 ans dans le développement hôtelier et immobilier, et une expérience significative dans l'adaptation des investissements pour générer des profits rapides pour les clients.",
      
      "home.contact.title": "Wanda Real Estate",
      "form.name": "Nom",
      "form.email": "Adresse Email",
      "form.phone": "Téléphone",
      "form.message": "Message",
      "form.send": "Envoyer",
      
      "footer.rights": "© {{year}} Wanda Estates. Tous droits réservés.",
      "footer.address": "El Rodeo Alto Nº4, Nueva Andalucía, 29660, Marbella, Málaga",
      
      "properties.title": "Propriétés à Vendre",
      "properties.subtitle": "Découvrez notre portefeuille exclusif de propriétés de luxe à Marbella et sur la Costa del Sol.",
      "properties.forsale": "À Vendre",
      "properties.beds": "Chambres",
      "properties.baths": "SdB",
      "properties.view": "Voir Détails",
      
      "developments.title": "Nouveaux Projets",
      "developments.subtitle": "Explorez les plus beaux projets de nouvelle construction et les investissements sur plan à Marbella.",
      "developments.badge": "Nouveau Projet",
      "developments.from": "À partir de {{price}}",
      "developments.view": "Voir Projet",
      
      "services.title": "Nos Services",
      "services.subtitle": "Des solutions immobilières complètes adaptées à vos besoins uniques et à votre style de vie.",
      "services.why": "Pourquoi nous choisir ?",
      "services.quote": "\"Nous combinons l'expertise de l'industrie avec le sens financier pour aider nos clients à faire des investissements judicieux dans l'immobilier à Marbella.\"",
      "services.consultation": "Contactez-nous pour une consultation",
      
      "services.sales.title": "Vente Immobilière",
      "services.sales.desc": "Notre cœur de métier est la vente de propriétés résidentielles de luxe. Nous vous guidons tout au long du processus, de la sélection de la propriété à la finalisation, garantissant une expérience sans faille.",
      
      "services.investment.title": "Conseil en Investissement",
      "services.investment.desc": "Nous fournissons des conseils d'experts sur les opportunités d'investissement immobilier à Marbella, vous aidant à constituer un portefeuille rentable avec un fort potentiel d'appréciation du capital et de rendement locatif.",
      
      "services.management.title": "Gestion Immobilière",
      "services.management.desc": "Nos services complets de gestion immobilière garantissent que votre investissement est bien entretenu et génère des revenus lorsque vous n'êtes pas en résidence.",
      
      "services.project.title": "Développement de Projets",
      "services.project.desc": "Grâce à notre expérience dans le développement, nous pouvons vous aider dans les projets de rénovation ou de nouvelles constructions, en vous mettant en relation avec les meilleurs architectes, entrepreneurs et designers.",

      "about.title": "À Propos de Nous",
      "about.subtitle": "Une agence immobilière dynamique avec une approche rafraîchissante de l'immobilier de luxe à Marbella.",
      "about.story.title": "Notre Histoire",
      "about.story.heading": "Fondée par José Maria Esquerdo",
      "about.story.p1": "Wanda Estate Property Group est une nouvelle agence immobilière dynamique avec une approche rafraîchissante. Fondée par José Maria Esquerdo, Wanda Estate Property Group combine l'expertise des secteurs immobilier et financier pour vous aider à investir judicieusement dans l'immobilier à Marbella et à obtenir une valeur maximale du marché immobilier.",
      "about.story.p2": "Nous avons fait nos preuves dans la réalisation de complexes de luxe ambitieux dans le monde entier depuis plus de 20 ans dans le développement hôtelier et immobilier, et une expérience significative dans l'adaptation des investissements pour générer des profits rapides pour les clients.",
      "about.story.p3": "Notre mission est de fournir un service sur mesure qui va au-delà de la transaction. Nous visons à construire des relations durables avec nos clients, devenant leurs conseillers de confiance pour tous leurs besoins immobiliers dans le sud de l'Espagne.",
      "about.founder": "José Maria Esquerdo, Fondateur",
      
      "stats.experience": "Années d'Expérience",
      "stats.sold": "Propriétés Vendues",
      "stats.agents": "Agents Experts",
      "stats.volume": "Volume des Ventes",
      
      "about.cta.title": "Prêt à trouver la propriété de vos rêves ?",
      "about.cta.desc": "Contactez notre équipe dès aujourd'hui pour une consultation personnalisée et laissez-nous vous aider à naviguer sur le marché immobilier de Marbella.",
      "about.cta.button": "Contactez-nous",
      
      "contact.title": "Contact",
      "contact.subtitle": "Entrez en contact avec notre équipe pour discuter de vos besoins immobiliers.",
      "contact.touch.title": "Entrez en Contact",
      "contact.touch.desc": "Que vous cherchiez à acheter, vendre ou investir dans l'immobilier à Marbella, notre équipe est là pour vous aider. Visitez notre bureau ou contactez-nous par téléphone ou email.",
      "contact.visit": "Visitez-nous",
      "contact.call": "Appelez-nous",
      "contact.email": "Envoyez-nous un Email",
      "contact.hours": "Heures d'Ouverture",
      "contact.hours.week": "Lundi - Vendredi : 9h00 - 18h00",
      "contact.hours.sat": "Samedi : Sur rendez-vous",
      "contact.hours.sun": "Dimanche : Fermé",
      "contact.form.title": "Envoyer un Message",
      "contact.form.send": "Envoyer Message"
    }
  },
  de: {
    translation: {
      "nav.home": "Startseite",
      "nav.properties": "Immobilien zum Verkauf",
      "nav.developments": "Neubauprojekte",
      "nav.services": "Dienstleistungen",
      "nav.about": "Über Uns",
      "nav.contact": "Kontakt",
      
      "home.hero.title": "Luxus-Apartments",
      "home.hero.subtitle": "In einem privaten Anwesen",
      "home.hero.price": "Preise ab 299.000 €",
      "home.hero.button": "Immobilie Ansehen",
      
      "home.featured.title": "Hervorgehobene Immobilie",
      "home.featured.name": "Luxus-Apartments",
      "home.featured.desc": "In einem privaten Anwesen",
      "home.featured.price": "Preise ab 299.000 €",
      "home.featured.button": "Immobilie Ansehen",
      
      "home.services.title": "Unsere Dienstleistungen",
      "home.services.desc1": "Wanda Estate Property Group ist eine dynamische neue Immobilienagentur mit einem erfrischenden Ansatz. Gegründet von José Maria Esquerdo, kombiniert Wanda Estate Property Group Expertise aus dem Immobilien- und Finanzsektor, um Ihnen zu helfen, klug in Immobilien in Marbella zu investieren und den maximalen Wert aus dem Immobilienmarkt zu erzielen.",
      "home.services.desc2": "Wir haben eine Erfolgsbilanz bei der Lieferung ehrgeiziger Luxusresorts auf der ganzen Welt seit mehr als 20 Jahren in der Hotel- und Immobilienentwicklung und bedeutende Erfahrung bei der Anpassung von Investitionen, um schnelle Gewinne für Kunden zu erzielen.",
      
      "home.contact.title": "Wanda Real Estate",
      "form.name": "Name",
      "form.email": "E-Mail-Adresse",
      "form.phone": "Telefon",
      "form.message": "Nachricht",
      "form.send": "Senden",
      
      "footer.rights": "© {{year}} Wanda Estates. Alle Rechte vorbehalten.",
      "footer.address": "El Rodeo Alto Nº4, Nueva Andalucía, 29660, Marbella, Málaga",
      
      "properties.title": "Immobilien zum Verkauf",
      "properties.subtitle": "Entdecken Sie unser exklusives Portfolio an Luxusimmobilien in Marbella und an der Costa del Sol.",
      "properties.forsale": "Zu Verkaufen",
      "properties.beds": "Betten",
      "properties.baths": "Bäder",
      "properties.view": "Details Ansehen",
      
      "developments.title": "Neubauprojekte",
      "developments.subtitle": "Entdecken Sie die besten Neubauprojekte und Off-Plan-Investitionen in Marbella.",
      "developments.badge": "Neubauprojekt",
      "developments.from": "Ab {{price}}",
      "developments.view": "Projekt Ansehen",
      
      "services.title": "Unsere Dienstleistungen",
      "services.subtitle": "Umfassende Immobilienlösungen, die auf Ihre einzigartigen Bedürfnisse und Ihren Lebensstil zugeschnitten sind.",
      "services.why": "Warum uns wählen?",
      "services.quote": "\"Wir kombinieren Branchenexpertise mit finanziellem Scharfsinn, um unseren Kunden zu helfen, klug in Immobilien in Marbella zu investieren.\"",
      "services.consultation": "Kontaktieren Sie uns für eine Beratung",
      
      "services.sales.title": "Immobilienverkauf",
      "services.sales.desc": "Unser Kerngeschäft ist der Verkauf von Luxuswohnimmobilien. Wir begleiten Sie durch den gesamten Prozess, von der Auswahl der Immobilie bis zum Abschluss, und sorgen für ein reibungsloses Erlebnis.",
      
      "services.investment.title": "Investitionsberatung",
      "services.investment.desc": "Wir bieten kompetente Beratung zu Immobilieninvestitionsmöglichkeiten in Marbella und helfen Ihnen, ein rentables Portfolio mit hohem Potenzial für Kapitalzuwachs und Mietrendite aufzubauen.",
      
      "services.management.title": "Immobilienverwaltung",
      "services.management.desc": "Unsere umfassenden Immobilienverwaltungsdienste stellen sicher, dass Ihre Investition gut gepflegt wird und Einnahmen generiert, wenn Sie nicht anwesend sind.",
      
      "services.project.title": "Projektentwicklung",
      "services.project.desc": "Mit unserem Hintergrund in der Entwicklung können wir bei Renovierungsprojekten oder Neubauten helfen und Sie mit den besten Architekten, Bauunternehmern und Designern verbinden.",

      "about.title": "Über Uns",
      "about.subtitle": "Eine dynamische Immobilienagentur mit einem erfrischenden Ansatz für Luxusimmobilien in Marbella.",
      "about.story.title": "Unsere Geschichte",
      "about.story.heading": "Gegründet von José Maria Esquerdo",
      "about.story.p1": "Wanda Estate Property Group ist eine dynamische neue Immobilienagentur mit einem erfrischenden Ansatz. Gegründet von José Maria Esquerdo, kombiniert Wanda Estate Property Group Expertise aus dem Immobilien- und Finanzsektor, um Ihnen zu helfen, klug in Immobilien in Marbella zu investieren und den maximalen Wert aus dem Immobilienmarkt zu erzielen.",
      "about.story.p2": "Wir haben eine Erfolgsbilanz bei der Lieferung ehrgeiziger Luxusresorts auf der ganzen Welt seit mehr als 20 Jahren in der Hotel- und Immobilienentwicklung und bedeutende Erfahrung bei der Anpassung von Investitionen, um schnelle Gewinne für Kunden zu erzielen.",
      "about.story.p3": "Unsere Mission ist es, einen maßgeschneiderten Service zu bieten, der über die Transaktion hinausgeht. Wir streben danach, langfristige Beziehungen zu unseren Kunden aufzubauen und ihre vertrauenswürdigen Berater für alle ihre Immobilienbedürfnisse in Südspanien zu werden.",
      "about.founder": "José Maria Esquerdo, Gründer",
      
      "stats.experience": "Jahre Erfahrung",
      "stats.sold": "Verkaufte Immobilien",
      "stats.agents": "Expertenmakler",
      "stats.volume": "Verkaufsvolumen",
      
      "about.cta.title": "Bereit, Ihre Traumimmobilie zu finden?",
      "about.cta.desc": "Kontaktieren Sie unser Team noch heute für eine persönliche Beratung und lassen Sie uns Ihnen helfen, sich auf dem Immobilienmarkt von Marbella zurechtzufinden.",
      "about.cta.button": "Kontaktieren Sie Uns",
      
      "contact.title": "Kontakt",
      "contact.subtitle": "Nehmen Sie Kontakt mit unserem Team auf, um Ihre Immobilienanforderungen zu besprechen.",
      "contact.touch.title": "In Kontakt Treten",
      "contact.touch.desc": "Ob Sie Immobilien in Marbella kaufen, verkaufen oder investieren möchten, unser Team ist hier, um Ihnen zu helfen. Besuchen Sie unser Büro oder kontaktieren Sie uns per Telefon oder E-Mail.",
      "contact.visit": "Besuchen Sie Uns",
      "contact.call": "Rufen Sie Uns An",
      "contact.email": "Mailen Sie Uns",
      "contact.hours": "Öffnungszeiten",
      "contact.hours.week": "Montag - Freitag: 9:00 - 18:00",
      "contact.hours.sat": "Samstag: Nach Terminvereinbarung",
      "contact.hours.sun": "Sonntag: Geschlossen",
      "contact.form.title": "Nachricht Senden",
      "contact.form.send": "Nachricht Senden"
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
