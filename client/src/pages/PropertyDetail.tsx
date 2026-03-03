import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, MapPin, MessageCircle, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, X, Send } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_PHONE = "34641113518";

interface PropertyImage {
    PictureURL: string;
    HighResURL?: string;
}

interface PropertyDetails {
    Id: string;
    Reference: string;
    Price: number;
    Currency: string;
    Beds: number;
    Baths: number;
    BuiltArea: number;
    PlotArea: number;
    TerraceArea: number;
    Location: string;
    Area: string;
    TypeName: string;
    Description: string;
    MainImage: string;
    PicturesContent?: {
        Picture: PropertyImage | PropertyImage[];
    };
    Latitude?: number | string;
    Longitude?: number | string;
    Features?: any;
    HasPool?: string;
    HasGarden?: string;
    HasParking?: string;
    HasGarage?: string;
    HasAirConditioning?: string;
    HasHeating?: string;
    HasTerrace?: string;
    HasLift?: string;
    Orientation?: string;
    Condition?: string;
    PropertyStatus?: string;
}

export default function PropertyDetail() {
    const [, params] = useRoute("/properties/:id");
    const id = params?.id;
    const { i18n, t } = useTranslation();
    const isSpanish = i18n.language === "es";

    const [property, setProperty] = useState<PropertyDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [inquirySubmitting, setInquirySubmitting] = useState(false);
    const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", message: "" });

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/properties/${id}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setProperty(data.data.Property || data.data);
                } else {
                    setError("Property details not found.");
                }
            } catch (err) {
                console.error("Error fetching details:", err);
                setError("Failed to load property details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    // Parse V6 images
    const getImages = (): string[] => {
        if (!property) {
            console.log("[PropertyDetail] No property data");
            return [];
        }
        const pics = property.PicturesContent?.Picture;
        if (!pics) {
            console.log("[PropertyDetail] No PicturesContent, using MainImage only:", property.MainImage);
            return property.MainImage ? [property.MainImage] : [];
        }

        const picArray = Array.isArray(pics) ? pics : [pics];
        const urls = picArray.map((p: any) => {
            const url = p.HighResURL || p.PictureURL;
            console.log("[PropertyDetail] Processing image:", { hasHighRes: !!p.HighResURL, url });
            return url;
        }).filter(Boolean);
        
        // Ensure MainImage is first
        if (property.MainImage && !urls.includes(property.MainImage)) {
            urls.unshift(property.MainImage);
            console.log("[PropertyDetail] Added MainImage to front");
        }
        
        console.log(`[PropertyDetail] Property ${property.Reference} has ${urls.length} images`);
        return urls;
    };

    const images = getImages();
    
    console.log("[PropertyDetail] Images loaded:", images.length);
    console.log("[PropertyDetail] Property data:", {
        reference: property?.Reference,
        hasMainImage: !!property?.MainImage,
        images: images,
        hasLocation: !!(property?.Latitude && property?.Longitude)
    });
    
    // Generate map URL
    const getMapUrl = () => {
        if (!property || (!property.Latitude && !property.Longitude)) {
            console.log("[PropertyDetail] Using fallback map (no coords)");
            return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=Nueva Andalucía, Marbella&zoom=13`;
        }
        const lat = property.Latitude;
        const lng = property.Longitude;
        console.log("[PropertyDetail] Using coords map:", { lat, lng });
        return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${lat},${lng}&zoom=16&maptype=satellite`;
    };

    const getWhatsAppUrl = (ref: string) => {
        const message = encodeURIComponent(`Hola Wanda Estates, me interesa la propiedad con referencia ${ref}. ¿Podrían darme más información?`);
        return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
    };

    // Build dynamic features list from API data
    const getFeatures = (): string[] => {
        if (!property) return [];
        const features: string[] = [];
        if (property.HasPool === '1' || property.HasPool === 'Yes') features.push(isSpanish ? 'Piscina' : 'Swimming Pool');
        if (property.HasGarden === '1' || property.HasGarden === 'Yes') features.push(isSpanish ? 'Jardín' : 'Garden');
        if (property.HasParking === '1' || property.HasParking === 'Yes') features.push(isSpanish ? 'Parking' : 'Parking');
        if (property.HasGarage === '1' || property.HasGarage === 'Yes') features.push(isSpanish ? 'Garaje' : 'Garage');
        if (property.HasAirConditioning === '1' || property.HasAirConditioning === 'Yes') features.push(isSpanish ? 'Aire Acondicionado' : 'Air Conditioning');
        if (property.HasHeating === '1' || property.HasHeating === 'Yes') features.push(isSpanish ? 'Calefacción' : 'Heating');
        if (property.HasTerrace === '1' || property.HasTerrace === 'Yes') features.push(isSpanish ? 'Terraza' : 'Terrace');
        if (property.HasLift === '1' || property.HasLift === 'Yes') features.push(isSpanish ? 'Ascensor' : 'Lift/Elevator');
        if (property.Orientation) features.push(`${isSpanish ? 'Orientación' : 'Orientation'}: ${property.Orientation}`);
        if (property.Condition) features.push(`${isSpanish ? 'Estado' : 'Condition'}: ${property.Condition}`);

        // Fallback for premium location
        if (features.length === 0) {
            features.push(isSpanish ? 'Ubicación Premium en Costa del Sol' : 'Premium Location on Costa del Sol');
            features.push(isSpanish ? 'Calidades de Alto Standing' : 'High-End Finishes');
        }
        return features;
    };

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInquirySubmitting(true);
        try {
            const response = await fetch("/api/property-inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...inquiryForm,
                    propertyRef: property?.Reference,
                    propertyTitle: property?.TypeName,
                }),
            });
            const result = await response.json();
            if (result.success) {
                toast.success(isSpanish ? "Solicitud enviada con éxito. Le contactaremos pronto." : "Inquiry sent successfully. We'll contact you soon.");
                setInquiryForm({ name: "", email: "", phone: "", message: "" });
            } else {
                toast.error(result.message || "Error");
            }
        } catch {
            toast.error(isSpanish ? "Error al enviar. Intente de nuevo." : "Failed to send. Please try again.");
        } finally {
            setInquirySubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-serif text-[#2B5F8C]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A961] mx-auto mb-4"></div>
                <p className="italic">{isSpanish ? 'Cargando detalles...' : 'Loading details...'}</p>
            </div>
        </div>
    );
    if (error || !property) return (
        <div className="min-h-screen flex items-center justify-center font-serif text-red-500">
            <div className="text-center">
                <p className="text-xl mb-4">{error}</p>
                <Link href="/properties-for-sale">
                    <Button variant="outline" className="rounded-none">{isSpanish ? 'Volver a propiedades' : 'Back to properties'}</Button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Gallery Header */}
            <div className="pt-24 bg-[#fcfcfc]">
                <div className="container mx-auto px-4 py-8">
                    <button onClick={() => window.history.back()} className="flex items-center gap-2 text-[#2B5F8C] font-bold uppercase tracking-widest text-xs mb-8 hover:text-[#C9A961] transition-colors">
                        <ArrowLeft className="w-4 h-4" /> {isSpanish ? 'Volver a la búsqueda' : 'Back to search'}
                    </button>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[500px] overflow-hidden rounded-sm shadow-2xl cursor-pointer" onClick={() => setGalleryOpen(true)}>
                        <div className="h-full">
                            <img src={images[0] || property.MainImage} alt={property.TypeName} className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
                            {images.slice(1, 5).map((img, idx) => (
                                <div key={idx} className="relative overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt={`${property.TypeName} ${idx + 2}`} />
                                    {idx === 3 && images.length > 5 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white text-lg font-serif">+{images.length - 5} {isSpanish ? 'fotos' : 'photos'}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Image Counter */}
                    <div className="text-center mt-4 text-sm text-gray-500">
                        {images.length > 1 && (
                            <span>{images.length} {isSpanish ? 'fotos' : 'photos'} • Click to view all</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <div className="flex items-center gap-4 mb-4 flex-wrap">
                                <span className="bg-[#C9A961] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2">
                                    Ref: {property.Reference}
                                </span>
                                <span className="text-[#fd7e14] text-xs uppercase tracking-widest flex items-center font-semibold">
                                    <MapPin className="w-3 h-3 mr-2" /> {property.Location || property.Area}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6 leading-tight">{property.TypeName}</h1>
                            <p className="text-3xl font-bold text-[#28a745] font-serif">€{property.Price?.toLocaleString()}</p>
                        </div>

                        {/* Features Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-gray-100">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{isSpanish ? 'Dormitorios' : 'Bedrooms'}</span>
                                <div className="flex items-center gap-2 text-xl font-serif text-[#1a1a1a]">
                                    <Bed className="w-5 h-5 text-[#C9A961]" /> {property.Beds}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{isSpanish ? 'Baños' : 'Bathrooms'}</span>
                                <div className="flex items-center gap-2 text-xl font-serif text-[#1a1a1a]">
                                    <Bath className="w-5 h-5 text-[#C9A961]" /> {property.Baths}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{isSpanish ? 'Construido' : 'Built'}</span>
                                <div className="flex items-center gap-2 text-xl font-serif text-[#1a1a1a]">
                                    <Maximize className="w-5 h-5 text-[#C9A961]" /> {property.BuiltArea} m²
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{isSpanish ? 'Parcela' : 'Plot'}</span>
                                <div className="flex items-center gap-2 text-xl font-serif text-[#1a1a1a]">
                                    <Maximize className="w-5 h-5 text-[#C9A961]" /> {property.PlotArea || 0} m²
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-serif text-[#1a1a1a] mb-8 uppercase tracking-widest">{isSpanish ? 'Descripción' : 'Description'}</h2>
                            <div
                                className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: property.Description }}
                            />
                        </div>

                        {/* Map Section */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-serif text-[#1a1a1a] mb-8 uppercase tracking-widest">{isSpanish ? 'Ubicación' : 'Location'}</h2>
                            <div className="h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
                                <iframe
                                    src={getMapUrl()}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="sticky top-32 space-y-6">
                            {/* Inquiry Form */}
                            <div className="bg-[#2B5F8C] p-8 text-white shadow-2xl">
                                <h3 className="text-xl font-serif mb-6 border-b border-white/20 pb-4">
                                    {isSpanish ? 'Solicitar Información' : 'Request Information'}
                                </h3>
                                <form onSubmit={handleInquirySubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        required
                                        value={inquiryForm.name}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C9A961] text-sm"
                                        placeholder={isSpanish ? "Tu nombre" : "Your name"}
                                    />
                                    <input
                                        type="email"
                                        required
                                        value={inquiryForm.email}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C9A961] text-sm"
                                        placeholder={isSpanish ? "Tu email" : "Your email"}
                                    />
                                    <input
                                        type="tel"
                                        value={inquiryForm.phone}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C9A961] text-sm"
                                        placeholder={isSpanish ? "Teléfono (opcional)" : "Phone (optional)"}
                                    />
                                    <textarea
                                        value={inquiryForm.message}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C9A961] text-sm h-20 resize-none"
                                        placeholder={isSpanish ? "Mensaje (opcional)" : "Message (optional)"}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={inquirySubmitting}
                                        className="w-full bg-[#C9A961] hover:bg-[#b8954f] text-white rounded-none uppercase tracking-wider font-bold h-12"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        {inquirySubmitting ? (isSpanish ? 'Enviando...' : 'Sending...') : (isSpanish ? 'Enviar Solicitud' : 'Send Inquiry')}
                                    </Button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-white/20">
                                    <a
                                        href={getWhatsAppUrl(property.Reference)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-3 py-4 font-bold uppercase tracking-widest text-xs transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5" /> WhatsApp Directo
                                    </a>
                                </div>
                            </div>

                            {/* Dynamic Features */}
                            <div className="bg-gray-50 p-8">
                                <h4 className="font-bold uppercase tracking-widest text-[#2B5F8C] text-[10px] mb-6">
                                    {isSpanish ? 'Características' : 'Features'}
                                </h4>
                                <ul className="space-y-4">
                                    {getFeatures().map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-xs text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-[#C9A961] flex-shrink-0" /> {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Gallery Modal */}
            {galleryOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setGalleryOpen(false)}>
                    <button
                        onClick={() => setGalleryOpen(false)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white z-50"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); setGalleryIndex(prev => Math.max(0, prev - 1)); }}
                        className="absolute left-6 text-white/70 hover:text-white z-50"
                        disabled={galleryIndex === 0}
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>

                    <div className="max-w-6xl max-h-[85vh] w-full mx-16" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[galleryIndex]}
                            alt={`${property.TypeName} - ${galleryIndex + 1}`}
                            className="w-full h-full object-contain"
                        />
                        <p className="text-white/70 text-center mt-4 text-sm">
                            {galleryIndex + 1} / {images.length}
                        </p>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); setGalleryIndex(prev => Math.min(images.length - 1, prev + 1)); }}
                        className="absolute right-6 text-white/70 hover:text-white z-50"
                        disabled={galleryIndex === images.length - 1}
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
}
