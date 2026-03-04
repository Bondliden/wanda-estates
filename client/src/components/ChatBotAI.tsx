import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatBotAI() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.map(m => m.content),
          language: localStorage.getItem('i18nextLng') || 'en'
        }),
      });

      const data = await response.json();

      if (data.response) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.response, timestamp: new Date() },
        ]);
      } else if (data.error) {
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            content: t("chat.error") || "Lo siento, ha ocurrido un error. Por favor, inténtelo de nuevo.",
            timestamp: new Date()
          },
        ]);
      }
    } catch (error) {
      console.error("Chat AI error:", error);
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: t("chat.error") || "Lo siento, ha ocurrido un error. Por favor, inténtelo de nuevo.",
          timestamp: new Date()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-[#2B5F8C] to-[#1a3a54] hover:from-[#1a3a54] hover:to-[#0d1f2d] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen ? "scale-0" : "scale-100"}`}
        data-testid="chat-button"
        aria-label={t("chat.open")}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-lg shadow-2xl transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2B5F8C] to-[#1a3a54] text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C9A961] rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Wanda AI Assistant</h3>
              <p className="text-xs text-gray-300">Powered by tiGLM 4.5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-white/70 hover:text-white hover:bg-white/10"
              title="Clear chat"
            >
              <Loader2 className="w-4 h-4" />
            </Button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              data-testid="chat-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-3 text-[#2B5F8C]" />
              <p className="text-sm">Hello! I'm Wanda AI Assistant. I can help you with luxury real estate in Marbella, property information, investment advice, and answer questions about our services.</p>
              <p className="text-xs text-gray-400 mt-2">What would you like to know today?</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-[#2B5F8C] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] p-3 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-[#2B5F8C] text-white rounded-br-none"
                    : "bg-white text-gray-700 shadow-sm rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 bg-[#C9A961] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#2B5F8C] rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat.placeholder") || "Ask about Marbella real estate..."}
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2B5F8C] min-h-[44px]"
              data-testid="chat-input"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#C9A961] hover:bg-[#b8954f] text-white rounded-lg min-w-[44px] min-h-[44px]"
              data-testid="chat-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}