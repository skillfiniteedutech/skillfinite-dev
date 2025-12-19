'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Partner } from '@/data/mockData';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

interface AccreditationData {
    partners: Partner[];
    trusted_companies: string[];
}

const AccreditationSection: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [trustedCompanies, setTrustedCompanies] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<AccreditationData>(`${API}/partners`);
                if (response.data) {
                    setPartners(response.data.partners || []);
                    setTrustedCompanies(response.data.trusted_companies || []);
                }
            } catch (error) {
                // Silently handle - backend not available, use empty data
                setPartners([]);
                setTrustedCompanies([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return null; // Or a skeleton

    return (
        <section className="py-2 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4">


                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 mb-16 grayscale opacity-70 hover:opacity-100 transition-opacity">
                    {trustedCompanies.map((company, index) => (
                        <span
                            key={index}
                            className="text-xl font-bold text-gray-400 hover:text-gray-600 cursor-default"
                        >
                            {company}
                        </span>
                    ))}
                </div>


                <div className="flex flex-wrap justify-center gap-8 items-center">
                    {partners.map((partner, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 group">
                            <div className="w-16 h-16 flex items-center justify-center p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-orange-200 group-hover:shadow-md transition-all">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            <span className="text-xs font-medium text-gray-500 group-hover:text-orange-600">
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AccreditationSection;
