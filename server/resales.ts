const API_BASE_URL = 'https://webapi.resales-online.com/V6';

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

    const pageSize = customFilters.p_PageSize || '18';
    const pageIndex = customFilters.p_PageIndex || '1';

    const baseFilters = {
        p1: p1,
        p2: p2,
        p_output: 'json',
        p_Agency_FilterId: '1',
        p_PropertyStatus: 'Available',
        p_MustHavePictures: '1',
        p_min: '750000',
        p_location: customFilters.p_location || 'Marbella,Benahavis,Estepona,Sotogrande',
        p_PageSize: pageSize,
        p_PageIndex: pageIndex,
    };

    const queryParams = new URLSearchParams();

    Object.entries(baseFilters).forEach(([key, value]) => queryParams.append(key, value));

    Object.entries(customFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'shuffle' && key !== 'p_PageSize' && key !== 'p_PageIndex') {
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

        // Quality filtration
        properties = properties.filter((p: any) => {
            if (p.PropertyStatus !== 'Available') return false;
            if (!p.Description || p.Description.length < 50) return false;

            const pictureCount = p.PicturesContent?.Picture?.length ||
                (p.PicturesContent?.Picture ? 1 : 0) || 0;
            if (pictureCount < 5) return false;

            if (!p.MainImage || p.MainImage.trim() === "") return false;

            const mainImg = (p.MainImage || "").toLowerCase();
            const blacklist = ['render', 'plano', '3d', 'project', 'plan', 'blueprint', 'generic', 'unsplash', 'stock'];
            if (blacklist.some(word => mainImg.includes(word))) return false;

            if (p.LastUpdate) {
                const TWO_YEARS_AGO = new Date();
                TWO_YEARS_AGO.setFullYear(TWO_YEARS_AGO.getFullYear() - 2);
                const lastUpdate = new Date(p.LastUpdate);
                if (lastUpdate < TWO_YEARS_AGO) return false;
            }

            return true;
        });

        // Multi-criteria sorting
        properties.sort((a: any, b: any) => {
            const getCommission = (p: any) => {
                return parseFloat(p.Commission) || parseFloat(p.CommissionPercent) || 0;
            };
            const commA = getCommission(a);
            const commB = getCommission(b);
            if (commB !== commA) return commB - commA;

            const getQualityScore = (p: any) => {
                let score = 0;
                if (p.Featured === '1' || p.Featured === true) score += 100;
                const pics = p.PicturesContent?.Picture?.length || 0;
                score += Math.min(pics, 20);
                return score;
            };
            const qualA = getQualityScore(a);
            const qualB = getQualityScore(b);
            if (qualB !== qualA) return qualB - qualA;

            const getValue = (p: any) => {
                const price = parseFloat(p.Price || 0);
                const area = parseFloat(p.BuiltArea || 0);
                return area > 0 ? price / area : Infinity;
            };
            return getValue(a) - getValue(b);
        });

        if (customFilters.shuffle === 'true') {
            const topProducts = properties.slice(0, 12);
            const buffer = properties.slice(12);
            properties = [...shuffleArray(topProducts), ...buffer];
        }

        return {
            ...data,
            Property: properties,
            Pagination: {
                CurrentPage: parseInt(pageIndex),
                PageSize: parseInt(pageSize),
                TotalProperties: parseInt(data.QueryInfo?.PropertiesFound || data.QueryInfo?.TotalProperties || properties.length),
                TotalPages: Math.ceil(parseInt(data.QueryInfo?.PropertiesFound || data.QueryInfo?.TotalProperties || properties.length) / parseInt(pageSize)),
            }
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

export async function fetchNewDevelopments(customFilters: any = {}) {
    const p1 = process.env.RESALES_P1;
    const p2 = process.env.RESALES_P2;

    if (!p1 || !p2) {
        throw new Error("Resales Online API credentials (P1/P2) are not set in the environment.");
    }

    const pageSize = customFilters.p_PageSize || '18';
    const pageIndex = customFilters.p_PageIndex || '1';

    const baseFilters = {
        p1: p1,
        p2: p2,
        p_output: 'json',
        p_Agency_FilterId: '1',
        p_MustHavePictures: '1',
        p_location: customFilters.p_location || 'Marbella,Benahavis,Estepona,Sotogrande',
        p_PageSize: pageSize,
        p_PageIndex: pageIndex,
    };

    const queryParams = new URLSearchParams();

    Object.entries(baseFilters).forEach(([key, value]) => queryParams.append(key, value));

    // Add custom filters (price range, beds, etc.)
    Object.entries(customFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'p_PageSize' && key !== 'p_PageIndex') {
            queryParams.set(key, value as string);
        }
    });

    try {
        const url = `${API_BASE_URL}/SearchNewDevelopments?${queryParams.toString()}`;
        console.log("Fetching New Developments from Resales API:", url);

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Resales API (New Devs) Error:", errorText);
            throw new Error(`Resales API returned status ${response.status}`);
        }

        const data = await response.json();

        let developments = [];
        if (data.NewDevelopment) {
            developments = Array.isArray(data.NewDevelopment) ? data.NewDevelopment : [data.NewDevelopment];
        } else if (data.Property) {
            developments = Array.isArray(data.Property) ? data.Property : [data.Property];
        }

        // Filter only developments with images
        developments = developments.filter((d: any) => {
            if (!d.MainImage && !d.Pictures?.Picture?.[0]?.PictureURL) return false;
            return true;
        });

        return {
            ...data,
            NewDevelopment: developments,
            Pagination: {
                CurrentPage: parseInt(pageIndex),
                PageSize: parseInt(pageSize),
                TotalProperties: parseInt(data.QueryInfo?.PropertiesFound || data.QueryInfo?.TotalProperties || developments.length),
                TotalPages: Math.ceil(parseInt(data.QueryInfo?.PropertiesFound || data.QueryInfo?.TotalProperties || developments.length) / parseInt(pageSize)),
            }
        };
    } catch (error) {
        console.error("Error fetching new developments from Resales Online:", error);
        throw error;
    }
}
