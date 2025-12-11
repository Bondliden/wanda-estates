import { motion } from "framer-motion";
import { Bed, Bath, Maximize, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface PropertyProps {
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqm: number;
  featured?: boolean;
}

export default function PropertyCard({ property }: { property: PropertyProps }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-none overflow-hidden group rounded-none bg-white h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-4 left-4">
             {property.featured && (
               <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                 Exclusive
               </span>
             )}
          </div>
          
          <div className="absolute bottom-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
             <Button size="sm" className="bg-white text-primary hover:bg-white/90 rounded-none text-xs uppercase tracking-wider">
               View Details
             </Button>
          </div>
        </div>
        
        <CardContent className="pt-6 pb-2 px-0 flex-grow">
          <div className="flex justify-between items-start mb-2">
             <span className="text-secondary font-medium text-lg">{property.price}</span>
          </div>
          <h3 className="text-xl font-serif font-medium text-primary mb-2 line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin className="w-3 h-3 mr-1" />
            {property.location}
          </div>
        </CardContent>
        
        <CardFooter className="px-0 pt-4 border-t border-gray-100 flex justify-between text-muted-foreground text-xs uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{property.sqm} m²</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
