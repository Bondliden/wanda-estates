import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Download } from "lucide-react";

interface ContactFormProps {
  showMessage?: boolean;
  className?: string;
  variant?: "minimal" | "full";
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

    try {
      const response = await fetch("/api/contact", {
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
        toast.success(t("form.success") || "Message sent successfully!");
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

  if (variant === "minimal") {
    return (
      <div className={className}>
        {/* Lead Magnet Banner */}
        <div className="bg-gradient-to-r from-[#2B5F8C] to-[#1a3a54] p-6 rounded-sm mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Download className="w-8 h-8 text-[#C9A961]" />
            <h3 className="text-white font-serif text-lg">{t("leadmagnet.title")}</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">{t("leadmagnet.desc")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form-minimal">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              data-testid="input-name"
              className="w-full bg-white border border-gray-200 p-4 text-gray-700 focus:outline-none focus:border-[#C9A961] min-h-[44px]"
              placeholder={t("form.name")}
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
              placeholder={t("form.email")}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="button-submit"
            className="w-full bg-[#C9A961] hover:bg-[#b8954f] text-white rounded-none uppercase tracking-wider font-bold min-h-[48px] text-sm"
          >
            {isSubmitting ? t("form.sending") : t("leadmagnet.cta")}
          </Button>
          <p className="text-xs text-gray-500 text-center">{t("leadmagnet.privacy")}</p>
        </form>
      </div>
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
