import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import officeImage from "@assets/generated_images/modern_office_building_exterior.png";
import { useTranslation } from "react-i18next";
import AuditTable from "@/components/AuditTable";

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      title: t("services.sales.title"),
      description: t("services.sales.desc"),
      features: ["Portfolio of exclusive listings", "Market valuation and analysis", "Legal and financial guidance", "Negotiation expertise"]
    },
    {
      title: t("services.investment.title"),
      description: t("services.investment.desc"),
      features: ["ROI analysis", "Market trends and forecasting", "Asset management strategies", "Off-plan investment opportunities"]
    },
    {
      title: t("services.management.title"),
      description: t("services.management.desc"),
      features: ["Maintenance and repairs", "Rental management", "Key holding services", "Regular property inspections"]
    },
    {
      title: t("services.project.title"),
      description: t("services.project.desc"),
      features: ["Project management", "Architectural planning", "Interior design coordination", "Licensing and permits"]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#2c3e50] text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-4">{t("services.title")}</h1>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column: Image */}
            <div className="sticky top-24">
              <img 
                src={officeImage} 
                alt="Wanda Estates Office" 
                className="w-full h-auto shadow-xl"
              />
              <div className="bg-[#e09900] p-8 text-white mt-[-40px] ml-[40px] relative z-10 shadow-lg hidden md:block">
                <h3 className="text-2xl font-serif mb-4">{t("services.why")}</h3>
                <p className="font-light">
                  {t("services.quote")}
                </p>
              </div>
            </div>

            {/* Right Column: Services List */}
            <div className="space-y-12">
              {services.map((service, index) => (
                <div key={index} className="border-b border-gray-100 pb-12 last:border-0 last:pb-0">
                  <h2 className="text-2xl font-serif text-[#2c3e50] uppercase mb-4">{service.title}</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-500 text-sm">
                        <span className="w-6 h-6 rounded-full bg-[#f0f9ff] text-[#2ea3f2] flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="pt-8">
                <Button className="bg-[#2ea3f2] hover:bg-[#2ea3f2]/90 text-white rounded-none uppercase tracking-wider font-bold px-8 py-6 w-full md:w-auto">
                  {t("services.consultation")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

          </div>

          {/* Strategic Marketing Audit Section */}
          <div className="mt-24">
             <AuditTable />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
