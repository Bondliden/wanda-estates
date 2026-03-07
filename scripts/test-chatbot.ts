
import { handleChatMessage } from './server/chatbot';
import { Request, Response } from 'express';

async function testChatbot() {
    const mockReq = {
        body: {
            message: "Hola, busco una villa en Marbella hasta 5 millones de euros",
            conversationHistory: [],
            language: 'es'
        }
    } as unknown as Request;

    const mockRes = {
        status: function (code: number) {
            console.log("Status:", code);
            return this;
        },
        json: function (data: any) {
            console.log("Response:", JSON.stringify(data, null, 2));
            return this;
        }
    } as unknown as Response;

    console.log("Testing chatbot with message: " + mockReq.body.message);
    await handleChatMessage(mockReq, mockRes);

    const mockReq2 = {
        body: {
            message: "qué tiempo hace en Marbella?",
            conversationHistory: [],
            language: 'es'
        }
    } as unknown as Request;

    console.log("\nTesting out-of-scope message: " + mockReq2.body.message);
    await handleChatMessage(mockReq2, mockRes);
}

testChatbot();
