'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useAnimate } from 'motion/react';
import { Button } from '@/components/ui/button';
import { HighlighterItem, HighlightGroup, Particles } from '@/components/ui/highlighter';
import { Code, Laptop, Cloud, Database, Mail, Phone, MessageCircle, BookOpen } from 'lucide-react';

export default function ConnectSection() {
    const [scope, animate] = useAnimate();

    React.useEffect(() => {
        animate(
            [
                ['#pointer', { left: 200, top: 60 }, { duration: 0 }],
                ['#javascript', { opacity: 1 }, { duration: 0.3 }],
                [
                    '#pointer',
                    { left: 50, top: 102 },
                    { at: '+0.5', duration: 0.5, ease: 'easeInOut' },
                ],
                ['#javascript', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
                ['#react-js', { opacity: 1 }, { duration: 0.3 }],
                [
                    '#pointer',
                    { left: 224, top: 170 },
                    { at: '+0.5', duration: 0.5, ease: 'easeInOut' },
                ],
                ['#react-js', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
                ['#typescript', { opacity: 1 }, { duration: 0.3 }],
                [
                    '#pointer',
                    { left: 88, top: 198 },
                    { at: '+0.5', duration: 0.5, ease: 'easeInOut' },
                ],
                ['#typescript', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
                ['#next-js', { opacity: 1 }, { duration: 0.3 }],
                [
                    '#pointer',
                    { left: 200, top: 60 },
                    { at: '+0.5', duration: 0.5, ease: 'easeInOut' },
                ],
                ['#next-js', { opacity: 0.5 }, { at: '-0.3', duration: 0.1 }],
            ],
            {
                repeat: Number.POSITIVE_INFINITY,
            }
        );
    }, [animate]);

    return (
        <section className="relative mx-auto py-20 max-w-5xl px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help Choosing a Course?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Our experts can help you find the right certification path for your career goals.
                </p>
            </div>

            <HighlightGroup className="group h-full">
                <div className="group/item h-full md:col-span-6 lg:col-span-12">
                    <HighlighterItem className="rounded-3xl p-6">
                        <div className="relative z-20 h-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
                            <Particles
                                className="absolute inset-0 -z-10 opacity-10 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-100"
                                quantity={200}
                                color={'#f97316'}
                                vy={-0.2}
                            />
                            <div className="flex justify-center">
                                <div className="flex h-full flex-col justify-center gap-10 p-8 md:h-[350px] md:flex-row items-center">
                                    <div
                                        className="relative mx-auto h-[270px] w-[300px] md:h-[270px] md:w-[300px] shrink-0"
                                        ref={scope}
                                    >
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-100 p-4 rounded-full">
                                            <BookOpen className="h-8 w-8 text-orange-600" />
                                        </div>

                                        <div
                                            id="next-js"
                                            className="absolute bottom-12 left-14 rounded-3xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium shadow-sm opacity-50 flex items-center gap-2"
                                        >
                                            <Laptop className="h-3 w-3 text-blue-500" /> Web Dev
                                        </div>
                                        <div
                                            id="react-js"
                                            className="absolute left-2 top-20 rounded-3xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium shadow-sm opacity-50 flex items-center gap-2"
                                        >
                                            <Cloud className="h-3 w-3 text-orange-500" /> AWS
                                        </div>
                                        <div
                                            id="typescript"
                                            className="absolute bottom-20 right-1 rounded-3xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium shadow-sm opacity-50 flex items-center gap-2"
                                        >
                                            <Database className="h-3 w-3 text-green-500" /> Data Science
                                        </div>
                                        <div
                                            id="javascript"
                                            className="absolute right-12 top-10 rounded-3xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium shadow-sm opacity-50 flex items-center gap-2"
                                        >
                                            <Code className="h-3 w-3 text-purple-500" /> Programming
                                        </div>

                                        <div id="pointer" className="absolute">
                                            <svg
                                                width="16.8"
                                                height="18.2"
                                                viewBox="0 0 12 13"
                                                className="fill-orange-500"
                                                stroke="white"
                                                strokeWidth="1"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                                                />
                                            </svg>
                                            <span className="bg-orange-500 relative -top-1 left-3 rounded-full px-2 py-0.5 text-[10px] text-white font-bold">
                                                Advisor
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex h-full flex-col justify-center p-2 md:ml-10 max-w-md text-center md:text-left">
                                        <div className="flex flex-col">
                                            <h3 className="mt-2 pb-1 font-bold text-gray-900">
                                                <span className="text-2xl md:text-4xl">
                                                    Confused about where to start?
                                                </span>
                                            </h3>
                                        </div>
                                        <p className="mb-8 text-gray-500 mt-4 leading-relaxed">
                                            Get a free 15-minute consultation with our learning advisors to map out your
                                            career path.
                                        </p>
                                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                                                Book Free Consultation
                                            </Button>

                                            <Button variant="outline" size="icon" className="rounded-full">
                                                <Mail className="h-4 w-4 text-gray-600" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="rounded-full">
                                                <MessageCircle className="h-4 w-4 text-gray-600" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="rounded-full">
                                                <Phone className="h-4 w-4 text-gray-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </HighlighterItem>
                </div>
            </HighlightGroup>
        </section>
    );
}
