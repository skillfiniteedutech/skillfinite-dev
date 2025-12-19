'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import LogoGrid from '@/components/ui/logo-grid';
import { AnimatedText } from '@/components/ui/animated-underline-text-one';
import { UpgradeBanner } from '@/components/ui/upgrade-banner';
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiTailwindcss,
    SiNodedotjs,
    SiPython,
    SiDocker,
    SiKubernetes,
    SiAmazon,
    SiGooglecloud,
    SiMongodb,
    SiPostgresql,
    SiRedis,
    SiGraphql,
    SiGit,
    SiFigma,
    SiVercel,
    SiFirebase,
} from 'react-icons/si';

const Hero: React.FC = () => {
    const techLogos = [
        { node: <SiReact className="text-[#61DAFB]" />, title: "React" },
        { node: <SiNextdotjs className="text-black dark:text-white" />, title: "Next.js" },
        { node: <SiTypescript className="text-[#3178C6]" />, title: "TypeScript" },
        { node: <SiTailwindcss className="text-[#06B6D4]" />, title: "Tailwind CSS" },
        { node: <SiNodedotjs className="text-[#339933]" />, title: "Node.js" },
        { node: <SiPython className="text-[#3776AB]" />, title: "Python" },
        { node: <SiDocker className="text-[#2496ED]" />, title: "Docker" },
        { node: <SiKubernetes className="text-[#326CE5]" />, title: "Kubernetes" },
        { node: <SiAmazon className="text-[#FF9900]" />, title: "AWS" },
        { node: <SiGooglecloud className="text-[#4285F4]" />, title: "Google Cloud" },
        { node: <SiMongodb className="text-[#47A248]" />, title: "MongoDB" },
        { node: <SiPostgresql className="text-[#4169E1]" />, title: "PostgreSQL" },
        { node: <SiRedis className="text-[#DC382D]" />, title: "Redis" },
        { node: <SiGraphql className="text-[#E10098]" />, title: "GraphQL" },
        { node: <SiGit className="text-[#F05032]" />, title: "Git" },
        { node: <SiFigma className="text-[#F24E1E]" />, title: "Figma" },
        { node: <SiVercel className="text-black dark:text-white" />, title: "Vercel" },
        { node: <SiFirebase className="text-[#FFCA28]" />, title: "Firebase" },
    ];
    return (
        <section className="relative pt-20 pb-20 lg:pt-22 lg:pb-22 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-medium animate-fade-in">
                            <Sparkles className="w-4 h-4" />
                            <span>New Courses Available</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                            Build Skills That Shape {' '}
                            <span className="inline-block">
                                <AnimatedText
                                    text="Your Future"
                                    textClassName="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-orange-600"
                                    underlineClassName="text-orange-600"
                                    underlinePath="M 0,10 Q 75,5 150,10 Q 225,15 300,10"
                                    underlineHoverPath="M 0,10 Q 75,15 150,10 Q 225,5 300,10"
                                    underlineDuration={1.2}
                                    className="inline-block"
                                />
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Master the latest technologies with our industry-leading courses.
                            Get certified and advance your career with hands-on projects and expert mentorship.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button size="lg" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white gap-2 h-12 px-8 text-base">
                                Explore Courses
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 h-12 px-8 text-base">
                                View Accreditation
                            </Button>
                        </div>

                        <div className="pt-4">
                            <UpgradeBanner
                                buttonText="Upgrade to Pro"
                                description="for unlimited courses and certificates"
                                onClick={() => console.log("Upgrade clicked")}
                            />
                        </div>

                        <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                                            <Image
                                                src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`}
                                                alt={`User ${i}`}
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p><span className="font-bold text-gray-900">10k+</span> Students</p>
                            </div>
                            <div className="w-px h-8 bg-gray-200" />
                            <div>
                                <p><span className="font-bold text-gray-900">4.8/5</span> Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Content - Animated Logo Grid */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="h-[500px] overflow-hidden  bg-white">
                            <LogoGrid
                                logos={techLogos}
                                columns={3}
                                speed={80}
                                logoHeight={70}
                                gap={40}
                                columnGap={16}
                                hoverSpeed={20}
                                fadeOut
                                fadeOutColor="white"
                                scaleOnHover
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
