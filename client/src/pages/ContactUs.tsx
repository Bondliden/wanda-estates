import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";

import { MapPin, Phone, Mail, Clock, Download, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const COMPANY_VCARD = `BEGIN:VCARD
VERSION:3.0
FN:Wanda Estates
ORG:Wanda Estates
TITLE:Luxury Real Estate
TEL;TYPE=CELL:+34 641 113 518
TEL;TYPE=WHATSAPP:+34 641 113 518
EMAIL:info@wandaestates.com
URL:https://www.wandaestates.com
ADR;TYPE=OFFICE:;;El Rodeo Alto Nº4;Nueva Andalucía;Marbella;29660;Spain
NOTE:Luxury real estate agency specializing in Marbella and Costa del Sol properties.
END:VCARD`;

function downloadVCard() {
  const blob = new Blob([COMPANY_VCARD], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Wanda-Estates-Contact.vcf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ContactUs() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Header */}
      <div className="bg-[#2c3e50] text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-4">{t("contact.title")}</h1>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-serif text-[#2c3e50] uppercase mb-8">{t("contact.touch.title")}</h2>
              <p className="text-gray-600 mb-10 leading-relaxed">
                {t("contact.touch.desc")}
              </p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#f0f9ff] text-[#2ea3f2] flex items-center justify-center mr-6 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[#2c3e50] font-bold uppercase tracking-wider mb-2">{t("contact.visit")}</h4>
                    <p className="text-gray-600">
                      El Rodeo Alto Nº4<br />
                      Nueva Andalucía, 29660<br />
                      Marbella, Málaga, Spain
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#f0f9ff] text-[#2ea3f2] flex items-center justify-center mr-6 flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[#2c3e50] font-bold uppercase tracking-wider mb-2">Contacto por WhatsApp</h4>
                    <a href="https://wa.me/34641113518" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#2ea3f2] transition-colors">
                      +34 641 113 518
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#f0f9ff] text-[#2ea3f2] flex items-center justify-center mr-6 flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[#2c3e50] font-bold uppercase tracking-wider mb-2">{t("contact.email")}</h4>
                    <p className="text-gray-600">
                      info@wandaestates.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#f0f9ff] text-[#2ea3f2] flex items-center justify-center mr-6 flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[#2c3e50] font-bold uppercase tracking-wider mb-2">{t("contact.hours")}</h4>
                    <p className="text-gray-600">
                      {t("contact.hours.week")}<br />
                      {t("contact.hours.sat")}<br />
                      {t("contact.hours.sun")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={downloadVCard}
                  className="mt-8 flex items-center justify-center gap-2 bg-[#2B5F8C] hover:bg-[#1a3a54] text-white px-6 py-3 rounded-none uppercase tracking-widest font-bold transition-colors w-full sm:w-auto"
                >
                  <Download className="w-5 h-5" />
                  {t("contact.download_vcard") || "Download Contact"}
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#f9f9f9] p-10 border border-gray-100">
              <h2 className="text-2xl font-serif text-[#2c3e50] uppercase mb-8">{t("contact.form.title")}</h2>
              <ContactForm showMessage={true} className="space-y-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] w-full bg-gray-200">
        {/* Placeholder for Map */}
        <div className="w-full h-full flex items-center justify-center bg-gray-300">
          <span className="text-gray-500 font-bold uppercase tracking-widest">Google Map Placeholder</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}
