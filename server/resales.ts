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
        p_Agency_FilterId: '1', // Venta
        p_min: '750000',        // Base lujo
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
        console.log("Fetching Resales API:", url);

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

        // Priority 1: High Commission. Extract commission percentage / amount and sort descending
        properties.sort((a: any, b: any) => {
            const getCommission = (p: any) => {
                if (!p) return 0;
                // Resales Online can expose commission in different field names depending on the agent config
                return parseFloat(p.Commission) ||
                    parseFloat(p.CommissionPercent) ||
                    parseFloat(p.CommissionPercentage) ||
                    parseFloat(p.AgencyCommission) ||
                    0;
            };
            return getCommission(b) - getCommission(a);
        });

        // Apply shuffle if it's a "featured" request, but only shuffle the top highest commission properties to maintain business logic priority
        if (customFilters.shuffle === 'true' || !customFilters.p_sort) {
            const topHighCommission = properties.slice(0, 30);
            const theRest = properties.slice(30);
            properties = [...shuffleArray(topHighCommission), ...theRest];
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
