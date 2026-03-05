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

// Growth Marketing & SEO Rules based on weekly trends 2026
const demandMatrix: Record<string, DemandProfile> = {
    GB: {
        countryCode: "GB",
        propertyType: "Townhouse,Villa",
        preferredLocation: "Marbella,Estepona",
        minPrice: "750000",
        titleSuffix: "Wealth-Building Marbella Real Estate | Rental Yields",
        metaDescription: "Discover high-yield luxury properties. Wanda Estates specializes in wealth management through Marbella real estate for savvy UK investors.",
    },
    SE: {
        countryCode: "SE",
        propertyType: "Villa",
        preferredLocation: "Marbella,Benahavis",
        minPrice: "1000000",
        titleSuffix: "Exklusiva villor i Marbella | Lilla Stockholm",
        metaDescription: "Investera i hållbara lyxvillor på Solkusten. Vi förstår den skandinaviska smaken för ljus, rymd och kvalitet i Nueva Andalucía.",
    },
    NL: {
        countryCode: "NL",
        propertyType: "Penthouse,Apartment",
        preferredLocation: "Marbella,Sotogrande",
        minPrice: "750000",
        titleSuffix: "Marbella Vastgoed Investering | Hoog Rendement",
        metaDescription: "Zoek u luxe vastgoed met ROI? Wanda Estates is uw partner voor fiscaal-efficiënte investeringen in Marbella en Sotogrande.",
    },
    PL: {
        countryCode: "PL",
        propertyType: "Apartment",
        preferredLocation: "Marbella,Estepona",
        minPrice: "500000",
        titleSuffix: "Luksusowe Apartamenty Marbella | Wysokie ROI",
        metaDescription: "Nowa przystań inwestycyjna w Hiszpanii. Zainwestuj w luksusowe apartamenty w Marbella z pełnym wsparciem w języku polskim.",
    },
    DE: {
        countryCode: "DE",
        propertyType: "Villa,Finca",
        preferredLocation: "Sotogrande,Benahavis",
        minPrice: "1500000",
        titleSuffix: "Luxusimmobilien Marbella | Deutsche Präzision",
        metaDescription: "Exklusivität und Diskretion an der Costa del Sol. Investment-Chancen für deutsche Anleger in Marbella, Sotogrande und Benahavís.",
    },
    FR: {
        countryCode: "FR",
        propertyType: "Villa,Penthouse",
        preferredLocation: "Marbella",
        minPrice: "1000000",
        titleSuffix: "Villas de Luxe Marbella | Sanctuaire Méditerranéen",
        metaDescription: "Découvrez l'art de vivre au soleil. Villas et penthouses de luxe avec vue mer imprenable. Accompagnement exclusif en français.",
    },
    IT: {
        countryCode: "IT",
        propertyType: "Villa,Penthouse",
        preferredLocation: "Marbella,Benahavis",
        minPrice: "1000000",
        titleSuffix: "Immobiliare di Lusso Marbella | Investimenti 2026",
        metaDescription: "Investire nel lusso in Costa del Sol. Selezioniamo le migliori opportunità 'Value for Money' per investitori italiani a Marbella.",
    },
    ES: {
        countryCode: "ES",
        propertyType: "Apartment,Villa",
        preferredLocation: "Marbella,Benahavis",
        minPrice: "750000",
        titleSuffix: "Inmobiliaria de Lujo Marbella | Wanda Estates",
        metaDescription: "Propiedades exclusivas en la Costa del Sol. Áticos, villas de lujo y apartamentos de alto standing con asesoramiento experto.",
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
