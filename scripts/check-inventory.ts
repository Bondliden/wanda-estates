
import { fetchProperties } from '../server/resales';

async function checkInventory() {
    const params = {
        p_location: "Nueva Andalucía",
        p_min: "500000",
        p_max: "5000000",
        p_PropertyTypes: "Villa,Apartment,Penthouse,Townhouse",
        p_PageSize: '10'
    };
    try {
        const res = await fetchProperties(params);
        if (res.data && res.data.Property) {
            console.log(JSON.stringify(res.data.Property.slice(0, 3), null, 2));
        } else {
            console.log("No properties found.");
        }
    } catch (e) {
        console.error(e);
    }
}
checkInventory();
