async function test() {
    const p1 = "1022290";
    const p2 = "c985be4dc15535fb73878a444b7ba2a475290c37";
    const API_BASE_URL = 'https://webapi.resales-online.com/V6';

    const params = new URLSearchParams({
        p1: p1,
        p2: p2,
        p_output: 'json',
        p_Agency_FilterId: '1',
        p_min: '2000000',
        p_max: '12000000'
    });

    const url = `${API_BASE_URL}/SearchProperties?${params.toString()}`;
    console.log("Fetching:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Response:", JSON.stringify(data).substring(0, 500));
        if (data.Property) {
            console.log("Found properties:", data.Property.length);
        } else {
            console.log("No Property object inside data");
        }
    } catch (e) {
        console.error(e);
    }
}

test();
