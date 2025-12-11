import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

// Mock data for properties
const properties = [
  {
    id: 1,
    title: "Luxury Villa in Sierra Blanca",
    location: "Sierra Blanca, Marbella",
    price: "€4,500,000",
    beds: 5,
    baths: 6,
    sqm: 650,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Modern Apartment in Puerto Banús",
    location: "Puerto Banús, Marbella",
    price: "€1,200,000",
    beds: 3,
    baths: 2,
    sqm: 140,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Exclusive Penthouse with Sea Views",
    location: "Golden Mile, Marbella",
    price: "€3,800,000",
    beds: 4,
    baths: 4,
    sqm: 320,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Contemporary Villa in Nueva Andalucía",
    location: "Nueva Andalucía, Marbella",
    price: "€2,950,000",
    beds: 4,
    baths: 5,
    sqm: 450,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Beachfront Villa in Los Monteros",
    location: "Los Monteros, Marbella East",
    price: "€6,500,000",
    beds: 6,
    baths: 7,
    sqm: 800,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Golf Front Villa in Guadalmina",
    location: "Guadalmina Baja, San Pedro",
    price: "€3,200,000",
    beds: 5,
    baths: 5,
    sqm: 500,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function PropertiesForSale() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#2c3e50] text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-4">{t("properties.title")}</h1>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            {t("properties.subtitle")}
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="group border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#e09900] text-white text-xs font-bold uppercase tracking-widest px-3 py-1">
                      {t("properties.forsale")}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[#2c3e50] font-bold text-xl">{property.price}</span>
                  </div>
                  <h3 className="text-lg font-serif text-[#2c3e50] mb-2 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-[#e09900]" />
                    {property.location}
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-100 pt-4 text-gray-500 text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.beds} {t("properties.beds")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.baths} {t("properties.baths")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      <span>{property.sqm} m²</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline" className="w-full rounded-none border-gray-300 text-gray-500 hover:bg-[#2ea3f2] hover:text-white uppercase text-xs tracking-wider">
                      {t("properties.view")}
                    </Button>
                  </div>
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
