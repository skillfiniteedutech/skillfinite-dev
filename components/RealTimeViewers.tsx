'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useAuth } from '@/components/auth-context';
import io from 'socket.io-client';

const RealTimeViewers: React.FC = () => {
    const [viewerCount, setViewerCount] = useState(124);
    const [isVisible, setIsVisible] = useState(false);
    const { isAuthenticated, token } = useAuth();
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    useEffect(() => {
        // Delay initial appearance
        const initialTimer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(initialTimer);
    }, []);

    useEffect(() => {
        let socket: any;

        if (isAuthenticated && token) {
            const socketUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://skillfinite-backend-47sd.onrender.com';

            socket = io(socketUrl, {
                auth: { token },
                transports: ['websocket', 'polling']
            });

            socket.on('connect', () => {
                console.log('🔌 RealTimeViewers connected to socket');
                setIsSocketConnected(true);
            });

            socket.on('online_users', (users: any[]) => {
                const realCount = users.length;
                setViewerCount(100 + realCount);
            });

            socket.on('disconnect', () => {
                setIsSocketConnected(false);
            });

            socket.on('error', (err: any) => {
                console.error('Socket error in RealTimeViewers:', err);
            });
        }

        return () => {
            if (socket) socket.disconnect();
            setIsSocketConnected(false);
        };
    }, [isAuthenticated, token]);

    // Fallback mock update if not connected
    useEffect(() => {
        if (isSocketConnected) return;

        const intervalId = setInterval(() => {
            setViewerCount(prev => {
                const change = Math.floor(Math.random() * 5) - 2;
                return Math.max(50, prev + change);
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, [isSocketConnected]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: -50 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-6 left-6 z-40 bg-white shadow-lg rounded-lg border border-gray-200 p-4 max-w-xs hidden sm:flex items-center gap-3"
                >
                    <div className="relative">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Eye className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className={`absolute top-0 right-0 w-3 h-3 ${isSocketConnected ? 'bg-green-500' : 'bg-green-500'} border-2 border-white rounded-full animate-pulse`}></span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {viewerCount} students
                        </p>
                        <p className="text-xs text-gray-500">
                            are viewing this page
                        </p>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 p-1"
                    >
                        <span className="sr-only">Close</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RealTimeViewers;
