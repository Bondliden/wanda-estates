
import { fetchPropertyDetails } from "./server/resales";

async function debug() {
    const id = "R5155102";
    try {
        console.log(`Fetching details for ${id}...`);
        const details = await fetchPropertyDetails(id);
        console.log("Details fetched successfully:", JSON.stringify(details, null, 2));
    } catch (error) {
        console.error("Error in fetchPropertyDetails:", error);
    }
}

debug();
