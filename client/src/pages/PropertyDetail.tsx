import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, MapPin, MessageCircle, ArrowLeft, CheckCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";

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
    TypeName: string;
    Description: string;
    MainImage: string;
    Images?: { PictureUrl: string }[];
}

export default function PropertyDetail() {
    const [, params] = useRoute("/properties/:id");
    const id = params?.id;
    const { i18n } = useTranslation();
    const isSpanish = i18n.language === "es";

    const [property, setProperty] = useState<PropertyDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/properties/${id}`);
                const data = await response.json();

                if (data.success && data.data) {
                    // Resales Online V6 often returns Details in a specific object
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

    const getWhatsAppUrl = (ref: string) => {
        const phone = "34600000000"; // Placeholder
        const message = encodeURIComponent(`Hola Wanda Estates, me interesa la propiedad con referencia ${ref}. ¿Podrían darme más información?`);
        return `https://wa.me/${phone}?text=${message}`;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-[#2B5F8C]">Cargando detalles de lujo...</div>;
    if (error || !property) return <div className="min-h-screen flex items-center justify-center font-serif text-red-500">{error}</div>;

    const images = property.Images ? (Array.isArray(property.Images) ? property.Images : [property.Images]) : [];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Gallery Header */}
            <div className="pt-24 bg-[#fcfcfc]">
                <div className="container mx-auto px-4 py-8">
                    <button onClick={() => window.history.back()} className="flex items-center gap-2 text-[#2B5F8C] font-bold uppercase tracking-widest text-xs mb-8 hover:text-[#C9A961] transition-colors">
                        <ArrowLeft className="w-4 h-4" /> {isSpanish ? 'Volver a la búsqueda' : 'Back to search'}
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] overflow-hidden rounded-sm shadow-2xl">
                        <div className="h-full">
                            <img src={property.MainImage} alt={property.TypeName} className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-4 h-full">
                            {images.slice(0, 4).map((img, idx) => (
                                <img key={idx} src={img.PictureUrl} className="w-full h-full object-cover" alt={`${property.TypeName} ${idx}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="bg-[#C9A961] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2">
                                    Ref: {property.Reference}
                                </span>
                                <span className="text-gray-400 text-xs uppercase tracking-widest flex items-center">
                                    <MapPin className="w-3 h-3 mr-2" /> {property.Location}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6 leading-tight">{property.TypeName}</h1>
                            <p className="text-3xl font-light text-[#2B5F8C] font-serif">€{property.Price?.toLocaleString()}</p>
                        </div>

                        {/* Features Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-gray-100">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Dormitorios</span>
                                <div className="flex items-center gap-2 text-xl font-serif text-[#1a1a1a]">
                                    <Bed className="w-5 h-5 text-[#C9A961]" /> {property.Beds}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Baños</span>
                                <div className="flex items-center gap-2 text-xl font-serif text-[#1a1a1a]">
                                    <Bath className="w-5 h-5 text-[#C9A961]" /> {property.Baths}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Construido</span>
                                <div className="flex items-center gap-2 text-xl font-serif text-[#1a1a1a]">
                                    <Maximize className="w-5 h-5 text-[#C9A961]" /> {property.BuiltArea} m²
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Parcela</span>
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
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-[#2B5F8C] p-8 text-white shadow-2xl">
                                <h3 className="text-xl font-serif mb-6 border-b border-white/20 pb-4">Consultar Disponibilidad</h3>
                                <div className="space-y-4">
                                    <a
                                        href={getWhatsAppUrl(property.Reference)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-3 py-4 font-bold uppercase tracking-widest text-xs transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5" /> WhatsApp Directo
                                    </a>
                                    <ContactForm variant="minimal" className="mt-8" />
                                </div>
                            </div>

                            {/* Key Features List */}
                            <div className="bg-gray-50 p-8">
                                <h4 className="font-bold uppercase tracking-widest text-[#2B5F8C] text-[10px] mb-6">Características Destacadas</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 text-xs text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-[#C9A961]" /> Ubicación Premium en Costa del Sol
                                    </li>
                                    <li className="flex items-center gap-3 text-xs text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-[#C9A961]" /> Calidades de Alto Standing
                                    </li>
                                    <li className="flex items-center gap-3 text-xs text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-[#C9A961]" /> Vistas al Mediterráneo
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
