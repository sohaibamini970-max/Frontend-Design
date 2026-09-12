import React, { useState, useRef, useEffect } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Sparkles,
    Maximize2,
    Minimize2,
    Copy,
    Check,
} from 'lucide-react';
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
    const [isMaximized, setIsMaximized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Reset welcome message when role changes
    useEffect(() => {
        setMessages([
            {
                id: 1,
                role: 'bot',
                text:
                    WELCOME_BY_ROLE[user?.role] ||
                    "Hi! I'm UniAgent. How can I help?",
            },
        ]);
    }, [user?.role]);

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [messages, isTyping]);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';

        const maxHeight = 140;
        if (textarea.scrollHeight <= maxHeight) {
            textarea.style.height = `${textarea.scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        } else {
            textarea.style.height = `${maxHeight}px`;
            textarea.style.overflowY = 'auto';
        }
    }, [input]);

    const getAIResponse = async (userMessage) => {
        try {
            const data = await api.chat(userMessage);
            return data.reply || "I didn't get a response. Try again?";
        } catch (err) {
            console.error('[ChatBot] request failed:', err);
            return err.message || 'Something went wrong. Please try again.';
        }
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isTyping) return;

        const userMsg = { id: Date.now(), role: 'user', text: trimmed };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        if (textareaRef.current) {
            textareaRef.current.style.height = '24px';
            textareaRef.current.style.overflowY = 'hidden';
        }

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

    const handleCopy = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1500);
        } catch (err) {
            console.error('[ChatBot] copy failed:', err);
        }
    };

    const toggleMaximize = () => setIsMaximized((prev) => !prev);

    const closeChat = () => {
        setIsOpen(false);
        setIsMaximized(false);
    };

    return (
        <>
            {/* Chat Window */}
            <div
                className={`
                    fixed z-50 flex flex-col overflow-hidden
                    bg-white border border-gray-200 shadow-2xl
                    transition-all duration-300 origin-bottom-right
                    ${isMaximized
                        ? 'inset-0 w-full h-full rounded-none'
                        : 'bottom-24 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-8rem)] rounded-2xl'
                    }
                    ${isOpen
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-90 pointer-events-none'
                    }
                `}
            >
                {/* Header */}
                <div className="bg-[#0f2a5f] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
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

                    <div className="flex items-center gap-1">
                        <button
                            onClick={toggleMaximize}
                            className="text-white/80 hover:text-white transition p-2 rounded-lg hover:bg-white/10"
                            aria-label={isMaximized ? 'Restore chat' : 'Maximize chat'}
                            title={isMaximized ? 'Restore' : 'Maximize'}
                        >
                            {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                        <button
                            onClick={closeChat}
                            className="text-white/80 hover:text-white transition p-2 rounded-lg hover:bg-white/10"
                            aria-label="Close chat"
                            title="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 space-y-3">
                    {messages.map((msg) => {
                        const isUser = msg.role === 'user';
                        return (
                            <div
                                key={msg.id}
                                className={`group flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isUser && (
                                    <div className="w-7 h-7 rounded-full bg-[#0f2a5f] flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot size={14} className="text-white" />
                                    </div>
                                )}

                                <div className="flex items-end gap-1 max-w-[85%]">
                                    <div
                                        className={`
                                            max-w-full px-4 py-3 rounded-2xl
                                            text-sm leading-relaxed break-words
                                            ${isUser
                                                ? 'bg-[#2563eb] text-white rounded-br-sm whitespace-pre-wrap'
                                                : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm shadow-sm'
                                            }
                                        `}
                                    >
                                        {isUser ? msg.text : <FormattedMessage text={msg.text} />}
                                    </div>

                                    <button
                                        onClick={() => handleCopy(msg.text, msg.id)}
                                        className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#2563eb] hover:bg-gray-100 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        aria-label="Copy message"
                                        title="Copy message"
                                    >
                                        {copiedId === msg.id ? (
                                            <Check size={14} className="text-green-500" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                </div>

                                {isUser && (
                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                                        <User size={14} className="text-gray-600" />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {isTyping && (
                        <div className="flex gap-2 justify-start">
                            <div className="w-7 h-7 rounded-full bg-[#0f2a5f] flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot size={14} className="text-white" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 bg-white p-3 flex-shrink-0">
                    <div className="flex items-end gap-2 bg-gray-100 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#2563eb]/30 transition">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            rows={1}
                            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-700 placeholder-gray-400 py-1 overflow-hidden"
                            style={{ minHeight: '24px', maxHeight: '140px' }}
                            aria-label="Chat message"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="w-8 h-8 rounded-full bg-[#0f2a5f] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2563eb] transition flex-shrink-0"
                            aria-label="Send message"
                            title="Send message"
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
                title={isOpen ? 'Close chat' : 'Open chat'}
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

/**
 * Renders a bot message with structured formatting:
 * - Detects bullets (•, -, *) and renders them with a blue dot
 * - Detects numbered lists (1. 2. 3.)
 * - Preserves blank lines as spacers
 * - Strips ** ** markdown bold
 */
const FormattedMessage = ({ text }) => {
    if (!text) return null;

    const lines = text.split('\n');

    return (
        <div className="space-y-1.5">
            {lines.map((line, i) => {
                const trimmed = line.trim();

                if (trimmed === '') return <div key={i} className="h-1" />;

                const cleanLine = trimmed.replace(/\*\*(.+?)\*\*/g, '$1');

                if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const content = cleanLine.replace(/^[•\-\*]\s*/, '');
                    return (
                        <div key={i} className="flex gap-2 pl-1">
                            <span className="text-[#2563eb] font-bold flex-shrink-0">•</span>
                            <span className="flex-1">{content}</span>
                        </div>
                    );
                }

                const numbered = cleanLine.match(/^(\d+)\.\s+(.+)/);
                if (numbered) {
                    return (
                        <div key={i} className="flex gap-2 pl-1">
                            <span className="text-[#2563eb] font-bold flex-shrink-0">{numbered[1]}.</span>
                            <span className="flex-1">{numbered[2]}</span>
                        </div>
                    );
                }

                return <div key={i} className="leading-snug">{cleanLine}</div>;
            })}
        </div>
    );
};

export default ChatBot;