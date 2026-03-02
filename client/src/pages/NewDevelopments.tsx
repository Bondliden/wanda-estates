import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import ResalesPropertyGrid from "@/components/ResalesPropertyGrid";

export default function NewDevelopments() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-[#2c3e50] text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-4">{t("developments.title")}</h1>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            {t("developments.subtitle")}
          </p>
        </div>
      </div>

      {/* Developments List */}
      <section className="py-16 flex-grow">
        <div className="container mx-auto px-4">
          <ResalesPropertyGrid isNewDevelopment={true} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
