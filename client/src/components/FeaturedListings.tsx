import PropertyCard from "./PropertyCard";
import livingRoom from "@assets/generated_images/modern_luxury_living_room_interior_with_sea_view.png";
import kitchen from "@assets/generated_images/modern_kitchen_with_marble_island.png";
import bedroom from "@assets/generated_images/luxury_bedroom_with_terrace.png";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FeaturedListings() {
  const properties = [
    {
      id: 1,
      title: "Villa Solano - Contemporary Masterpiece",
      location: "La Zagaleta, Benahavís",
      price: "€12,500,000",
      beds: 6,
      baths: 7,
      sqm: 1200,
      image: livingRoom,
      featured: true,
    },
    {
      id: 2,
      title: "Golden Mile Penthouse",
      location: "Marbella Golden Mile",
      price: "€4,200,000",
      beds: 3,
      baths: 3,
      sqm: 280,
      image: kitchen,
      featured: true,
    },
    {
      id: 3,
      title: "Seaside Estate with Private Beach",
      location: "Los Monteros, Marbella East",
      price: "€8,900,000",
      beds: 5,
      baths: 5,
      sqm: 650,
      image: bedroom,
      featured: true,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <h4 className="text-secondary text-sm font-bold uppercase tracking-widest mb-4">Exclusive Portfolio</h4>
            <h2 className="text-4xl md:text-5xl font-serif text-primary">Featured Properties</h2>
          </div>
          <Button variant="link" className="text-primary hover:text-secondary uppercase tracking-widest text-xs hidden md:flex items-center gap-2">
            View All Properties <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-none uppercase tracking-widest">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
}
