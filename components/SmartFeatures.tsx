'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronRight, MoreHorizontal, CheckCircle2, Trophy, Users, Star, ArrowUpRight, Code, Cloud, Megaphone, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SmartFeatures = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Smart Features for Better Learning
                    </h2>
                    <p className="text-lg text-gray-600">
                        Gain insights, track progress, and stay engaged with a seamless and interactive learning experience.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">

                    {/* 1. Smart Performance Tracking (Wide Card) */}
                    <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col sm:flex-row gap-8 overflow-hidden relative group hover:shadow-md transition-shadow">
                        <div className="flex-1 z-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Performance Tracking</h3>
                            <p className="text-gray-600">
                                Track progress, improve efficiency, and maximize learning outcomes.
                            </p>
                        </div>

                        {/* Mock UI - Performance */}
                        <div className="flex-1 relative min-h-[200px]">
                            <div className="absolute top-0 right-0 w-full bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 transform rotate-1 group-hover:rotate-0 transition-transform duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-semibold text-gray-500">Total time spent</span>
                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-2xl font-bold text-gray-900">8hr 12min</span>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+ 10% ▲</span>
                                </div>

                                {/* Calendar Strip */}
                                <div className="flex justify-between text-center text-xs mb-4">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                                        <div key={day} className="flex flex-col gap-1">
                                            <span className="text-gray-400">{day}</span>
                                            <span className={`w-6 h-6 flex items-center justify-center rounded-full ${i === 2 ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg' : 'text-gray-700'}`}>
                                                {7 + i}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Upcoming Task */}
                                <div className="bg-white rounded-lg p-3 border border-gray-100 flex items-center gap-3 shadow-sm">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Designyow dashboard</p>
                                        <p className="text-xs text-gray-500">Due: 10 Feb | 09:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Bell */}
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-orange-500 z-20">
                                <Bell className="w-4 h-4 fill-current" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Community Groups (Tall Card) */}
                    <div className="md:col-span-1 md:row-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="mb-8 z-10">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900">Community Groups</h3>
                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">+</div>
                            </div>
                        </div>

                        {/* Mock UI - Groups List */}
                        <div className="flex-1 space-y-4 relative">
                            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none opacity-50" />

                            {[
                                { name: 'Programming', members: '48 Members', icon: Code },
                                { name: 'AWS / Azure', members: '54 Members', icon: Cloud, active: true },
                                { name: 'Digital Marketing', members: '40 Members', icon: Megaphone },
                                { name: 'Business', members: '120 Members', icon: Briefcase },
                            ].map((group, i) => (
                                <div
                                    key={i}
                                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300 ${group.active
                                        ? 'bg-white border-gray-200 shadow-lg scale-105 z-10'
                                        : 'bg-gray-50 border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm flex items-center justify-center border border-orange-200">
                                        {React.createElement(group.icon, { className: "w-5 h-5 text-white" })}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900">{group.name}</p>
                                        <p className="text-xs text-gray-500">{group.members}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 z-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Strength in Community</h3>
                            <p className="text-sm text-gray-600">
                                Connect, share insights, and grow together through collaboration and support.
                            </p>
                        </div>
                    </div>

                    {/* 3. Course Progress */}
                    <div className="md:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col justify-between group hover:shadow-md transition-shadow">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Course Progress</h3>
                            <p className="text-sm text-gray-600">
                                Track lessons, skill levels, and categories as you advance efficiently.
                            </p>
                        </div>

                        {/* Mock UI - Course List */}
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex justify-between text-xs text-gray-400 mb-3 px-2">
                                <span>Course Name</span>
                                <span>Level</span>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">Basic HTML 3</p>
                                            <p className="text-[10px] text-gray-500">12/15 Lessons</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Beginner</span>
                                </div>
                                <div className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-yellow-50 flex items-center justify-center text-yellow-600">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">Python for Abs...</p>
                                            <p className="text-[10px] text-gray-500">8/12 Lessons</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Expert</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Leaderboard & Quizzes */}
                    <div className="md:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col justify-between group hover:shadow-md transition-shadow">
                        {/* Mock UI - Quiz Input */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6 relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-5 h-5 bg-orange-500 rounded text-white flex items-center justify-center text-xs font-bold">5</span>
                                <span className="text-xs font-medium text-gray-600">HTML 5</span>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-3 mb-3 shadow-sm">
                                <span className="text-lg font-mono text-gray-900">sQ1|</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-center mb-4">Enter the 6-digit code from your instructor</p>

                            <button className="w-full bg-orange-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm">
                                Join the quiz
                            </button>

                            {/* Floating Avatar */}
                            <div className="absolute bottom-2 right-2 bg-white p-1.5 rounded-lg shadow-md flex flex-col items-center border border-gray-100 transform rotate-6">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-6 h-6 rounded-full mb-1" />
                                <span className="text-[8px] font-bold text-gray-900">Wade</span>
                                <Trophy className="w-3 h-3 text-yellow-500" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Leaderboard & Quizzes</h3>
                            <p className="text-sm text-gray-600">
                                Join quizzes, climb the leaderboard, and compete with learners worldwide.
                            </p>
                        </div>
                    </div>

                    {/* 5. Interactive Quizzes (Small Card) */}
                    <div className="md:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col justify-center group hover:shadow-md transition-shadow">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Quizzes</h3>
                            <p className="text-sm text-gray-600">
                                Test skills, earn points, and invite your friends.
                            </p>
                        </div>

                        {/* Mock UI - Quiz Stats */}
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                            <div>
                                <div className="flex -space-x-2 mb-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                            <img src={`https://randomuser.me/api/portraits/women/${i + 40}.jpg`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-500">4 friends active now</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">15<span className="text-gray-400 text-sm font-normal">/20</span></p>
                                <p className="text-[10px] text-gray-500">code quiz</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* CTA Button */}
                <div className="mt-16 text-center">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 h-12 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all transform hover:-translate-y-1">
                        Get Started
                        <ArrowUpRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default SmartFeatures;
