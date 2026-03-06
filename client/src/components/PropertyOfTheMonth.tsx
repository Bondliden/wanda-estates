import { useTranslation } from "react-i18next";
import { Bed, Bath, Maximize, MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PropertyOfTheMonth() {
    const { t } = useTranslation();

    // Puedes cambiar estos datos fácilmente para mostrar la propiedad que quieras cada mes
    const featuredProperty = {
        Id: "R5321632",
        Reference: "R5321632",
        Title: "Oportunidad de Inversión: Terreno de Lujo",
        Price: 750000,
        BuiltArea: 620,
        PlotArea: 31000,
        Location: "Mijas Golg • Costa del Sol",
        Image: "/images/featured/R5321632.jpg?v=7"
    };

    const getWhatsAppUrl = (ref: string) => {
        const phone = "34641113518";
        const message = encodeURIComponent(`Hola Wanda Estates, me interesa el Terreno del Mes (${ref}) que he visto en la web. ¿Podrían darme más información?`);
        return `https://wa.me/${phone}?text=${message}`;
    };

    return (
        <section className="pt-0 pb-24 bg-[#f8f9fa] border-y border-gray-100 relative overflow-hidden">
            {/* Background elements for premium feel */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2c1810]/5 -skew-x-12 transform translate-x-20"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    {/* Image Side */}
                    <div className="w-full md:w-1/2 relative">
                        <div className="relative aspect-[4/5] overflow-hidden shadow-2xl rounded-sm">
                            <img
                                src={featuredProperty.Image}
                                alt={featuredProperty.Title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                            />
                            {/* Label */}
                            <div className="absolute top-8 left-8">
                                <span className="bg-[#C9A961] text-white text-[10px] font-bold uppercase tracking-[0.3em] px-6 py-2.5 shadow-xl">
                                    {t("home.featured.of_the_month", "Propiedad del Mes")}
                                </span>
                            </div>
                        </div>
                        {/* Decorative frame */}
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l-2 border-b-2 border-[#C9A961]/30 -z-10"></div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-1/2">
                        <div className="mb-8">
                            <p className="text-[#C9A961] font-medium tracking-[0.3em] uppercase text-xs mb-4">
                                {featuredProperty.Location}
                            </p>
                            <h2 className="text-4xl md:text-5xl font-serif text-[#2c3e50] leading-tight mb-6">
                                {featuredProperty.Title}
                            </h2>
                            <div className="h-px w-20 bg-[#C9A961] mb-8"></div>

                            <p className="text-gray-500 leading-relaxed mb-10 text-lg font-light italic">
                                "Oportunidad única: 31.000 m² de terreno exclusivo con la posibilidad de construir una mansión de ensueño de hasta 620 m². Un lienzo en blanco con vistas espectaculares para crear su santuario privado en un entorno natural incomparable de la Costa del Sol."
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-8 mb-12 border-y border-gray-200 py-8">
                            <div className="text-center md:text-left">
                                <Maximize className="w-5 h-5 text-[#C9A961] mx-auto md:mx-0 mb-3" />
                                <p className="text-2xl font-serif text-[#2c3e50]">{featuredProperty.BuiltArea} m²</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Potencial Edificable</p>
                            </div>
                            <div className="text-center md:text-left border-l border-gray-100 pl-8">
                                <Maximize className="w-5 h-5 text-[#C9A961] mx-auto md:mx-0 mb-3" />
                                <p className="text-2xl font-serif text-[#2c3e50]">{featuredProperty.PlotArea?.toLocaleString()} m²</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Terreno Total</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="flex-grow text-center sm:text-left">
                                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Precio de Oportunidad</p>
                                <p className="text-3xl md:text-4xl font-serif text-[#2c3e50]">
                                    €{featuredProperty.Price.toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-4 w-full sm:w-auto">
                                <a
                                    href={getWhatsAppUrl(featuredProperty.Id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors rounded-sm shadow-lg"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                </a>
                                <Link href={`/properties/${featuredProperty.Id}`}>
                                    <Button className="h-14 px-10 rounded-none bg-[#2c1810] hover:bg-black text-white uppercase text-[10px] tracking-[0.2em] font-bold shadow-lg">
                                        Ver Detalles <ChevronRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
