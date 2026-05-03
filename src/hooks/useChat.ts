import { useState, useCallback, useRef } from 'react';
import { ai, MODELS } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const chatRef = useRef<any>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = ai.chats.create({
          model: MODELS.CHAT,
          config: {
            systemInstruction: "You are Nexus, a highly advanced and helpful AI assistant. You are capable of both text chat and real-time voice conversations. Respond concisely and accurately.",
          }
        });
      }

      const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: text });
      
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't generate a response.",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "System error: Failed to reach knowledge core. Please check your connection.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    chatRef.current = null;
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    clearChat,
  };
}
