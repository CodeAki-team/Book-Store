"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

type ChatMessage = {
    from: "user" | "bot";
    text: string;
};

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { from: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setErrorMessage(null); // Reset the error message on each new message

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            if (!res.ok) {
                throw new Error(`API Error: ${res.statusText}`);
            }

            const data = await res.json();

            if (!data || !data.reply) {
                throw new Error("Invalid response structure");
            }

            const botReply: ChatMessage = {
                from: "bot",
                text: data.reply || "No response from bot",
            };

            setMessages((prev) => [...prev, botReply]);
        } catch (error: any) {
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: "Error receiving response from bot." },
            ]);
            setErrorMessage(error.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!open && (
                <button
                    className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {open && (
                <div className="w-80 h-[450px] bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-xl">
                        <h2 className="text-lg font-semibold">Chat with INKSPIRE Bot</h2>
                        <button onClick={() => setOpen(false)} className="cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`text-sm p-2 rounded-lg max-w-[80%] ${
                                    msg.from === "user"
                                        ? "bg-blue-100 text-blue-800 self-end ml-auto"
                                        : "bg-gray-100 text-gray-700 self-start mr-auto"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {loading && (
                            <div className="text-sm text-gray-500 italic">Bot is typing...</div>
                        )}
                        {errorMessage && (
                            <div className="text-sm text-red-500 italic">{errorMessage}</div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={sendMessage}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm cursor-pointer"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
