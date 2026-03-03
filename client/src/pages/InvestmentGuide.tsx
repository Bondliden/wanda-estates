import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    TrendingUp,
    ShieldCheck,
    MapPin,
    Download,
    Calendar,
    Waves,
    Euro
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactInquirySchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function InvestmentGuide() {
    const { t, i18n } = useTranslation();
    const isSpanish = i18n.language === "es";
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [downloadReady, setDownloadReady] = useState(false);

    const form = useForm({
        resolver: zodResolver(insertContactInquirySchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: "Solicitud de Guía de Inversión 2026",
            interest: "investment"
        }
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await apiRequest("POST", "/api/guide", data);
            toast({
                title: isSpanish ? "Registro completado" : "Registration complete",
                description: isSpanish ? "Tu guía está lista para descargar." : "Your guide is ready for download.",
            });
            setDownloadReady(true);
            // Auto trigger print/download if desired, or let them click the new button
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: isSpanish ? "Hubo un problema. Por favor inténtalo de nuevo." : "There was a problem. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#1a1a1a]">
            <div className="print:hidden">
                <Navbar />
            </div>

            {/* Hero Section - Strategy Authority */}
            <header className="relative pt-32 pb-20 overflow-hidden bg-[#fcfcfc] border-b border-[#F4EBD0] print:hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-block px-3 py-1 bg-[#F4EBD0] text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                            {isSpanish ? "Análisis Estratégico 2026" : "2026 Strategic Analysis"}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-[#003366] leading-tight mb-8">
                            {isSpanish ? "Guía de Inversión" : "Investment Guide"} <br />
                            <span className="italic font-light text-[#D4AF37]">Costa del Sol 2026</span>
                        </h1>
                        <p className="text-xl text-gray-600 font-light max-w-2xl leading-relaxed mb-10">
                            {isSpanish
                                ? "Descifre el nuevo tablero fiscal, los hotspots de rentabilidad y la hoja de ruta para el inversor institucional y privado en el mercado más exclusivo del Mediterráneo."
                                : "Decrypt the new fiscal landscape, profitability hotspots, and the roadmap for institutional and private investors in the Mediterranean's most exclusive market."}
                        </p>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#F4EBD0]/20 to-transparent pointer-events-none" />
            </header>

            <main className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Content Preview (Left) */}
                    <div className="lg:col-span-7 space-y-16 print:block">
                        <section className="space-y-6">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37] border-b border-[#F4EBD0] pb-2 inline-block">
                                {isSpanish ? "Lo que descubrirá" : "What you will discover"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-[#003366]">
                                        <TrendingUp className="w-5 h-5" />
                                        <h3 className="font-serif text-lg">{isSpanish ? "Visión Macro 2026" : "2026 Macro Vision"}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {isSpanish
                                            ? "Análisis del crecimiento del 3-5% anual basado en el auge del Lujo Sostenible."
                                            : "Analysis of 3-5% annual growth driven by the Sustainable Luxury boom."}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-[#003366]">
                                        <ShieldCheck className="w-5 h-5" />
                                        <h3 className="font-serif text-lg">{isSpanish ? "Valor Insider" : "Insider Value"}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {isSpanish
                                            ? "Impacto real de la reforma del ITP al 2% y alternativas tras el fin de la Golden Visa."
                                            : "Real impact of the 2% ITP reform and alternatives after the Golden Visa era."}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-[#003366]">
                                        <MapPin className="w-5 h-5" />
                                        <h3 className="font-serif text-lg">Hotspots de Rentabilidad</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {isSpanish
                                            ? "Del Distrito Zeta en Málaga a la revalorización de la Nueva Milla de Oro en Estepona."
                                            : "From Malaga's Distrito Zeta to the value surge in Estepona's New Golden Mile."}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-[#003366]">
                                        <Waves className="w-5 h-5" />
                                        <h3 className="font-serif text-lg">Concepto 'Wintering'</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {isSpanish
                                            ? "Por qué el alquiler de media estancia es el nuevo estándar de seguridad patrimonial."
                                            : "Why mid-term rentals are the new gold standard for asset security."}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Strategy Quote */}
                        <blockquote className="border-l-4 border-[#D4AF37] pl-8 py-4 bg-[#fcfcfc] print:bg-white">
                            <p className="text-2xl font-serif italic text-[#003366] leading-relaxed mb-4">
                                {isSpanish
                                    ? "\"En 2026, la sostenibilidad ya no es un extra; es el requisito indispensable para la liquidez inmediata en el mercado de reventa.\""
                                    : "\"In 2026, sustainability is no longer an extra; it is the indispensable requirement for immediate liquidity in the resale market.\""}
                            </p>
                            <cite className="text-xs uppercase tracking-widest text-gray-400">— Director de Estrategia, Wanda Estates</cite>
                        </blockquote>
                    </div>

                    {/* Registration Form (Right) */}
                    <div className="lg:col-span-5 print:hidden">
                        <div className="sticky top-32 bg-white p-10 shadow-2xl border border-[#F4EBD0]">
                            <h2 className="text-2xl font-serif text-[#003366] mb-2">
                                {isSpanish ? "Acceso Exclusivo" : "Exclusive Access"}
                            </h2>
                            <p className="text-sm text-gray-500 mb-8 font-light leading-relaxed">
                                {isSpanish
                                    ? "Complete el registro para recibir su hoja de ruta estratégica en formato PDF."
                                    : "Complete the registration to receive your strategic roadmap in PDF format."}
                            </p>

                            {!downloadReady ? (
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#003366]">{isSpanish ? "Nombre Completo" : "Full Name"}</label>
                                        <input
                                            {...form.register("name")}
                                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#D4AF37] text-sm transition-colors"
                                            placeholder="..."
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#003366]">Email Business</label>
                                        <input
                                            {...form.register("email")}
                                            type="email"
                                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#D4AF37] text-sm transition-colors"
                                            placeholder="nom@empresa.com"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#003366]">{isSpanish ? "Teléfono" : "Phone"}</label>
                                        <input
                                            {...form.register("phone")}
                                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#D4AF37] text-sm transition-colors"
                                            placeholder="+34 ..."
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#003366] hover:bg-[#002244] text-white rounded-none h-14 uppercase text-xs tracking-[0.2em] font-bold shadow-lg transition-all"
                                    >
                                        {isSubmitting ? (isSpanish ? "Procesando..." : "Processing...") : (isSpanish ? "Descargar Guía 2026" : "Download 2026 Guide")}
                                    </Button>
                                    <p className="text-[10px] text-gray-400 text-center leading-tight">
                                        {isSpanish
                                            ? "Sus datos serán tratados con absoluta confidencialidad para fines de consultoría exclusiva."
                                            : "Your data will be treated with absolute confidentiality for exclusive consultancy purposes."}
                                    </p>
                                </form>
                            ) : (
                                <div className="text-center py-10 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="w-16 h-16 bg-[#F4EBD0] rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                                        <Download className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-serif text-[#003366]">{isSpanish ? "¡Listo para descargar!" : "Ready for download!"}</h3>
                                    <Button
                                        onClick={handleDownload}
                                        className="w-full bg-[#D4AF37] hover:bg-[#b8972f] text-white rounded-none h-14 uppercase text-xs tracking-[0.2em] font-bold shadow-lg"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> {isSpanish ? "Guardar PDF Ahora" : "Save PDF Now"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setDownloadReady(false)}
                                        className="text-gray-400 text-[10px] uppercase tracking-widest"
                                    >
                                        {isSpanish ? "Volver al formulario" : "Back to form"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* PDF Content for Printing (Hidden on Screen unless print) */}
                <div className="hidden print:block mt-20">
                    <div className="border-t border-gray-100 pt-20 space-y-32">
                        {/* Page 2: Visión Macro */}
                        <div className="page-break">
                            <h2 className="text-3xl font-serif text-[#003366] mb-8">Página 2: Visión Macro 2026</h2>
                            <div className="grid grid-cols-2 gap-10">
                                <div className="p-8 bg-[#fcfcfc] border border-[#F4EBD0]">
                                    <p className="text-sm font-bold text-[#D4AF37] mb-2">PIB TURÍSTICO</p>
                                    <p className="text-4xl font-serif text-[#003366]">13.1%</p>
                                </div>
                                <div className="p-8 bg-[#fcfcfc] border border-[#F4EBD0]">
                                    <p className="text-sm font-bold text-[#D4AF37] mb-2">CRECIMIENTO ANUAL</p>
                                    <p className="text-4xl font-serif text-[#003366]">3-5%</p>
                                </div>
                            </div>
                        </div>

                        {/* Page 3: Fiscalidad */}
                        <div className="page-break space-y-8">
                            <h2 className="text-3xl font-serif text-[#003366]">Página 3: Fiscalidad y Legal</h2>
                            <div className="space-y-6 text-gray-700">
                                <div>
                                    <h4 className="font-bold text-[#D4AF37]">Reforma ITP Andalucía</h4>
                                    <p>Tipo reducido del 2% limitado a propiedades &lt;500k€ y reventa en 2 años.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#D4AF37]">Escudo Fiscal</h4>
                                    <p>Extensión del límite conjunto IRPF-Patrimonio a no residentes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="print:hidden">
                <Footer />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body { background: white !important; font-size: 14pt; }
                    .page-break { page-break-before: always; }
                    header, footer, .print-hidden { display: none !important; }
                    .container { max-width: 100% !important; width: 100% !important; padding: 0 !important; }
                }
                `}} />
        </div>
    );
}
