import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import luxuryApartment from "@assets/stock_images/modern_luxury_apartm_b8bb6f32.jpg";

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

                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif text-[#2c3e50] mb-2 uppercase">{t("home.featured.name")}</h2>
                    <h3 className="text-xl font-light text-gray-500 mb-4">{t("home.featured.desc")}</h3>
                    <p className="text-[#e09900] font-semibold">{t("home.featured.price")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    <div className="col-span-1 md:col-span-1">
                        <img 
                            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop" 
                            alt="Luxury Apartments Exterior" 
                            className="w-full h-64 object-cover"
                        />
                        <div className="text-center mt-4">
                            <Button variant="outline" className="rounded-none border-gray-300 text-gray-500 hover:bg-[#2ea3f2] hover:text-white uppercase text-xs tracking-wider px-6 min-h-[44px]">
                                {t("home.featured.button")}
                            </Button>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-1">
                         {/* Grid of smaller images as seen in the HTML snippet */}
                         <img src={luxuryApartment} alt="Luxury Apartment Interior" className="w-full h-40 object-cover" />
                         <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" className="w-full h-40 object-cover" />
                         <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop" className="w-full h-40 object-cover" />
                         
                         <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop" className="w-full h-40 object-cover" />
                         <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" className="w-full h-40 object-cover" />
                         <img src="https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=2070&auto=format&fit=crop" className="w-full h-40 object-cover" />
                    </div>
                </div>
            </div>
        </section>

        {/* Our Services Section */}
        <section className="py-16 bg-[#f9f9f9]">
          <div className="container mx-auto px-4">
             <div className="flex flex-wrap items-center mb-12">
                    <div className="w-full md:w-1/4">
                        <div className="bg-[#2c3e50] text-white py-3 px-6 text-center uppercase tracking-wider text-sm font-semibold">
                            {t("home.services.title")}
                        </div>
                    </div>
                    <div className="w-full md:w-3/4 pl-0 md:pl-4 mt-4 md:mt-0">
                         <div className="h-px bg-gray-200 w-full"></div>
                    </div>
                </div>

             <div className="max-w-4xl mx-auto">
                <div className="text-gray-600 space-y-6 text-justify">
                   <p>
                     {t("home.services.desc1")}
                   </p>
                   <p>
                     {t("home.services.desc2")}
                   </p>
                </div>
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
