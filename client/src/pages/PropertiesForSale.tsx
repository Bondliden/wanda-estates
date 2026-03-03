import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import ResalesPropertyGrid from "@/components/ResalesPropertyGrid";
import InvestmentGuideBanner from "@/components/InvestmentGuideBanner";

const neighborhoods = [
  {
    id: "la-zagaleta",
    name: "La Zagaleta",
    description: "El enclave residencial más exclusivo de Europa",
    descriptionEn: "The most exclusive residential enclave in Europe",
    avgPrice: "€8M+"
  },
  {
    id: "sierra-blanca",
    name: "Sierra Blanca",
    description: "Villas de ultra-lujo con vistas panorámicas",
    descriptionEn: "Ultra-luxury villas with panoramic views",
    avgPrice: "€5M+"
  },
  {
    id: "puerto-banus",
    name: "Puerto Banús",
    description: "El corazón del glamour mediterráneo",
    descriptionEn: "The heart of Mediterranean glamour",
    avgPrice: "€2M+"
  },
  {
    id: "nueva-andalucia",
    name: "Nueva Andalucía",
    description: "El valle del golf y la tranquilidad",
    descriptionEn: "The valley of golf and tranquility",
    avgPrice: "€1.5M+"
  }
];

export default function PropertiesForSale() {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language === "es";
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  const handleNeighborhoodClick = (name: string) => {
    setSelectedNeighborhood(name);
    const gridElement = document.getElementById('property-grid-section');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

      {/* Neighborhoods Section */}
      <section className="py-16 bg-[#f9f9f9]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-[#2B5F8C] text-center mb-4 uppercase">{t("neighborhoods.title")}</h2>
          <p className="text-gray-600 text-center mb-12">{t("neighborhoods.subtitle")}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {neighborhoods.map((hood) => (
              <div
                key={hood.id}
                onClick={() => handleNeighborhoodClick(hood.name)}
                className={`group relative aspect-[3/4] overflow-hidden cursor-pointer shadow-xl transition-all duration-500 rounded-sm border-2 ${selectedNeighborhood === hood.name ? "border-[#C9A961] scale-105 z-10" : "border-transparent grayscale-[30%] hover:grayscale-0"
                  }`}
              >
                <img
                  src={hood.id === "la-zagaleta" ? "/la_zagaleta_aerial_1772497357614.png" :
                    hood.id === "sierra-blanca" ? "/sierra_blanca_villa_1772497375486.png" :
                      hood.id === "puerto-banus" ? "/puerto_banus_marina_1772497395674.png" :
                        "/nueva_andalucia_golf_1772497410980.png"}
                  alt={hood.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C9A961] transition-colors">{hood.name}</h3>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest mb-4 h-8 overflow-hidden line-clamp-2">
                    {isSpanish ? hood.description : hood.descriptionEn}
                  </p>

                  <div className="flex justify-between items-end border-t border-white/10 pt-4">
                    <div className="text-left">
                      <p className="text-white font-serif text-lg leading-none">{hood.avgPrice}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#C9A961] group-hover:border-[#C9A961] transition-all">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section id="property-grid-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <InvestmentGuideBanner />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ResalesPropertyGrid initialLocation={selectedNeighborhood || ""} />
            </div>

            {/* Sidebar with Lead Magnet Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ContactForm variant="leadMagnet" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
