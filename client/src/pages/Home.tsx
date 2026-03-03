import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import DynamicFeaturedProperties from "@/components/DynamicFeaturedProperties";
import ExclusiveNeighborhoods from "@/components/ExclusiveNeighborhoods";

// Component force refresh: 2026-03-03 01:50
export default function Home() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />
            <main>
                <Hero />

                {/* Featured Property Section */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap items-center mb-12">
                            <div className="w-full md:w-1/4">
                                <div className="bg-[#2c3e50] text-white py-3 px-6 text-center uppercase tracking-wider text-sm font-semibold">
                                    {t("home.featured.title")}
                                </div>
                            </div>
                            <div className="w-full md:w-3/4 pl-0 md:pl-4 mt-4 md:mt-0">
                                <div className="h-px bg-gray-200 w-full"></div>
                            </div>
                        </div>

                        <div className="text-center mb-12 max-w-4xl mx-auto px-4">
                            <p className="text-2xl md:text-3xl font-serif text-[#2c3e50] mb-6 italic leading-relaxed">
                                {t("home.featured.quote.text", "«El verdadero lujo es la libertad de espíritu; es la paz interior lo que nos permite disfrutar de las cosas bellas del mundo sin ser esclavos de ellas.»")}
                            </p>
                            <p className="text-lg font-light text-[#e09900] uppercase tracking-widest">— Oscar Wilde</p>
                        </div>

                        <DynamicFeaturedProperties />
                    </div>
                </section>

                {/* Exclusive Neighborhoods Section */}
                <ExclusiveNeighborhoods />

                {/* Brand Statement Section - Bold, Large, Italic + Coastal Living Image */}
                <section className="relative py-28 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/luxury_coastal_living.png"
                            alt="Luxury Coastal Living"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-white text-4xl md:text-6xl font-serif italic font-bold leading-tight mb-8 drop-shadow-2xl">
                                "{t("home.services.desc1")}"
                            </h2>
                            <div className="w-24 h-1 bg-[#C9A961] mx-auto shadow-lg"></div>
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div></div> {/* Empty left column */}
                            <div>
                                <h2 className="text-3xl font-serif text-[#2c3e50] mb-8 uppercase">{t("home.contact.title")}</h2>
                                <ContactForm variant="minimal" />
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
