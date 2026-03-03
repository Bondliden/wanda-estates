import { useState, useEffect } from "react";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import { Bed, Bath, Maximize, MapPin, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
export default function DynamicFeaturedProperties() {
    const { t } = useTranslation();
    const { demandProfile } = useSEO();
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

    // We fetch a few properties based on the demanded property type
    useEffect(() => {
        const fetchDemanded = async () => {
            setLoading(true);
            try {
                // e.g., if demandProfile.propertyType = "Villa,Finca", take the first one or just standard "Villa"
                const primaryType = demandProfile.propertyType.split(",")[0] || "";

                const params = new URLSearchParams({
                    p_min: "2000000",
                    p_max: "12000000",
                    p_location: demandProfile.preferredLocation || 'Marbella,Benahavis,Estepona,Sotogrande',
                    shuffle: "true"
                });

                // Let's assume the backend takes p_type or we just rely on price and location + shuffle 
                // to show relevant luxury items if exact type mapping is complex. We'll use location & price.

                const response = await fetch(`/api/properties?${params.toString()}`);
                const data = await response.json();

                if (data.success && data.data && data.data.Property) {
                    const propsArray = Array.isArray(data.data.Property) ? data.data.Property : [data.data.Property];
                    // Take top 9 for the carousel to be populated
                    setProperties(propsArray.slice(0, 9));
                } else {
                    setProperties([]);
                }
            } catch (e) {
                console.error("Error loading dynamic featured properties", e);
            } finally {
                setLoading(false);
            }
        };

        fetchDemanded();
    }, [demandProfile]);

    const getWhatsAppUrl = (ref: string) => {
        const phone = "34624377939";
        const message = encodeURIComponent(`Hola Wanda Estates, me interesa la propiedad con referencia ${ref}. ¿Podrían darme más información?`);
        return `https://wa.me/${phone}?text=${message}`;
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-white border border-gray-100 h-[550px]">
                        <div className="bg-gray-100 h-[300px] w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (properties.length === 0) {
        return null;
    }

    return (
        <>
            <div className="text-center mb-8">
                <span className="inline-block bg-[#e09900] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-2">
                    {t("home.featured.title")}
                </span>
                <p className="text-gray-500 text-sm">{t("home.featured.desc")}</p>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y mt-2 mb-2 gap-4">
                    {properties.filter(p => p.MainImage).map((property) => (
                        <div key={property.Id} className="group border border-gray-100 hover:shadow-2xl transition-all duration-500 bg-white flex flex-col h-full overflow-hidden flex-[0_0_100%] md:flex-[0_0_calc(100%/3-1rem)] min-w-0">
                            <Link href={`/properties/${property.Id}`}>
                                <div className="relative overflow-hidden aspect-[4/3] cursor-pointer">
                                    <img
                                        src={property.MainImage}
                                        alt={property.TypeName}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-[#2B5F8C]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2">
                                            {property.Reference}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <p className="text-white text-xs uppercase tracking-widest font-bold">{t("grid.view_details")}</p>
                                    </div>
                                </div>
                            </Link>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[#28a745] font-bold text-2xl font-serif">
                                        €{property.Price?.toLocaleString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-serif text-[#1a1a1a] mb-2 uppercase tracking-wide group-hover:text-[#C9A961] transition-colors">{property.TypeName}</h3>
                                <div className="flex items-center text-[#fd7e14] text-xs mb-6 uppercase tracking-widest font-semibold">
                                    <MapPin className="w-3 h-3 mr-2 text-[#C9A961]" />
                                    {property.Location}
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Bed className="w-4 h-4 text-[#C9A961]" />
                                        <span>{property.Beds || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Bath className="w-4 h-4 text-[#C9A961]" />
                                        <span>{property.Baths || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Maximize className="w-4 h-4 text-[#C9A961]" />
                                        <span>{property.BuiltArea || 0} m²</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <Link href={`/properties/${property.Id}`} className="flex-grow">
                                        <Button className="w-full bg-transparent border border-[#2B5F8C] text-[#2B5F8C] hover:bg-[#2B5F8C] hover:text-white rounded-none uppercase text-[10px] tracking-[0.2em] font-bold h-12 transition-all">
                                            {t("grid.view_details")}
                                        </Button>
                                    </Link>
                                    <a
                                        href={getWhatsAppUrl(property.Reference)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 flex items-center justify-center transition-colors"
                                        title={t("properties.contactWhatsApp") || "Contact via WhatsApp"}
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-6 gap-2">
                <Button variant="outline" size="sm" onClick={() => emblaApi?.scrollPrev()} className="rounded-none border-[#2c3e50] text-[#2c3e50] border">Prev</Button>
                <Button variant="outline" size="sm" onClick={() => emblaApi?.scrollNext()} className="rounded-none border-[#2c3e50] text-[#2c3e50] border">Next</Button>
            </div>
        </>
    );
}
