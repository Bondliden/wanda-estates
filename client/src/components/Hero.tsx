import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import heroBg from "@assets/generated_images/luxury_modern_villa_in_marbella_with_infinity_pool_at_sunset.png";

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-center text-center text-white z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block py-1 px-3 border border-white/30 bg-white/10 backdrop-blur-sm text-xs uppercase tracking-[0.2em] mb-6">
            Marbella • Benahavís • Sotogrande
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6 leading-tight">
            Discover Extraordinary <br />
            <span className="italic text-secondary-foreground text-white">Living</span>
          </h1>
          <p className="text-lg md:text-xl font-light text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Curating the finest luxury properties in the most exclusive destinations of the Costa del Sol.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="w-full max-w-4xl bg-white p-2 md:p-4 shadow-2xl flex flex-col md:flex-row gap-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search by location, property type..." 
              className="w-full h-12 px-4 text-gray-800 placeholder-gray-400 outline-none border-b md:border-b-0 md:border-r border-gray-100"
            />
          </div>
          <div className="flex-1">
             <select className="w-full h-12 px-4 text-gray-800 outline-none bg-transparent border-b md:border-b-0 md:border-r border-gray-100 cursor-pointer">
               <option value="">Property Type</option>
               <option value="villa">Villa</option>
               <option value="apartment">Apartment</option>
               <option value="penthouse">Penthouse</option>
             </select>
          </div>
          <div className="flex-1">
             <select className="w-full h-12 px-4 text-gray-800 outline-none bg-transparent cursor-pointer">
               <option value="">Price Range</option>
               <option value="1m-2m">€1M - €2M</option>
               <option value="2m-5m">€2M - €5M</option>
               <option value="5m+">€5M+</option>
             </select>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 h-12 uppercase tracking-wider text-xs">
            Search <Search className="w-3 h-3 ml-2" />
          </Button>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-widest opacity-70">Scroll Down</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </div>
  );
}
