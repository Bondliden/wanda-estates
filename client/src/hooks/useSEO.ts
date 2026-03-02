import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type DemandProfile = {
    countryCode: string;
    propertyType: string;
    preferredLocation: string;
    minPrice: string;
    titleSuffix: string;
    metaDescription: string;
};

// Growth Marketing & SEO Rules based on weekly trends
const demandMatrix: Record<string, DemandProfile> = {
    GB: {
        countryCode: "GB",
        propertyType: "Townhouse,Villa",
        preferredLocation: "Marbella,Estepona",
        minPrice: "750000",
        titleSuffix: "Luxury Villas & Townhouses in Costa del Sol",
        metaDescription: "Discover premium real estate in Marbella for British investors. Find your dream townhouse or luxury villa with Wanda Estates.",
    },
    SE: {
        countryCode: "SE",
        propertyType: "Villa",
        preferredLocation: "Marbella,Benahavis",
        minPrice: "1000000",
        titleSuffix: "Exklusiva villor i Marbella & Benahavís",
        metaDescription: "Investera i lyxiga och hållbara villor på Solkusten. Wanda Estates hjälper svenska köpare hitta drömboendet.",
    },
    NL: {
        countryCode: "NL",
        propertyType: "Penthouse,Apartment",
        preferredLocation: "Marbella,Sotogrande",
        minPrice: "750000",
        titleSuffix: "Luxe Penthouses & Appartementen in Marbella",
        metaDescription: "Op zoek naar luxe vastgoed aan de Costa del Sol? Wanda Estates is uw partner voor penthouses met ROI in Marbella.",
    },
    PL: {
        countryCode: "PL",
        propertyType: "Apartment",
        preferredLocation: "Marbella,Estepona",
        minPrice: "500000",
        titleSuffix: "Luksusowe Apartamenty na Costa del Sol",
        metaDescription: "Zainwestuj w luksusowe apartamenty z wysokim ROI w Marbella. Wanda Estates zapewnia pełne wsparcie polskim inwestorom.",
    },
    DE: {
        countryCode: "DE",
        propertyType: "Villa,Finca",
        preferredLocation: "Sotogrande,Benahavis",
        minPrice: "1500000",
        titleSuffix: "Luxusvillen & Fincas an der Costa del Sol",
        metaDescription: "Exklusive Immobilien in Marbella und Sotogrande. Wanda Estates hilft deutschen Investoren beim Kauf von Luxusobjekten.",
    },
    FR: {
        countryCode: "FR",
        propertyType: "Villa,Penthouse",
        preferredLocation: "Marbella",
        minPrice: "1000000",
        titleSuffix: "Villas de Luxe & Penthouses à Marbella",
        metaDescription: "Trouvez votre villa de luxe ou penthouse avec vue mer sur la Costa del Sol. Accompagnement exclusif pour les francophones.",
    },
    ES: {
        countryCode: "ES",
        propertyType: "Apartment,Villa",
        preferredLocation: "Marbella,Benahavis",
        minPrice: "750000",
        titleSuffix: "Inmobiliaria de Lujo en Marbella",
        metaDescription: "Propiedades exclusivas en la Costa del Sol. Áticos, villas de lujo y apartamentos de alto standing con Wanda Estates.",
    },
};

export function useSEO() {
    const { t, i18n } = useTranslation();
    const [demandProfile, setDemandProfile] = useState<DemandProfile>(demandMatrix["ES"]); // Fallback

    useEffect(() => {
        // 1. Fetch IP-based location for segmentation
        const detectDemand = async () => {
            try {
                const response = await fetch("/api/geo");
                const data = await response.json();

                let code = data.countryCode || "ES";
                if (!demandMatrix[code]) {
                    code = "ES"; // Default to generic Spanish/International if not in target matrix
                }

                const profile = demandMatrix[code];
                setDemandProfile(profile);

                // 2. Dynamic On-Page Optimization (Title & Meta)
                document.title = `Wanda Estates | ${profile.titleSuffix}`;

                let metaDesc = document.querySelector('meta[name="description"]');
                if (!metaDesc) {
                    metaDesc = document.createElement("meta");
                    metaDesc.setAttribute("name", "description");
                    document.head.appendChild(metaDesc);
                }
                metaDesc.setAttribute("content", profile.metaDescription);

            } catch (error) {
                console.error("Failed to fetch geo demand data:", error);
            }
        };

        detectDemand();
    }, [i18n.language]);

    return { demandProfile };
}
