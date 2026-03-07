
const testChat = async () => {
    const url = 'http://127.0.0.1:5000/api/chat';
    const payload = {
        message: "houses in nueva andalucia around 3 million with 4 bedrooms",
        conversationHistory: [],
        language: 'en'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(error);
    }
};
testChat();
