import { NextResponse } from 'next/server';

// Hardcoded response function
const getHardcodedResponse = (message: string) => {
    if (message.toLowerCase().includes('hi')) {
        return 'Hello! How can I help you today?';
    }
    if (message.toLowerCase().includes('how are you')) {
        return 'I am just a bot, but I am doing great! How about you?';
    }
    if (message.toLowerCase().includes('bye')) {
        return 'Goodbye! Have a great day!';
    }
    return "I'm sorry, I didn't understand that.";
};

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        console.log("Received message:", message);

        // Get the hardcoded response
        const reply = getHardcodedResponse(message);

        // Send the hardcoded reply back to the client
        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
    }
}
