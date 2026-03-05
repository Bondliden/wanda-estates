import { useState, useEffect } from "react";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import { Bed, Bath, Maximize, MapPin, MessageCircle, ChevronRight, ChevronLeft, Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Neighborhood {
    id: string;
    name: string;
    location: string;
    query: string;
    desc: string;
    count: string;
    minPrice: string;
    image: string;
}

const neighborhoods: Neighborhood[] = [
    {
        id: "sierra-blanca",
        name: "Sierra Blanca",
        location: "Marbella",
        query: "Sierra Blanca",
        desc: "Ultra-luxury villas with panoramic views",
        count: "30+",
        minPrice: "€3M+",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/La_Concha_Marbella.jpg/1200px-La_Concha_Marbella.jpg"
    },
    {
        id: "la-zagaleta",
        name: "La Zagaleta",
        location: "Benahavis",
        query: "La Zagaleta",
        desc: "The most exclusive residential enclave in Europe",
        count: "45+",
        minPrice: "€5M+",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Benahav%C3%ADs_-_Spain_%2827137351624%29.jpg/1200px-Benahav%C3%ADs_-_Spain_%2827137351624%29.jpg"
    },
    {
        id: "puerto-banus",
        name: "Puerto Banús",
        location: "Marbella",
        query: "Puerto Banús",
        desc: "The heart of Mediterranean glamour",
        count: "70+",
        minPrice: "€1M+",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Puerto_Ban%C3%BAs_-_Marbella_-_Spain.jpg"
    },
    {
        id: "nueva-andalucia",
        name: "Nueva Andalucía",
        location: "Marbella",
        query: "Nueva Andalucia",
        desc: "The valley of golf and tranquility",
        count: "100+",
        minPrice: "€1.5M+",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Golf_club_Las_Brisas_%28Nueva_Andalucia%29-105.jpg/1200px-Golf_club_Las_Brisas_%28Nueva_Andalucia%29-105.jpg"
    }
];

export default function ExclusiveNeighborhoods() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(neighborhoods[0]);

    // Neighborhoods carousel
    const [neighborhoodsRef, neighborhoodsApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps"
    });

    return (
        <section className="py-24 bg-white relative overflow-hidden border-t border-gray-50">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-xl mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-4 uppercase tracking-tighter">
                        {t("neighborhoods.title", "Exclusive Neighborhoods")}
                    </h2>
                    <p className="text-[#C9A961] font-medium tracking-widest uppercase text-xs">
                        {t("neighborhoods.subtitle", "Discover the most prestigious enclaves of the Costa del Sol")}
                    </p>
                </div>

                {/* Neighborhood Selection Carousel */}
                <div className="relative mb-12">
                    <div className="overflow-visible" ref={neighborhoodsRef}>
                        <div className="flex touch-pan-y gap-6 px-4 -mx-4">
                            {neighborhoods.map((n) => (
                                <div
                                    key={n.id}
                                    className="flex-[0_0_80%] sm:flex-[0_0_40%] lg:flex-[0_0_22%] min-w-0"
                                >
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        onMouseEnter={() => setActiveTab(n)}
                                        className={`relative aspect-[3/4] overflow-hidden group cursor-pointer shadow-xl transition-all duration-500 rounded-sm ${activeTab.id === n.id ? "ring-2 ring-[#C9A961] ring-offset-4 ring-offset-white" : "grayscale-[50%] hover:grayscale-0"
                                            }`}
                                    >
                                        <Link href={`/properties-for-sale?p_location=${encodeURIComponent(n.query)}`} className="absolute inset-0 z-20">
                                            <span className="sr-only">View properties in {n.name}</span>
                                        </Link>
                                        <img
                                            src={n.image}
                                            alt={n.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${activeTab.id === n.id ? "opacity-100" : "opacity-70"}`}></div>

                                        <div className="absolute inset-0 p-6 flex flex-col justify-end z-10 pointer-events-none">
                                            <h3 className="text-2xl font-serif text-white mb-1">{n.name}</h3>
                                            <p className="text-white/60 text-[10px] uppercase tracking-widest mb-4 h-8 overflow-hidden line-clamp-2">
                                                {n.desc}
                                            </p>

                                            <div className="flex justify-between items-end border-t border-white/10 pt-4">
                                                <div>
                                                    <p className="text-[9px] text-[#C9A961] uppercase tracking-[0.2em] mb-0.5">{t("neighborhoods.properties", "Properties")}</p>
                                                    <p className="text-white font-serif text-lg leading-none">{n.count}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] text-[#C9A961] uppercase tracking-[0.2em] mb-0.5">{t("neighborhoods.from", "From")}</p>
                                                    <p className="text-white font-serif text-lg leading-none">{n.minPrice}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {activeTab.id === n.id && (
                                            <div className="absolute top-4 right-4 bg-[#C9A961] p-1.5 rounded-full shadow-lg z-10 pointer-events-none">
                                                <LayoutGrid className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-8 justify-center lg:justify-start">
                        <button onClick={() => neighborhoodsApi?.scrollPrev()} className="p-3 border border-gray-100 bg-white text-gray-400 hover:text-[#C9A961] hover:border-[#C9A961] transition-all"><ChevronLeft size={18} /></button>
                        <button onClick={() => neighborhoodsApi?.scrollNext()} className="p-3 border border-gray-100 bg-white text-gray-400 hover:text-[#C9A961] hover:border-[#C9A961] transition-all"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>
        </section>
    );
}
