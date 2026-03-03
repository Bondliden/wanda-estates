const API_BASE_URL = 'https://webapi.resales-online.com/V6';

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function mapProperty(p: any) {
    return {
        ...p,
        Id: p.Id || p.Reference,
        MainImage: p.MainImage || p.Pictures?.Picture?.[0]?.PictureURL || (p.PicturesContent?.Picture?.length > 0 ? p.PicturesContent.Picture[0].PictureURL : ''),
        Beds: parseInt(p.Bedrooms || p.Beds || '0'),
        Baths: parseInt(p.Bathrooms || p.Baths || '0'),
        TypeName: p.PropertyType?.NameType || (typeof p.PropertyType === 'string' ? p.PropertyType : '') || p.TypeName || '',
        Description: p.Description?.en || (typeof p.Description === 'string' ? p.Description : '') || p.Description || '',
        BuiltArea: parseFloat(p.Built || p.BuiltArea || '0'),
        PlotArea: parseFloat(p.GardenPlot || p.PlotArea || '0'),
        TerraceArea: parseFloat(p.Terrace || p.TerraceArea || '0'),
        Price: parseFloat(p.Price || '0'),
    };
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
        p_min: customFilters.p_min || '0',
        p_location: customFilters.p_location || '',
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

        let properties: any[] = [];
        if (data.Property) {
            properties = Array.isArray(data.Property) ? data.Property : [data.Property];
        }

        const SIX_MONTHS_AGO = new Date();
        properties = properties.filter((p: any) => {
            const status = p.Status?.system || p.Status || p.PropertyStatus;
            if (status && status !== 'Available') return false;
            return true;
        }).map(mapProperty);

        // Multi-criteria sorting
        properties.sort((a: any, b: any) => {
            if (a.AgencyRef && !b.AgencyRef) return -1;
            if (!a.AgencyRef && b.AgencyRef) return 1;

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
                TotalProperties: parseInt(data.QueryInfo?.PropertyCount || properties.length),
                TotalPages: Math.ceil(parseInt(data.QueryInfo?.PropertyCount || properties.length) / parseInt(pageSize)),
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

    // PropertyDetails endpoint is restricted for some V6 accounts.
    // Using SearchProperties with p_Reference filter as a stable alternative.
    const queryParams = new URLSearchParams({
        p1: p1,
        p2: p2,
        p_output: 'json',
        p_Agency_FilterId: '1',
        p_RefId: propertyId
    });

    try {
        const url = `${API_BASE_URL}/SearchProperties?${queryParams.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Resales API Error: ${response.status}`);
        }

        const data = await response.json();
        if (data.Property) {
            const prop = Array.isArray(data.Property) ? data.Property[0] : data.Property;
            return {
                ...data,
                Property: mapProperty(prop)
            };
        }
        return data;
    } catch (error) {
        console.error("Error fetching property details:", error);
        throw error;
    }
}

export async function fetchNewDevelopments(customFilters: any = {}) {
    // NewDevelopments endpoint is returning 502 for this account.
    // Falling back to SearchProperties with p_NewBuild=1 which is the V6 equivalent.
    console.log("Falling back fetchNewDevelopments to SearchProperties with p_NewBuild=1");
    return fetchProperties({
        ...customFilters,
        p_NewBuild: '1'
    });
}
