import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import apartmentComplex from "@assets/generated_images/modern_luxury_apartment_complex_exterior.png";
import luxuryApartmentBuilding from "@assets/rpkpJ1ya_1766569745755.jpg";
import { useTranslation } from "react-i18next";

// Mock data for new developments
const developments = [
  {
    id: 1,
    title: "Luxury Apartments",
    location: "Ojén, Marbella",
    priceFrom: "€299,000",
    description: "Luxury apartments within a private estate featuring breathtaking views and world-class amenities.",
    image: luxuryApartmentBuilding
  },
  {
    id: 2,
    title: "Vista Lago Residences",
    location: "Real de La Quinta, Benahavís",
    priceFrom: "€3,995,000",
    description: "18 magnificent individually designed sustainable villas in a private gated community.",
    image: apartmentComplex
  },
  {
    id: 3,
    title: "Epic Marbella",
    location: "Golden Mile, Marbella",
    priceFrom: "€1,800,000",
    description: "The first project in Europe in cooperation with FENDI CASA, offering the ultimate in luxury living.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "The View Marbella",
    location: "Nueva Andalucía, Marbella",
    priceFrom: "€1,250,000",
    description: "Exclusive boutique complex of 49 apartments and penthouses with panoramic sea views.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function NewDevelopments() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#2c3e50] text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-4">{t("developments.title")}</h1>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            {t("developments.subtitle")}
          </p>
        </div>
      </div>

      {/* Developments List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-16">
            {developments.map((dev, index) => (
              <div key={dev.id} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2 overflow-hidden shadow-lg">
                  <img 
                    src={dev.image} 
                    alt={dev.title}
                    className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                  <div className="inline-block bg-[#e09900] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-2">
                    {t("developments.badge")}
                  </div>
                  <h2 className="text-3xl font-serif text-[#2c3e50] uppercase">{dev.title}</h2>
                  <div className="flex items-center justify-center md:justify-start text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 text-[#e09900]" />
                    <span className="uppercase tracking-wider text-sm">{dev.location}</span>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {dev.description}
                  </p>
                  <p className="text-xl font-bold text-[#2c3e50]">
                    {t("developments.from", { price: dev.priceFrom })}
                  </p>
                  <Button className="bg-[#2ea3f2] hover:bg-[#2ea3f2]/90 text-white rounded-none uppercase tracking-wider font-bold px-8 py-6">
                    {t("developments.view")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
