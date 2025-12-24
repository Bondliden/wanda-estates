import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface ContactFormProps {
  showMessage?: boolean;
  className?: string;
}

export default function ContactForm({ showMessage = false, className = "" }: ContactFormProps) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    captchaAnswer: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple captcha validation
    if (formData.captchaAnswer !== "14") {
      toast.error(t("form.error.captcha") || "Incorrect captcha answer");
      return;
    }

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
          captchaAnswer: "",
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
          className="w-full bg-[#f8f8f8] border border-gray-200 p-3 text-gray-700 focus:outline-none focus:border-[#2ea3f2]"
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
          className="w-full bg-[#f8f8f8] border border-gray-200 p-3 text-gray-700 focus:outline-none focus:border-[#2ea3f2]"
          placeholder={t("form.email")}
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">
          {t("form.phone")}
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          data-testid="input-phone"
          className="w-full bg-[#f8f8f8] border border-gray-200 p-3 text-gray-700 focus:outline-none focus:border-[#2ea3f2]"
          placeholder={t("form.phone")}
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
            className="w-full bg-[#f8f8f8] border border-gray-200 p-3 text-gray-700 focus:outline-none focus:border-[#2ea3f2] h-32"
            placeholder={t("form.message")}
          />
        </div>
      )}

      <div className="flex justify-between items-center pt-4">
        <div className="text-gray-600">
          <span className="font-bold">10 + 4 = </span>
          <input
            type="text"
            name="captchaAnswer"
            value={formData.captchaAnswer}
            onChange={handleChange}
            required
            data-testid="input-captcha"
            className="w-16 border border-gray-300 ml-2 p-1"
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          data-testid="button-submit"
          className="bg-[#2ea3f2] hover:bg-[#2ea3f2]/90 text-white rounded-none uppercase tracking-wider font-bold px-8"
        >
          {isSubmitting ? t("form.sending") || "Sending..." : t("form.send")}
        </Button>
      </div>
    </form>
  );
}
