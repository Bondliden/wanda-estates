const API_BASE_URL = 'https://webapi.resales-online.com/V6';

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function mapProperty(p: any) {
    if (!p) return null;

    try {
        // SearchProperties uses p.Pictures.Picture, PropertyDetails uses p.PicturesContent.Picture
        const rawPics = p.PicturesContent?.Picture || p.Pictures?.Picture || p.PicturesContent || p.Pictures;
        let images: string[] = [];
        if (rawPics) {
            const picArray = Array.isArray(rawPics) ? rawPics : [rawPics];
            images = picArray.map((pic: any) => {
                // Use the original URL - don't modify it, CDN only serves sizes that exist
                const url = pic.HighResURL || pic.PictureURL || (typeof pic === 'string' ? pic : '');
                return typeof url === 'string' ? url : '';
            }).filter(u => typeof u === 'string' && u.startsWith('http'));
        }

        // Use the first image from the array as MainImage if not provided
        const apiMainImage = p.MainImage || p.p_MainImage || p.ImageUrl || (images.length > 0 ? images[0] : '');

        const ref = p.Reference || p.Id || p.p_Reference || 'R0000000';

        return {
            ...p,
            Id: String(ref),
            Reference: String(ref),
            MainImage: apiMainImage || '',
            Images: images.length > 0 ? images : (apiMainImage ? [apiMainImage] : []),
            Beds: parseInt(String(p.Bedrooms || p.Beds || p.p_Bedrooms || '0')),
            Baths: parseInt(String(p.Bathrooms || p.Baths || p.p_Bathrooms || '0')),
            TypeName: p.PropertyType?.NameType || (typeof p.PropertyType === 'string' ? p.PropertyType : '') || p.TypeName || p.PropertyType?.Name || 'Property',
            Description: p.Description?.en || (typeof p.Description === 'string' ? p.Description : '') || p.Description || '',
            BuiltArea: parseFloat(String(p.Built || p.BuiltArea || p.p_BuiltArea || '0')),
            PlotArea: parseFloat(String(p.GardenPlot || p.PlotArea || p.p_PlotArea || '0')),
            TerraceArea: parseFloat(String(p.Terrace || p.TerraceArea || p.p_TerraceArea || '0')),
            Price: parseFloat(String(p.Price || p.p_Price || '0')),
            Location: p.Location || p.Municipality || p.Area || 'Costa del Sol',
            Latitude: String(p.Latitude || p.Coordinates?.lat || p.GpsX || ''),
            Longitude: String(p.Longitude || p.Coordinates?.lng || p.GpsY || ''),
        };
    } catch (e) {
        console.error("Error mapping property:", e);
        return p;
    }
}

export async function fetchProperties(customFilters: any = {}) {
    // API Credentials and shared filters
    const p1 = process.env.RESALES_P1;
    const p2 = process.env.RESALES_P2;
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
        p_Agency_FilterId: '71569',
        p_PropertyStatus: 'Available',
        p_MustHavePictures: '1',
        p_min: customFilters.p_min || '0',
        p_location: customFilters.p_location || '',
        p_PageSize: pageSize,
        p_PageIndex: pageIndex,
    };

    const queryParams = new URLSearchParams();

    // If p_RefId is provided, priority is to find that specific property.
    // We add p1, p2, output and the ID. Other filters can often cause "not found" if they don't match the specific property's data.
    if (customFilters.p_RefId) {
        queryParams.append('p1', p1);
        queryParams.append('p2', p2);
        queryParams.append('p_output', 'json');
        queryParams.append('p_Agency_FilterId', '71569');
        queryParams.append('p_RefId', customFilters.p_RefId.replace(/\D/g, ''));
        queryParams.append('p_Reference', customFilters.p_RefId);
    } else {
        const baseFilters: any = {
            p1: p1,
            p2: p2,
            p_output: 'json',
            FilterAgencyId: '71569',
            p_PropertyStatus: 'Available',
            p_MustHavePictures: '1',
            p_PageSize: pageSize,
            p_PageIndex: pageIndex,
        };

        // Transfer basic filters to queryParams
        Object.entries(baseFilters).forEach(([key, value]) => {
            queryParams.append(key, value as string);
        });

        // Map and set custom filters (overriding defaults if necessary)
        Object.entries(customFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' &&
                value !== 'undefined' && value !== 'null' &&
                !['shuffle', 'p_PageSize', 'p_PageIndex', 'searchMode'].includes(key)) {

                let apiKey = key;
                // Empirical test shows p_min is the only reliable parameter name for V6 price filtering
                if (key === 'p_min' || key === 'minPrice') {
                    queryParams.set('p_min', value as string);
                    return;
                }
                if (key === 'p_max' || key === 'maxPrice') {
                    queryParams.set('p_max', value as string);
                    return;
                }
                if (key === 'p_location') apiKey = 'p_location';
                if (key === 'p_urbanization') apiKey = 'p_urbanization';

                queryParams.set(apiKey, value as string);
            }
        });
    }

    const url = `${API_BASE_URL}/SearchProperties?${queryParams.toString()}`;
    console.log("!!! FETCHING RESALES API WITH URL:", url);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Resales API Error:", errorText);
            throw new Error(`Resales API returned status ${response.status}`);
        }

        const data = await response.json();

        // Check for common IP/Auth errors
        if (data.transaction?.status === 'error') {
            const errorMsg = data.transaction.errordescription ? Object.values(data.transaction.errordescription).join(', ') : data.transaction.message;
            console.error("!!! RESALES API AUTH/IP ERROR:", errorMsg);
            throw new Error(`Resales API Error: ${errorMsg}`);
        }

        // Ensure we find the properties regardless of the nested structure
        let rawProps: any[] = [];
        if (data.Property) {
            rawProps = Array.isArray(data.Property) ? data.Property : [data.Property];
        } else if (data.Properties?.Property) {
            rawProps = Array.isArray(data.Properties.Property) ? data.Properties.Property : [data.Properties.Property];
        } else if (data.QueryResult?.Property) {
            rawProps = Array.isArray(data.QueryResult.Property) ? data.QueryResult.Property : [data.QueryResult.Property];
        } else if (data.data?.Property) {
            rawProps = Array.isArray(data.data.Property) ? data.data.Property : [data.data.Property];
        }

        let properties = Array.isArray(rawProps) ? rawProps : [rawProps];

        console.log(`[Resales API] Extracted ${properties.length} properties from response`);

        properties = properties.filter(p => p && (p.Reference || p.Id)).map(mapProperty);

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
            success: true,
            data: {
                Property: properties,
                Pagination: {
                    CurrentPage: parseInt(String(pageIndex || 1)),
                    PageSize: parseInt(String(pageSize || 18)),
                    TotalProperties: parseInt(String(data.QueryInfo?.PropertyCount || properties.length || 0)),
                    TotalPages: Math.ceil(parseInt(String(data.QueryInfo?.PropertyCount || properties.length || 0)) / parseInt(String(pageSize || 18))),
                }
            }
        };
    } catch (error) {
        console.error("FATAL ERROR in fetchProperties:", error);
        // En lugar de solo retornar [], lanzamos el error para que routes.ts lo capture y lo veamos en la respuesta API
        throw error;
    }
}

export async function fetchPropertyDetails(propertyId: string) {
    const p1 = process.env.RESALES_P1;
    const p2 = process.env.RESALES_P2;

    if (!p1 || !p2) {
        throw new Error("Resales Online API credentials (P1/P2) are not set.");
    }

    try {
        // Try SearchProperties with p_RefId first (works for most alphanumeric references)
        const searchParams = new URLSearchParams({
            p1, p2, p_output: 'json', p_Agency_FilterId: '71569', p_RefId: propertyId
        });

        console.log(`[fetchPropertyDetails] Trying search for ${propertyId}`);
        const searchRes = await fetch(`${API_BASE_URL}/SearchProperties?${searchParams.toString()}`);
        const searchData = await searchRes.json();

        if (searchData.Property) {
            const p = Array.isArray(searchData.Property) ? searchData.Property[0] : searchData.Property;
            return mapProperty(p);
        }

        // Fallback to PropertyDetails
        console.log(`[fetchPropertyDetails] Trying Details fallback for ${propertyId}`);
        const detailRes = await fetch(`${API_BASE_URL}/PropertyDetails?${searchParams.toString()}`);
        const detailData = await detailRes.json();

        if (detailData.Property) {
            return mapProperty(detailData.Property);
        }

        return null;
    } catch (error) {
        console.error("Error in fetchPropertyDetails:", error);
        return null;
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
