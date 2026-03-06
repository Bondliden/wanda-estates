import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import DynamicFeaturedProperties from "@/components/DynamicFeaturedProperties";
import ZoneSection from "@/components/ZoneSection";
import PropertyOfTheMonth from "@/components/PropertyOfTheMonth";

// Component force refresh: 2026-03-06 09:50
export default function Home() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />
            <main>
                <Hero />

                {/* Propiedad del Mes - Maximum Prominence */}
                <PropertyOfTheMonth />

                {/* Dynamic Featured Properties Carousel */}
                <DynamicFeaturedProperties />

                {/* Exclusive Neighborhoods Sections */}
                <ZoneSection
                    zoneName="La Zagaleta"
                    locationQuery="La Zagaleta"
                    heroImage="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Benahav%C3%ADs_-_Spain_%2827137351624%29.jpg/1200px-Benahav%C3%ADs_-_Spain_%2827137351624%29.jpg"
                />

                <ZoneSection
                    zoneName="Sierra Blanca"
                    locationQuery="Sierra Blanca"
                    heroImage="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/La_Concha_Marbella.jpg/1200px-La_Concha_Marbella.jpg"
                />

                <ZoneSection
                    zoneName="Puerto Banús"
                    locationQuery="Puerto Banús"
                    heroImage="https://upload.wikimedia.org/wikipedia/commons/4/4b/Puerto_Ban%C3%BAs_-_Marbella_-_Spain.jpg"
                />

                <ZoneSection
                    zoneName="Nueva Andalucía"
                    locationQuery="Nueva Andalucia"
                    heroImage="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Golf_club_Las_Brisas_%28Nueva_Andalucia%29-105.jpg/1200px-Golf_club_Las_Brisas_%28Nueva_Andalucia%29-105.jpg"
                />


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
