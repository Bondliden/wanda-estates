import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { Button } from "@/components/ui/button";
import teamMeeting from "@assets/generated_images/real_estate_agent_team_meeting.png";
import { useTranslation } from "react-i18next";

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#2c3e50] text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-4">{t("about.title")}</h1>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
               <h3 className="text-[#e09900] font-bold uppercase tracking-widest text-sm mb-4">{t("about.story.title")}</h3>
               <h2 className="text-3xl md:text-4xl font-serif text-[#2c3e50] mb-6 leading-tight">
                 {t("about.story.heading")}
               </h2>
               <div className="space-y-6 text-gray-600 text-lg font-light leading-relaxed text-justify">
                 <p>
                   {t("about.story.p1")}
                 </p>
                 <p>
                   {t("about.story.p2")}
                 </p>
                 <p>
                   {t("about.story.p3")}
                 </p>
               </div>
               
               <div className="mt-8">
                 <img 
                   src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Sig_JME.png" 
                   alt="Signature" 
                   className="h-16 opacity-60" 
                 />
                 <p className="text-sm text-gray-400 mt-2 font-serif italic">{t("about.founder")}</p>
               </div>
            </div>
            
            <div className="w-full md:w-1/2 relative">
               <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-[#f0f9ff] -z-10 translate-x-8 -translate-y-8"></div>
               <img 
                 src={teamMeeting} 
                 alt="Wanda Estates Team" 
                 className="w-full h-auto shadow-2xl"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#2c3e50] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-serif text-[#e09900]">20+</span>
              <p className="uppercase tracking-widest text-sm">{t("stats.experience")}</p>
            </div>
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-serif text-[#e09900]">500+</span>
              <p className="uppercase tracking-widest text-sm">{t("stats.sold")}</p>
            </div>
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-serif text-[#e09900]">15</span>
              <p className="uppercase tracking-widest text-sm">{t("stats.agents")}</p>
            </div>
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-serif text-[#e09900]">€100M+</span>
              <p className="uppercase tracking-widest text-sm">{t("stats.volume")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-[#2c3e50] mb-6">{t("about.cta.title")}</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            {t("about.cta.desc")}
          </p>
          <Button className="bg-[#2ea3f2] hover:bg-[#2ea3f2]/90 text-white rounded-none uppercase tracking-wider font-bold px-10 py-6">
            {t("about.cta.button")}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
