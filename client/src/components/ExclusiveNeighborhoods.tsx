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
        id: "la-zagaleta",
        name: "La Zagaleta",
        location: "Benahavis",
        query: "La Zagaleta",
        desc: "The most exclusive residential enclave in Europe",
        count: "45+",
        minPrice: "€5M+",
        image: "/la_zagaleta_aerial_1772497357614.png"
    },
    {
        id: "sierra-blanca",
        name: "Sierra Blanca",
        location: "Marbella",
        query: "Sierra Blanca",
        desc: "Ultra-luxury villas with panoramic views",
        count: "30+",
        minPrice: "€3M+",
        image: "/sierra_blanca_villa_1772497375486.png"
    },
    {
        id: "puerto-banus",
        name: "Puerto Banús",
        location: "Marbella",
        query: "Puerto Banus",
        desc: "The heart of Mediterranean glamour",
        count: "70+",
        minPrice: "€1M+",
        image: "/puerto_banus_marina_1772497395674.png"
    },
    {
        id: "nueva-andalucia",
        name: "Nueva Andalucía",
        location: "Marbella",
        query: "Nueva Andalucia",
        desc: "The valley of golf and tranquility",
        count: "100+",
        minPrice: "€750k+",
        image: "/nueva_andalucia_golf_1772497410980.png"
    }
];

export default function ExclusiveNeighborhoods() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(neighborhoods[0]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Neighborhoods carousel
    const [neighborhoodsRef, neighborhoodsApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps"
    });

    // Properties carousel
    const [propertiesRef, propertiesApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps"
    });

    useEffect(() => {
        const fetchProps = async () => {
            setLoading(true);
            try {
                const params: Record<string, string> = {
                    p_location: activeTab.location || "",
                    p_urbanization: activeTab.query || "",
                    p_min: activeTab.id === "nueva-andalucia" ? "750000" :
                        activeTab.id === "puerto-banus" ? "1000000" :
                            activeTab.id === "sierra-blanca" ? "3000000" : "5000000",
                    shuffle: "true"
                };

                const queryStr = new URLSearchParams(params).toString();
                const response = await fetch(`/api/properties?${queryStr}`);
                const data = await response.json();

                if (data.success && data.data && data.data.Property) {
                    const propsArray = Array.isArray(data.data.Property) ? data.data.Property : [data.data.Property];
                    setProperties(propsArray.slice(0, 10));
                } else {
                    setProperties([]);
                }
            } catch (e) {
                console.error("Error loading properties", e);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        if (isExpanded && activeTab.id) {
            fetchProps();
        }
    }, [activeTab, isExpanded]);

    const getWhatsAppUrl = (ref: string) => {
        const phone = "34612345678";
        const message = encodeURIComponent(`Hola Wanda Estates, me interesa la propiedad en ${activeTab.name} con referencia ${ref}. ¿Podrían darme más información?`);
        return `https://wa.me/${phone}?text=${message}`;
    };

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
                                        onClick={() => {
                                            setActiveTab(n);
                                            setIsExpanded(true);
                                        }}
                                        className={`relative aspect-[3/4] overflow-hidden group cursor-pointer shadow-xl transition-all duration-500 rounded-sm ${activeTab.id === n.id ? "ring-2 ring-[#C9A961] ring-offset-4 ring-offset-white" : "grayscale-[50%] hover:grayscale-0"
                                            }`}
                                    >
                                        <img
                                            src={n.image}
                                            alt={n.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${activeTab.id === n.id ? "opacity-100" : "opacity-70"}`}></div>

                                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
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
                                            <div className="absolute top-4 right-4 bg-[#C9A961] p-1.5 rounded-full shadow-lg">
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

                {/* Desplegable (Expandable) Properties Section */}
                <AnimatePresence>
                    {isExpanded && activeTab && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                            className="mt-12 overflow-hidden bg-gray-50/50 rounded-lg border border-gray-100"
                        >
                            <div className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                                    <div>
                                        <h4 className="text-2xl font-serif text-[#1a1a1a] flex items-center gap-3">
                                            {t("neighborhoods.exclusive_selection", "Exclusive Selection in")} {activeTab.name}
                                            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest italic pt-1 underline decoration-[#C9A961]/30 underline-offset-4">
                                                {activeTab.count} {t("neighborhoods.listings_found", "Available Listings")}
                                            </span>
                                        </h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => propertiesApi?.scrollPrev()}
                                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#2B5F8C] hover:text-white transition-all shadow-sm"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => propertiesApi?.scrollNext()}
                                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#2B5F8C] hover:text-white transition-all shadow-sm"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    {loading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="aspect-[4/3] bg-gray-100 animate-pulse rounded-sm" />
                                            ))}
                                        </div>
                                    ) : properties.length > 0 ? (
                                        <div className="overflow-visible" ref={propertiesRef}>
                                            <div className="flex touch-pan-y gap-6">
                                                {properties.map((property) => (
                                                    <div key={property.Id} className="flex-[0_0_100%] sm:flex-[0_0_calc(100%/2)] md:flex-[0_0_calc(100%/3)] min-w-0">
                                                        <div className="group bg-white rounded-sm overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-100">
                                                            <Link href={`/properties/${property.Id}`}>
                                                                <div className="relative aspect-[4/3] overflow-hidden cursor-pointer">
                                                                    <img
                                                                        src={property.MainImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"}
                                                                        alt={property.TypeName}
                                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                                    />
                                                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                                        <span className="bg-[#2B5F8C] text-white text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-lg">
                                                                            {property.Reference}
                                                                        </span>
                                                                        {property.IsFeatured && (
                                                                            <span className="bg-[#C9A961] text-white text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-lg">
                                                                                Featured
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full scale-50 group-hover:scale-100 transition-transform duration-500">
                                                                            <Plus className="w-6 h-6 text-[#2B5F8C]" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>

                                                            <div className="p-6 flex flex-col flex-grow">
                                                                <h4 className="text-xs font-bold text-[#1a1a1a] mb-1 uppercase tracking-widest line-clamp-1">
                                                                    {property.TypeName} en {property.Location}
                                                                </h4>

                                                                <p className="text-[#2B5F8C] font-serif text-2xl mb-6">
                                                                    €{property.Price?.toLocaleString()}
                                                                </p>

                                                                <div className="grid grid-cols-3 gap-1 border-t border-gray-50 pt-4 mb-6">
                                                                    <div className="flex flex-col items-center">
                                                                        <Bed className="w-3.5 h-3.5 text-[#C9A961] mb-1.5" />
                                                                        <span className="text-[10px] text-gray-400 font-bold">{property.Beds || 0} <span className="font-normal text-[8px]">BEDS</span></span>
                                                                    </div>
                                                                    <div className="flex flex-col items-center border-x border-gray-50">
                                                                        <Bath className="w-3.5 h-3.5 text-[#C9A961] mb-1.5" />
                                                                        <span className="text-[10px] text-gray-400 font-bold">{property.Baths || 0} <span className="font-normal text-[8px]">BATHS</span></span>
                                                                    </div>
                                                                    <div className="flex flex-col items-center">
                                                                        <Maximize className="w-3.5 h-3.5 text-[#C9A961] mb-1.5" />
                                                                        <span className="text-[10px] text-gray-400 font-bold">{property.BuiltArea || 0} <span className="font-normal text-[8px]">m²</span></span>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-auto flex gap-2">
                                                                    <a
                                                                        href={getWhatsAppUrl(property.Reference)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="w-11 h-11 flex items-center justify-center bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors rounded-sm"
                                                                    >
                                                                        <MessageCircle className="w-5 h-5" />
                                                                    </a>
                                                                    <Link href={`/properties/${property.Id}`} className="flex-grow">
                                                                        <Button variant="outline" className="w-full h-11 rounded-none border-gray-200 text-gray-600 hover:border-[#2B5F8C] hover:bg-[#2B5F8C] hover:text-white uppercase text-[8px] tracking-[0.2em] font-bold">
                                                                            {t("grid.view_details", "More Info")}
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 font-serif italic bg-white">
                                            {t("neighborhoods.no_exclusive_results", "We are currently updating our portfolio for this specific location. Please contact us for off-market listings.")}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-12 flex justify-center">
                                    <Button
                                        onClick={() => setIsExpanded(false)}
                                        variant="ghost"
                                        className="text-gray-400 hover:text-red-500 uppercase text-[10px] tracking-widest font-bold flex items-center gap-2"
                                    >
                                        Close Exploration Mode
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
