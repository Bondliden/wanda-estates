const API_BASE_URL = 'https://webapi.resales-online.com/V6';

// Helper to shuffle array
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function fetchProperties(customFilters: any = {}) {
    const p1 = process.env.RESALES_P1;
    const p2 = process.env.RESALES_P2;

    if (!p1 || !p2) {
        throw new Error("Resales Online API credentials (P1/P2) are not set in the environment.");
    }

    // LUXURY BASE FILTERS
    const baseFilters = {
        p1: p1,
        p2: p2,
        p_output: 'json',
        p_Agency_FilterId: '1', // For Sale
        p_PropertyStatus: 'Available',
        p_MustHavePictures: '1',
        p_min: '750000',        // Luxury base
        p_location: customFilters.p_location || 'Marbella,Benahavis,Estepona,Sotogrande',
    };

    const queryParams = new URLSearchParams();

    // Add base filters
    Object.entries(baseFilters).forEach(([key, value]) => queryParams.append(key, value));

    // Add custom filters, overriding base if necessary
    Object.entries(customFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'shuffle') {
            queryParams.set(key, value as string);
        }
    });

    try {
        const url = `${API_BASE_URL}/SearchProperties?${queryParams.toString()}`;
        console.log("Fetching Resales API with quality filters:", url);

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Resales API Error:", errorText);
            throw new Error(`Resales API returned status ${response.status}`);
        }

        const data = await response.json();

        let properties = [];
        if (data.Property) {
            properties = Array.isArray(data.Property) ? data.Property : [data.Property];
        }

        const SIX_MONTHS_AGO = new Date();
        SIX_MONTHS_AGO.setMonth(SIX_MONTHS_AGO.getMonth() - 6);

        // RELAXED TECHNICAL FILTRATION
        properties = properties.filter((p: any) => {
            // 1. Availability validation (STRICT)
            if (p.PropertyStatus !== 'Available') return false;

            // 2. Data Cleanliness: Description length (RELAXED)
            if (!p.Description || p.Description.length < 50) return false;

            // 3. Image Quality: Minimum 5 photos (STRICT)
            const pictureCount = p.PicturesContent?.Picture?.length ||
                (p.PicturesContent?.Picture ? 1 : 0) || 0;
            if (pictureCount < 5) return false;

            // 4. No Renders/Planos (STRICT)
            const mainImg = (p.MainImage || "").toLowerCase();
            const blacklist = ['render', 'plano', '3d', 'project', 'plan', 'blueprint', 'generic'];
            if (blacklist.some(word => mainImg.includes(word))) return false;

            // 5. Freshness: Must be updated within last 24 months (RELAXED for luxury)
            if (p.LastUpdate) {
                const TWO_YEARS_AGO = new Date();
                TWO_YEARS_AGO.setFullYear(TWO_YEARS_AGO.getFullYear() - 2);
                const lastUpdate = new Date(p.LastUpdate);
                if (lastUpdate < TWO_YEARS_AGO) return false;
            }

            return true;
        });

        // MULTI-CRITERIA SORTING
        properties.sort((a: any, b: any) => {
            // Priority 1: High Commission
            const getCommission = (p: any) => {
                return parseFloat(p.Commission) || parseFloat(p.CommissionPercent) || 0;
            };

            const commA = getCommission(a);
            const commB = getCommission(b);
            if (commB !== commA) return commB - commA;

            // Priority 2: Quality Markers (Featured or HD)
            const getQualityScore = (p: any) => {
                let score = 0;
                if (p.Featured === '1' || p.Featured === true) score += 100;
                // If has many pictures, it's usually better documented
                const pics = p.PicturesContent?.Picture?.length || 0;
                score += Math.min(pics, 20);
                return score;
            };

            const qualA = getQualityScore(a);
            const qualB = getQualityScore(b);
            if (qualB !== qualA) return qualB - qualA;

            // Priority 3: Value for Money (Lowest price per sqm)
            const getValue = (p: any) => {
                const price = parseFloat(p.Price || 0);
                const area = parseFloat(p.BuiltArea || 0);
                return area > 0 ? price / area : Infinity;
            };

            return getValue(a) - getValue(b);
        });

        // Strategic shuffle for featured properties only (Top 12)
        if (customFilters.shuffle === 'true') {
            const topProducts = properties.slice(0, 12);
            const buffer = properties.slice(12);
            properties = [...shuffleArray(topProducts), ...buffer];
        }

        return {
            ...data,
            Property: properties
        };
    } catch (error) {
        console.error("Error fetching properties from Resales Online:", error);
        throw error;
    }
}

export async function fetchPropertyDetails(propertyId: string) {
    const p1 = process.env.RESALES_P1;
    const p2 = process.env.RESALES_P2;

    if (!p1 || !p2) {
        throw new Error("Resales Online API credentials (P1/P2) are not set in the environment.");
    }

    const queryParams = new URLSearchParams({
        p1: p1,
        p2: p2,
        p_output: 'json',
        p_propertyId: propertyId
    });

    try {
        const url = `${API_BASE_URL}/PropertyDetails?${queryParams.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Resales API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching property details:", error);
        throw error;
    }
}
