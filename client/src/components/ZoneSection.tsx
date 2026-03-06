import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import { Bed, Bath, Maximize, MapPin, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface ZoneSectionProps {
    zoneName: string;
    locationQuery: string;
    heroImage: string;
}

interface ResalesProperty {
    Id: string;
    Reference: string;
    Price: number;
    Currency: string;
    Beds: number;
    Baths: number;
    BuiltArea: number;
    Location: string;
    MainImage: string;
    TypeName: string;
}

const WHATSAPP_PHONE = "34641113518";

export default function ZoneSection({ zoneName, locationQuery, heroImage }: ZoneSectionProps) {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps",
        dragFree: true
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["properties", locationQuery],
        queryFn: async () => {
            const params = new URLSearchParams({
                p_location: locationQuery,
                p_PageSize: "15",
                p_sort: "commission",
                p_min: "500000"
            });
            const response = await fetch(`/api/properties?${params.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch properties");
            const result = await response.json();
            return result.success ? (Array.isArray(result.data.Property) ? result.data.Property : [result.data.Property]) : [];
        },
        staleTime: 1000 * 60 * 5 // 5 minutes
    });

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    // Auto-scroll logic
    useEffect(() => {
        if (!emblaApi || isHovering) {
            if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
            return;
        }

        autoScrollTimer.current = setInterval(() => {
            emblaApi.scrollNext();
        }, 4000);

        return () => {
            if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
        };
    }, [emblaApi, isHovering]);

    // Mouse wheel support
    useEffect(() => {
        if (!emblaApi) return;
        const engine = emblaApi.internalEngine();
        const el = emblaApi.rootNode();

        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                if (e.deltaX > 0) emblaApi.scrollNext();
                else emblaApi.scrollPrev();
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [emblaApi]);

    const properties = data || [];

    const getWhatsAppUrl = (ref: string) => {
        const message = encodeURIComponent(`Hola Wanda Estates, me interesa la propiedad con referencia ${ref} en ${zoneName}. ¿Podrían darme más información?`);
        return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
    };

    return (
        <section className="mb-24 flex flex-col space-y-0 overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
                <img
                    src={heroImage}
                    alt={zoneName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-5xl md:text-7xl font-serif text-white uppercase tracking-tighter drop-shadow-2xl">
                            {zoneName}
                        </h2>
                        <div className="h-1 w-24 bg-[#C9A961] mx-auto mt-6 shadow-lg" />
                    </motion.div>
                </div>
            </div>

            {/* Title & Carousel Area */}
            <div className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-6">
                        <div>
                            <h3 className="text-2xl font-serif text-[#1a1a1a] uppercase tracking-wider">
                                {t("zone.catalog", { zone: zoneName })}
                            </h3>
                            <p className="text-[#C9A961] text-xs font-semibold uppercase tracking-widest mt-1">
                                {t("zone.exclusive_selection", "Propiedades de lujo seleccionadas")}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => emblaApi?.scrollPrev()}
                                className="w-12 h-12 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-[#C9A961] hover:border-[#C9A961] transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => emblaApi?.scrollNext()}
                                className="w-12 h-12 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-[#C9A961] hover:border-[#C9A961] transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Carousel */}
                    <div
                        className="overflow-hidden relative"
                        ref={emblaRef}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <div className="flex -mx-4">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_350px] px-4 min-w-0">
                                        <div className="aspect-[4/3] bg-gray-100 animate-pulse rounded-none" />
                                        <div className="h-4 w-1/2 bg-gray-100 animate-pulse mt-4" />
                                        <div className="h-4 w-1/4 bg-gray-100 animate-pulse mt-2" />
                                    </div>
                                ))
                            ) : properties.length > 0 ? (
                                properties.map((property: any) => (
                                    <div
                                        key={property.Id}
                                        className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_350px] px-4 min-w-0 group"
                                    >
                                        <div className="bg-white border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <Link href={`/properties/${property.Id}`}>
                                                    <img
                                                        src={property.MainImage || "https://placehold.co/600x400?text=Property"}
                                                        alt={property.TypeName}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                </Link>
                                                <div className="absolute top-4 left-4 bg-[#1a3a54]/90 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 shadow-lg">
                                                    {property.Reference}
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="text-[#28a745] font-bold text-xl font-serif mb-2">
                                                    €{Number(property.Price).toLocaleString()}
                                                </div>
                                                <h4 className="text-sm font-serif font-medium text-primary mb-1 uppercase tracking-wide truncate">
                                                    {property.TypeName}
                                                </h4>
                                                <div className="flex items-center text-muted-foreground text-[10px] mb-4 uppercase tracking-widest">
                                                    <MapPin className="w-3 h-3 mr-1 text-[#C9A961]" />
                                                    {property.Location}
                                                </div>

                                                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                                    <div className="flex items-center gap-1.5">
                                                        <Bed className="w-3.5 h-3.5 text-[#C9A961]" />
                                                        <span>{property.Beds || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Bath className="w-3.5 h-3.5 text-[#C9A961]" />
                                                        <span>{property.Baths || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Maximize className="w-3.5 h-3.5 text-[#C9A961]" />
                                                        <span>{property.BuiltArea || 0} m²</span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex gap-2">
                                                    <Link href={`/properties/${property.Id}`} className="flex-grow">
                                                        <Button variant="outline" className="w-full h-10 rounded-none border-[#1a3a54] text-[#1a3a54] text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#1a3a54] hover:text-white transition-all">
                                                            {t("grid.view_details", "Ver detalles")}
                                                        </Button>
                                                    </Link>
                                                    <a
                                                        href={getWhatsAppUrl(property.Reference)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 bg-[#25D366] text-white flex items-center justify-center hover:bg-[#128C7E] transition-colors"
                                                    >
                                                        <MessageCircle size={18} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center w-full text-gray-400 font-serif italic">
                                    No hay propiedades disponibles en esta zona en este momento.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar / Indicators */}
                    <div className="mt-12 h-1 bg-gray-100 relative max-w-2xl mx-auto">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-[#C9A961]"
                            animate={{
                                width: `${((selectedIndex + 1) / (scrollSnaps.length || 1)) * 100}%`
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
