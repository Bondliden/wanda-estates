
function testExtraction(message: string) {
    const lowerMsg = message.toLowerCase();

    // 1. Extracción de Criterios (Inteligencia Simple)
    const locations = ["Marbella", "Benahavís", "Estepona", "Sotogrande", "Casares", "Mijas", "Fuengirola", "Benalmádena", "Nueva Andalucía", "Golden Mile", "Milla de Oro", "Puerto Banús"];
    const detectedLocation = locations.find(loc => lowerMsg.includes(loc.toLowerCase()));

    const propertyTypesMap = {
        'villa': 'Villa',
        'casa': 'Villa',
        'finca': 'Villa',
        'apartment': 'Apartment',
        'apartamento': 'Apartment',
        'piso': 'Apartment',
        'penthouse': 'Penthouse',
        'atico': 'Penthouse',
        'ático': 'Penthouse',
        'townhouse': 'Townhouse',
        'adosado': 'Townhouse',
        'pareado': 'Townhouse'
    };
    const detectedTypeKey = Object.keys(propertyTypesMap).find(key => lowerMsg.includes(key));
    const detectedType = detectedTypeKey ? propertyTypesMap[detectedTypeKey] : 'Villa,Apartment,Penthouse,Townhouse';

    // Detección de necesidad de reforma
    const isRenovationRequest = lowerMsg.includes('reformar') || lowerMsg.includes('reforma') || lowerMsg.includes('renovar') || lowerMsg.includes('restaurar');

    // Detección básica de precio
    let detectedMaxPrice = "";
    let detectedMinPrice = "";

    // Regex mejorada para rangos y unidades
    // "1.5 y 2 millones", "1.5m - 2m", "desde 1.5 hasta 2 millones"
    const priceRegex = /(\d+(?:\.\d+)?)\s*(?:y|a|v|hasta|-|e)?\s*(\d+(?:\.\d+)?)\s*(millón|millon|millones|m|k)/g;
    let match;
    const matches = [];
    while ((match = priceRegex.exec(lowerMsg)) !== null) {
        matches.push(match);
    }

    if (matches.length > 0) {
        // Caso rango: "entre 1.5 y 2 millones"
        const lastMatch = matches[matches.length - 1];
        let minVal = parseFloat(lastMatch[1].replace(',', '.'));
        let maxVal = parseFloat(lastMatch[2].replace(',', '.'));
        const unit = lastMatch[3];

        let multiplier = 1;
        if (unit.startsWith('m')) multiplier = 1000000;
        else if (unit === 'k') multiplier = 1000;

        detectedMinPrice = String(Math.floor(minVal * multiplier));
        detectedMaxPrice = String(Math.floor(maxVal * multiplier));
    } else {
        // Caso único: "hasta 2 millones"
        const singleMatch = lowerMsg.match(/(\d+(?:\.\d+)?)\s*(millón|millon|millones|m|k)/);
        if (singleMatch) {
            let val = parseFloat(singleMatch[1].replace(',', '.'));
            const unit = singleMatch[2];
            let multiplier = 1;
            if (unit.startsWith('m')) multiplier = 1000000;
            else if (unit === 'k') multiplier = 1000;
            detectedMaxPrice = String(Math.floor(val * multiplier));
        }
    }

    console.log(`Message: "${message}"`);
    console.log(`Detected: Location=${detectedLocation}, Type=${detectedType}, Min=${detectedMinPrice}, Max=${detectedMaxPrice}, Reno=${isRenovationRequest}`);
    console.log('---');
}

testExtraction("busco una villa en marbella de entre 1.5 y 2 millones de euros");
testExtraction("villas en marbella hasta 3 millones");
testExtraction("apartamento en estepona por 500k");
testExtraction("casa para reformar en benahavis");
