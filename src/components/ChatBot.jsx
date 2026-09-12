import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const WELCOME_BY_ROLE = {
    admin:
        "Hi Admin! 👋 I can create students, teachers, and courses for you. Just describe what you need — for example: \"Add a student named Ali Khan, email ali@uni.edu, password ali1234, roll UNI-2024-9999, batch 2024\".",
    teacher:
        "Hi! 👋 I can look up your assigned courses and students. Try: \"Show me students in CS301\" or \"List my courses\".",
    student:
        "Hi! 👋 Ask me about your attendance, timetable, or courses. Try: \"What's my attendance?\" or \"Show my timetable\".",
};

const ChatBot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Reset welcome on role change
    useEffect(() => {
        setMessages([
            {
                id: 1,
                role: 'bot',
                text: WELCOME_BY_ROLE[user?.role] || "Hi! I'm UniAgent. How can I help?",
            },
        ]);
    }, [user?.role]);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const getAIResponse = async (userMessage) => {
        try {
            const data = await api.chat(userMessage);
            return data.reply || "I didn't get a response. Try again?";
        } catch (err) {
            console.error('[ChatBot] request failed:', err);
            return err.message || "Something went wrong. Please try again.";
        }
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isTyping) return;

        const userMsg = { id: Date.now(), role: 'user', text: trimmed };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const botReply = await getAIResponse(trimmed);
        setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, role: 'bot', text: botReply },
        ]);
        setIsTyping(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div
                className={`fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-90 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="bg-[#0f2a5f] text-white px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                            <Bot size={18} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">UniAgent AI</h3>
                            <p className="text-xs text-blue-200 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                                {user?.role ? `Connected · ${user.role}` : 'Online'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/80 hover:text-white transition p-1 rounded-full hover:bg-white/10"
                        aria-label="Close chat"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'bot' && (
                                <div className="w-7 h-7 rounded-full bg-[#0f2a5f] flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot size={14} className="text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-[#2563eb] text-white rounded-br-sm'
                                        : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm shadow-sm'
                                    }`}
                            >
                                {msg.text}
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                                    <User size={14} className="text-gray-600" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-2 justify-start">
                            <div className="w-7 h-7 rounded-full bg-[#0f2a5f] flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot size={14} className="text-white" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 bg-white p-3">
                    <div className="flex items-end gap-2 bg-gray-100 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#2563eb]/30 transition">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            rows={1}
                            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-700 placeholder-gray-400 max-h-24 py-1"
                            style={{ minHeight: '24px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="w-8 h-8 rounded-full bg-[#0f2a5f] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2563eb] transition flex-shrink-0"
                            aria-label="Send message"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                        <Sparkles size={10} />
                        UniAgent AI can make mistakes. Verify important info.
                    </p>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#0f2a5f] hover:bg-[#2563eb] text-white shadow-xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label="Toggle chat"
            >
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90 scale-0 absolute' : 'rotate-0 scale-100'}`}>
                    <MessageCircle size={24} />
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-0 scale-100' : '-rotate-90 scale-0 absolute'}`}>
                    <X size={24} />
                </div>
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>
        </>
    );
};

export default ChatBot;