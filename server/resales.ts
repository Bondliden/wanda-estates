const API_BASE_URL = 'https://webapi.resales-online.com/V6';

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function mapProperty(p: any) {
    const pics = p.PicturesContent?.Picture;
    let images: string[] = [];
    if (pics) {
        const picArray = Array.isArray(pics) ? pics : [pics];
        images = picArray.map((pic: any) => {
            console.log(`[mapProperty] Image data:`, {
                hasHighRes: !!pic.HighResURL,
                hasNormal: !!pic.PictureURL,
                highRes: pic.HighResURL?.substring(0, 50),
                normal: pic.PictureURL?.substring(0, 50)
            });
            return pic.HighResURL || pic.PictureURL;
        }).filter(Boolean);
    }
    if (p.MainImage && !images.includes(p.MainImage)) {
        images.unshift(p.MainImage);
    }
    
    console.log(`[mapProperty] Property ${p.Reference} has ${images.length} images:`, images.slice(0, 2));
    
    return {
        ...p,
        Id: p.Id || p.Reference,
        MainImage: p.MainImage || images[0] || '',
        Beds: parseInt(p.Bedrooms || p.Beds || '0'),
        Baths: parseInt(p.Bathrooms || p.Baths || '0'),
        TypeName: p.PropertyType?.NameType || (typeof p.PropertyType === 'string' ? p.PropertyType : '') || p.TypeName || '',
        Description: p.Description?.en || (typeof p.Description === 'string' ? p.Description : '') || p.Description || '',
        BuiltArea: parseFloat(p.Built || p.BuiltArea || '0'),
        PlotArea: parseFloat(p.GardenPlot || p.PlotArea || '0'),
        TerraceArea: parseFloat(p.Terrace || p.TerraceArea || '0'),
        Price: parseFloat(p.Price || '0'),
        Location: p.Location || p.Area || 'Costa del Sol',
        Latitude: p.Latitude || p.Coordinates?.lat || '',
        Longitude: p.Longitude || p.Coordinates?.lng || '',
    };
}

export async function fetchProperties(customFilters: any = {}) {
    const p1 = '1022290';
    const p2 = 'c985be4dc15535fb73878a444b7ba2a475290c37';
    const agencyFilterId = '1';

    if (typeof fetch === 'undefined') {
        throw new Error("Global fetch is not defined. Ensure Node.js 18+ is used.");
    }

    if (!p1 || !p2) {
        throw new Error("Resales Online API credentials are not configured.");
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

        if (data.transaction?.status === 'error') {
            console.error("Resales API Business Error:", data.transaction?.message);
            throw new Error(`Resales API Error: ${data.transaction?.message}`);
        }

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
                return area > 0 ? price / area : 1000000; // Avoid Infinity
            };
            const valA = getValue(a);
            const valB = getValue(b);
            if (valA !== valB) return valA - valB;
            return 0;
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
    const p1 = '1022290';
    const p2 = 'c985be4dc15535fb73878a444b7ba2a475290c37';

    if (!p1 || !p2) {
        throw new Error("Resales Online API credentials (P1/P2) are not set in the environment.");
    }

    // V6 documentation suggests PropertyDetails for specific items, or SearchProperties with p_RefId
    // We try SearchProperties first with p_RefId as it's more flexible with some account types
    const queryParams = new URLSearchParams({
        p1: p1,
        p2: p2,
        p_output: 'json',
        p_Agency_FilterId: '1',
        p_RefId: propertyId.replace(/\D/g, '') // Extract numeric part for p_RefId
    });

    try {
        const url = `${API_BASE_URL}/SearchProperties?${queryParams.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Resales API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[Resales API] Detail fetch (Search) for ${propertyId}:`, data.transaction?.status || "unknown");

        if (data.Property) {
            const prop = Array.isArray(data.Property) ? data.Property[0] : data.Property;
            // Strict check: verify reference matches
            if (prop.Reference === propertyId || prop.Id === propertyId) {
                return mapProperty(prop);
            }
        }

        // Second attempt: try the specific PropertyDetails endpoint
        const detailsUrl = `${API_BASE_URL}/PropertyDetails?p1=${p1}&p2=${p2}&p_output=json&p_RefId=${propertyId}`;
        const detailsResp = await fetch(detailsUrl);
        if (detailsResp.ok) {
            const detailsData = await detailsResp.json();
            if (detailsData.Property) {
                return mapProperty(Array.isArray(detailsData.Property) ? detailsData.Property[0] : detailsData.Property);
            }
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
