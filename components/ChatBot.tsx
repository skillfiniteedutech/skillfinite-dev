'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Phone, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

type ChatView = 'chat' | 'book_call';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [view, setView] = useState<ChatView>('chat');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! 👋 I'm your AI assistant. How can I help you today?",
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, view, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const aiResponses = [
                "That's a great question! Our courses are designed to be hands-on and industry-relevant.",
                "I can definitely help with that. Could you tell me more about what you're looking for?",
                "We offer a wide range of technologies including React, Next.js, Python, and more!",
                "Feel free to explore our catalog to find the perfect course for your career goals.",
                "Is there anything specific you'd like to know about our pricing or curriculum?",
            ];
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, newAiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleBookCall = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber.trim()) return;

        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
        }, 1000);
    };

    const handleOptionSelect = (selectedView: ChatView) => {
        setView(selectedView);
        setIsOpen(true);
        setIsExpanded(false);
    };

    const handleMainButtonClick = () => {
        if (isOpen) {
            setIsOpen(false);
        } else if (isExpanded) {
            setIsExpanded(false);
        } else {
            setIsExpanded(true);
        }
    };

    const resetBookCall = () => {
        setPhoneNumber('');
        setIsSubmitted(false);
        setIsOpen(false);
        setIsExpanded(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Speed Dial Options */}
            <AnimatePresence>
                {isExpanded && !isOpen && (
                    <div className="flex flex-col gap-3 items-end mb-2">
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3"
                        >
                            <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-gray-700">
                                Book a Call
                            </span>
                            <button
                                onClick={() => handleOptionSelect('book_call')}
                                className="w-12 h-12 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            className="flex items-center gap-3"
                        >
                            <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-gray-700">
                                Chat with AI
                            </span>
                            <button
                                onClick={() => handleOptionSelect('chat')}
                                className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-2 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-orange-600 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/20 rounded-full">
                                    {view === 'chat' ? <Bot className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">
                                        {view === 'chat' ? 'AI Assistant' : 'Request Callback'}
                                    </h3>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden bg-gray-50 relative">

                            {/* CHAT VIEW */}
                            {view === 'chat' && (
                                <div className="h-full flex flex-col">
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'user'
                                                        ? 'bg-orange-600 text-white rounded-br-none'
                                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                                        }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}
                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-white border-t border-gray-100">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Type a message..."
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                className="flex-1 focus-visible:ring-orange-500"
                                            />
                                            <Button
                                                onClick={handleSendMessage}
                                                className="bg-orange-600 hover:bg-orange-700 text-white w-10 h-10 rounded-lg p-0 flex items-center justify-center"
                                                disabled={!inputValue.trim()}
                                            >
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* BOOK CALL VIEW */}
                            {view === 'book_call' && (
                                <div className="h-full flex flex-col p-6 justify-center">
                                    {!isSubmitted ? (
                                        <form onSubmit={handleBookCall} className="space-y-6">
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                                    <Phone className="w-6 h-6" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">Request a Callback</h3>
                                                <p className="text-sm text-gray-500 mt-2">Enter your number and we'll call you shortly.</p>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                                                <Input
                                                    type="tel"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    className="focus-visible:ring-orange-500"
                                                    required
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                                disabled={!phoneNumber.trim()}
                                            >
                                                Request Call
                                            </Button>
                                        </form>
                                    ) : (
                                        <div className="text-center space-y-4">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-in zoom-in duration-300">
                                                <CheckCircle2 className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">Request Received!</h3>
                                            <p className="text-sm text-gray-500">Our team will contact you at {phoneNumber} shortly.</p>
                                            <Button
                                                onClick={resetBookCall}
                                                variant="outline"
                                                className="mt-4"
                                            >
                                                Back to Menu
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMainButtonClick}
                className={`h-14 w-14 rounded-full text-white shadow-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isOpen || isExpanded ? 'bg-gray-800 hover:bg-gray-900' : 'bg-orange-600 hover:bg-orange-700'
                    }`}
            >
                <AnimatePresence mode="wait">
                    {isOpen || isExpanded ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default ChatBot;
