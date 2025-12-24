import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const properties = [
  {
    id: 1,
    title: "Villa Santuario en Sierra Blanca",
    titleEn: "Sanctuary Villa in Sierra Blanca",
    location: "Sierra Blanca, Marbella",
    price: "€4,500,000",
    beds: 5,
    baths: 6,
    sqm: 650,
    description: "Despierte cada mañana con la luz mediterránea bañando su refugio privado. Un legado arquitectónico donde la serenidad y el prestigio convergen.",
    descriptionEn: "Awaken each morning with Mediterranean light bathing your private sanctuary. An architectural legacy where serenity and prestige converge.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
    neighborhood: "sierra-blanca"
  },
  {
    id: 2,
    title: "Penthouse Exclusivo en Puerto Banús",
    titleEn: "Exclusive Penthouse in Puerto Banús",
    location: "Puerto Banús, Marbella",
    price: "€1,200,000",
    beds: 3,
    baths: 2,
    sqm: 140,
    description: "Viva donde el glamour se encuentra con el horizonte. Terrazas infinitas que abrazan las vistas al puerto más icónico del Mediterráneo.",
    descriptionEn: "Live where glamour meets the horizon. Infinite terraces embracing views of the most iconic port in the Mediterranean.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    neighborhood: "puerto-banus"
  },
  {
    id: 3,
    title: "Ático de Ensueño en Golden Mile",
    titleEn: "Dream Penthouse on Golden Mile",
    location: "Golden Mile, Marbella",
    price: "€3,800,000",
    beds: 4,
    baths: 4,
    sqm: 320,
    description: "Su santuario elevado sobre la milla dorada. Espacios donde la arquitectura vernácula dialoga con el mar infinito.",
    descriptionEn: "Your elevated sanctuary over the golden mile. Spaces where vernacular architecture dialogues with the infinite sea.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    neighborhood: "golden-mile"
  },
  {
    id: 4,
    title: "Residencia Contemporánea en Nueva Andalucía",
    titleEn: "Contemporary Residence in Nueva Andalucía",
    location: "Nueva Andalucía, Marbella",
    price: "€2,950,000",
    beds: 4,
    baths: 5,
    sqm: 450,
    description: "El arte de vivir en el valle del golf. Un refugio donde cada atardecer pinta su terraza con tonos dorados.",
    descriptionEn: "The art of living in the golf valley. A retreat where every sunset paints your terrace with golden hues.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    neighborhood: "nueva-andalucia"
  },
  {
    id: 5,
    title: "Villa Frente al Mar en Los Monteros",
    titleEn: "Beachfront Villa in Los Monteros",
    location: "Los Monteros, Marbella East",
    price: "€6,500,000",
    beds: 6,
    baths: 7,
    sqm: 800,
    description: "Donde la arena se convierte en extensión de su hogar. Un legado patrimonial con el Mediterráneo como jardín privado.",
    descriptionEn: "Where the sand becomes an extension of your home. A heritage legacy with the Mediterranean as your private garden.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop",
    neighborhood: "los-monteros"
  },
  {
    id: 6,
    title: "Villa en La Zagaleta",
    titleEn: "Villa in La Zagaleta",
    location: "La Zagaleta, Benahavís",
    price: "€8,500,000",
    beds: 7,
    baths: 8,
    sqm: 1200,
    description: "El enclave más exclusivo de Europa. Privacidad absoluta en una finca de ensueño donde su legado familiar encuentra su hogar definitivo.",
    descriptionEn: "The most exclusive enclave in Europe. Absolute privacy in a dream estate where your family legacy finds its definitive home.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    neighborhood: "la-zagaleta"
  }
];

const neighborhoods = [
  {
    id: "la-zagaleta",
    name: "La Zagaleta",
    description: "El enclave residencial más exclusivo de Europa",
    descriptionEn: "The most exclusive residential enclave in Europe",
    properties: 45,
    avgPrice: "€8M+"
  },
  {
    id: "sierra-blanca",
    name: "Sierra Blanca",
    description: "Villas de ultra-lujo con vistas panorámicas",
    descriptionEn: "Ultra-luxury villas with panoramic views",
    properties: 32,
    avgPrice: "€5M+"
  },
  {
    id: "puerto-banus",
    name: "Puerto Banús",
    description: "El corazón del glamour mediterráneo",
    descriptionEn: "The heart of Mediterranean glamour",
    properties: 78,
    avgPrice: "€2M+"
  },
  {
    id: "nueva-andalucia",
    name: "Nueva Andalucía",
    description: "El valle del golf y la tranquilidad",
    descriptionEn: "The valley of golf and tranquility",
    properties: 120,
    avgPrice: "€1.5M+"
  }
];

export default function PropertiesForSale() {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language === "es";

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#2B5F8C] text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-4">{t("properties.title")}</h1>
          <p className="text-lg font-light text-gray-200 max-w-2xl mx-auto">
            {t("properties.subtitle")}
          </p>
        </div>
      </div>

      {/* Neighborhoods Section - Bento Box Style */}
      <section className="py-16 bg-[#f9f9f9]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-[#2B5F8C] text-center mb-4 uppercase">{t("neighborhoods.title")}</h2>
          <p className="text-gray-600 text-center mb-12">{t("neighborhoods.subtitle")}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {neighborhoods.map((hood) => (
              <div 
                key={hood.id} 
                className="bg-white p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <h3 className="font-serif text-[#2B5F8C] text-lg mb-2 group-hover:text-[#C9A961] transition-colors">{hood.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{isSpanish ? hood.description : hood.descriptionEn}</p>
                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wider">
                  <span>{hood.properties} {isSpanish ? "propiedades" : "properties"}</span>
                  <span className="text-[#C9A961] font-bold">{hood.avgPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Properties */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {properties.map((property) => (
                  <div key={property.id} className="group border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img 
                        src={property.image} 
                        alt={isSpanish ? property.title : property.titleEn}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#C9A961] text-white text-xs font-bold uppercase tracking-widest px-3 py-1">
                          {t("properties.forsale")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[#2B5F8C] font-bold text-xl">{property.price}</span>
                      </div>
                      <h3 className="text-lg font-serif text-[#2B5F8C] mb-2">{isSpanish ? property.title : property.titleEn}</h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2 italic">
                        {isSpanish ? property.description : property.descriptionEn}
                      </p>
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1 text-[#C9A961]" />
                        {property.location}
                      </div>
                      
                      <div className="flex justify-between border-t border-gray-100 pt-4 text-gray-500 text-xs uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.beds}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.baths}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          <span>{property.sqm} m²</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button className="w-full bg-[#2B5F8C] hover:bg-[#1a3a54] text-white rounded-none uppercase text-xs tracking-wider min-h-[44px]">
                          {t("properties.cta")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar with Lead Magnet Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ContactForm variant="minimal" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
