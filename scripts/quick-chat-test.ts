
const message = "Busco una villa en Marbella hasta 2 millones";
const body = JSON.stringify({ message: message });

console.log("body:", body);

async function test() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });
        const data = await response.json();
        console.log("RESPONSE_START");
        console.log(JSON.stringify(data, null, 2));
        console.log("RESPONSE_END");
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
