
import { fetchProperties } from '../server/resales';

async function simulateChatbotLogic(message: string) {
    const lowerMsg = message.toLowerCase();
    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedMsg = normalize(message);

    const locations = ["Marbella", "Benahavís", "Estepona", "Sotogrande", "Casares", "Mijas", "Fuengirola", "Benalmádena", "Nueva Andalucía", "Golden Mile", "Milla de Oro", "Puerto Banús"];
    const detectedLocation = locations.find(loc => normalizedMsg.includes(normalize(loc)));

    const propertyTypesMap: any = {
        'villa': 'Villa', 'casa': 'Villa', 'apartment': 'Apartment', 'apartamento': 'Apartment',
        'piso': 'Apartment', 'penthouse': 'Penthouse', 'atico': 'Penthouse', 'áticado': 'Penthouse',
        'townhouse': 'Townhouse', 'adosado': 'Townhouse', 'pareado': 'Townhouse', 'terreno': 'Plot',
        'parcela': 'Plot', 'plot': 'Plot', 'finca': 'Finca'
    };
    const detectedTypeKey = Object.keys(propertyTypesMap).find(key => lowerMsg.includes(key));
    let detectedType = detectedTypeKey ? propertyTypesMap[detectedTypeKey] : 'Villa,Apartment,Penthouse,Townhouse';

    let detectedBeds = "";
    const bedRegex = /(\d+)\+?\s*(?:dormitorio|habitacion|habitación|hab|beds|bedroom|bed)/i;
    const bedMatch = lowerMsg.match(bedRegex);
    if (bedMatch) detectedBeds = bedMatch[1];

    let targetPrice: number | null = null;
    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    const isAround = lowerMsg.includes('around') || lowerMsg.includes('alrededor') || lowerMsg.includes('cerca') || lowerMsg.includes('approx') || lowerMsg.includes('alredeodr');
    const singleMatch = lowerMsg.match(/(\d+(?:\.\d+)?)\s*(millón|millon|millones|million|millions|m|k|mio)/i);

    if (singleMatch) {
        const unit = singleMatch[2].toLowerCase();
        let multi = 1;
        if (unit.startsWith('m') || unit === 'million' || unit === 'millions' || unit === 'mio') {
            multi = 1000000;
        } else if (unit === 'k') {
            multi = 1000;
        }
        targetPrice = Math.floor(parseFloat(singleMatch[1].replace(',', '.')) * multi);

        if (isAround) {
            minPrice = targetPrice * 0.7; // Tighter range for luxury
            maxPrice = targetPrice * 1.3;
        } else {
            maxPrice = targetPrice * 1.1;
            if (targetPrice > 1000000) minPrice = targetPrice * 0.6;
            else minPrice = targetPrice * 0.5;
        }
    }
    console.log(`Budgets: target=${targetPrice}, min=${minPrice}, max=${maxPrice}`);
    console.log(`Detected: Loc=${detectedLocation}, Type=${detectedType}, Beds=${detectedBeds}, Min=${minPrice}, Max=${maxPrice}`);

    let props: any[] = [];
    const baseParams: any = { p_PageSize: '60', p_PropertyTypes: detectedType, p_Agency_FilterId: '1' };

    const searchTiers = [
        { loc: true, pr: true, bd: true },
        { loc: true, pr: true, bd: false },
        { loc: true, pr: false, bd: false },
        { loc: false, pr: true, bd: false },
    ];

    const forbiddenKeywords = ['commercial', 'local', 'industrial', 'warehouse', 'restaurant', 'office', 'negocio', 'traspaso', 'garage', 'parking', 'estacionamiento', 'trastero', 'plot', 'terreno', 'parcela', 'premises'];
    const allowedTypes = ['villa', 'apartment', 'penthouse', 'townhouse', 'house', 'piso', 'atico', 'áticado', 'apartamento', 'adosado', 'pareado', 'finca', 'chalet'];

    for (const tier of searchTiers) {
        if (props.length >= 10) break; // Changed from 3 to 10
        const params = { ...baseParams };
        if (tier.loc && detectedLocation) params.p_location = detectedLocation;
        if (tier.pr) {
            if (minPrice) params.p_min = String(minPrice);
            if (maxPrice) params.p_max = String(maxPrice);
        }
        if (tier.bd && detectedBeds) params.p_min_beds = detectedBeds;

        try {
            let liveData = await fetchProperties(params);
            let tierProps = (liveData?.data?.Property) ? (Array.isArray(liveData.data.Property) ? liveData.data.Property : [liveData.data.Property]) : [];
            const existingRefs = new Set(props.map(p => p.Reference));
            for (const p of tierProps) {
                if (!existingRefs.has(p.Reference)) {
                    const mapped = {
                        Reference: p.Reference || p.Id,
                        Price: Number(p.Price || 0),
                        Location: p.Location || p.Municipality,
                        Beds: p.Beds || p.Bedrooms || 0,
                        TypeName: p.TypeName || '' // Assuming TypeName exists or can be empty
                    };

                    const typeLower = (mapped.TypeName || '').toLowerCase();
                    const isBlacklisted = forbiddenKeywords.some(kw => typeLower.includes(kw));
                    const isWhitelisted = allowedTypes.some(t => typeLower.includes(t)) || typeLower === 'propiedad';

                    const minAcceptablePrice = (targetPrice || 0) > 1000000 ? (targetPrice || 0) * 0.5 : 0;
                    const hasValidPrice = mapped.Price >= minAcceptablePrice;

                    if (isWhitelisted && !isBlacklisted && hasValidPrice) {
                        props.push(mapped);
                    }
                }
            }
            console.log(`Tier logic check: Found ${tierProps.length} properties in this tier.`);
        } catch (e) {
            console.error("API error in tier", e);
        }
    }

    const finalPrice = targetPrice || maxPrice || 0;
    props.sort((a, b) => Math.abs(a.Price - finalPrice) - Math.abs(b.Price - finalPrice));

    console.log("FINAL SELECTED PROPERTIES:");
    console.log(JSON.stringify(props.slice(0, 3), null, 2));
}

simulateChatbotLogic("quiero una casa en nueva andalucia de alredeodr de 3 millones");
