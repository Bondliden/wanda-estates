import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Download } from "lucide-react";

interface ContactFormProps {
  showMessage?: boolean;
  className?: string;
  variant?: "minimal" | "full" | "leadMagnet";
}

export default function ContactForm({ showMessage = false, className = "", variant = "full" }: ContactFormProps) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isGuideDownload = variant === "leadMagnet";
    const endpoint = isGuideDownload ? "/api/guide" : "/api/contact";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          language: i18n.language,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (isGuideDownload && result.downloadUrl) {
          toast.success(t("form.success") || "¡Guía en camino! Iniciando descarga...");
          // Trigger download or open guide
          window.open(result.downloadUrl, "_blank");
        } else {
          toast.success(t("form.success") || "Mensaje enviado con éxito.");
        }

        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error(result.message || t("form.error.general") || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(t("form.error.general") || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (variant === "leadMagnet") {
    const isSpanish = i18n.language === 'es';
    return (
      <div className={className}>
        {/* Lead Magnet Banner */}
        <div className="bg-gradient-to-r from-[#2B5F8C] to-[#1a3a54] p-6 rounded-sm mb-6">
          <div className="bg-[#fcfcfc] p-8 border-l-4 border-[#C9A961] shadow-sm">
            <h4 className="text-[#003366] font-serif text-xl mb-3">
              {isSpanish ? "Guía de Inversión 2026" : "2026 Investment Guide"}
            </h4>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {isSpanish
                ? "Descubra las oportunidades exclusivas del mercado inmobiliario en la Costa del Sol para este año."
                : "Discover exclusive real estate market opportunities in the Costa del Sol for this year."}
            </p>
            <Link href="/investment-guide">
              <Button variant="outline" className="w-full rounded-none border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest">
                {isSpanish ? "Ver Análisis Estratégico" : "View Strategic Analysis"}
              </Button>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form-leadmagnet">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              data-testid="input-name"
              className="w-full bg-white border border-gray-200 p-4 text-gray-700 focus:outline-none focus:border-[#C9A961] min-h-[44px]"
              placeholder={t("form.name") || "Tu nombre"}
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              data-testid="input-email"
              className="w-full bg-white border border-gray-200 p-4 text-gray-700 focus:outline-none focus:border-[#C9A961] min-h-[44px]"
              placeholder={t("form.email") || "Tu email"}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="button-submit"
            className="w-full bg-[#C9A961] hover:bg-[#b8954f] text-white rounded-none uppercase tracking-wider font-bold min-h-[48px] text-sm"
          >
            {isSubmitting ? (t("form.sending") || "Enviando...") : (t("leadmagnet.cta") || "Descargar Guía")}
          </Button>
          <p className="text-xs text-gray-500 text-center">{t("leadmagnet.privacy") || "Tus datos están seguros."}</p>
        </form>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} data-testid="contact-form-minimal">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white border border-transparent p-4 text-gray-700 focus:outline-none focus:border-[#C9A961] min-h-[44px] text-sm"
            placeholder={t("form.name") || "Tu nombre"}
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-white border border-transparent p-4 text-gray-700 focus:outline-none focus:border-[#C9A961] min-h-[44px] text-sm"
            placeholder={t("form.email") || "Tu email"}
          />
        </div>
        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-white border border-transparent p-4 text-gray-700 focus:outline-none focus:border-[#C9A961] min-h-[44px] text-sm"
            placeholder={t("form.phone") || "Teléfono (opcional)"}
          />
        </div>
        {showMessage && (
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-white border border-transparent p-4 text-gray-700 focus:outline-none focus:border-[#C9A961] h-24 text-sm"
              placeholder={t("form.message") || "Mensaje (opcional)"}
            />
          </div>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-[#2B5F8C] transition-colors rounded-none uppercase tracking-wider font-bold min-h-[48px] text-xs"
        >
          {isSubmitting ? (t("form.sending") || "Enviando...") : "Solicitar Información"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} data-testid="contact-form">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">
          {t("form.name")}
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          data-testid="input-name"
          className="w-full bg-[#f8f8f8] border border-gray-200 p-4 text-gray-700 focus:outline-none focus:border-[#C9A961] min-h-[44px]"
          placeholder={t("form.name")}
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">
          {t("form.email")}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="input-email"
          className="w-full bg-[#f8f8f8] border border-gray-200 p-4 text-gray-700 focus:outline-none focus:border-[#C9A961] min-h-[44px]"
          placeholder={t("form.email")}
        />
      </div>
      {showMessage && (
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">
            {t("form.message")}
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            data-testid="input-message"
            className="w-full bg-[#f8f8f8] border border-gray-200 p-4 text-gray-700 focus:outline-none focus:border-[#C9A961] h-32"
            placeholder={t("form.message")}
          />
        </div>
      )}

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          data-testid="button-submit"
          className="bg-[#C9A961] hover:bg-[#b8954f] text-white rounded-none uppercase tracking-wider font-bold px-8 min-h-[48px]"
        >
          {isSubmitting ? t("form.sending") : t("form.cta")}
        </Button>
      </div>
    </form>
  );
}
