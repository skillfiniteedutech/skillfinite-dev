import React, { useState } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Globe, ChevronDown } from 'lucide-react';

const Footer: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    const languages = ['English', 'Tamil', 'Hindi'];

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <a href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">K</span>
                            </div>
                            <span className="text-xl font-bold text-white">
                                Skill<span className="text-orange-500">finite</span>
                            </span>
                        </a>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Skillfinite is a leading training provider, helping professionals across industries
                            and sectors develop new expertise and bridge their skill gap for recognition and
                            growth.
                        </p>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="hover:text-orange-500 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-orange-500 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-orange-500 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-orange-500 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-orange-500 transition-colors">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm hover:border-orange-500 transition-colors"
                            >
                                <Globe className="h-4 w-4" />
                                {selectedLanguage}
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            {showLanguageDropdown && (
                                <div className="absolute bottom-full mb-2 w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setSelectedLanguage(lang);
                                                setShowLanguageDropdown(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors"
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    Become an Instructor
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    Student Support
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    Accessibility
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    Sitemap
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Subscribe */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Get the latest news and updates from Skillfinite.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter email address"
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-4 py-2 w-full focus:outline-none focus:border-orange-500"
                            />
                            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 font-medium whitespace-nowrap">
                                Go
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">© 2025 Skillfinite. All Rights Reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-white">
                            Terms & Conditions
                        </a>
                        <a href="#" className="hover:text-white">
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
