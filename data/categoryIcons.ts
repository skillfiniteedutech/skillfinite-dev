import {
    GraduationCap,
    Briefcase,
    Building2,
    Cloud,
    Code,
    Globe,
    Cpu,
    Shield,
    LucideIcon,
} from 'lucide-react';

export interface CategoryMeta {
    name: string;
    icon: LucideIcon;
    description: string;
    color: string; // Tailwind color class
}

export const categoryMetadata: Record<string, CategoryMeta> = {
    'Student-Focused Learning': {
        name: 'Student-Focused Learning',
        icon: GraduationCap,
        description: 'Build foundational skills for your academic and career journey',
        color: 'from-blue-500 to-blue-600',
    },
    'Career-Focused Tracks': {
        name: 'Career-Focused Tracks',
        icon: Briefcase,
        description: 'Comprehensive bootcamps to launch your tech career',
        color: 'from-purple-500 to-purple-600',
    },
    'Professional & Enterprise Upskilling': {
        name: 'Professional & Enterprise Upskilling',
        icon: Building2,
        description: 'Advanced training for professionals and enterprises',
        color: 'from-orange-500 to-orange-600',
    },
    'AWS Aligned Programs': {
        name: 'AWS Aligned Programs',
        icon: Cloud,
        description: 'Master Amazon Web Services with certified training',
        color: 'from-amber-500 to-amber-600',
    },
    'Microsoft Aligned Programs': {
        name: 'Microsoft Aligned Programs',
        icon: Code,
        description: 'Azure and Microsoft technology certifications',
        color: 'from-cyan-500 to-cyan-600',
    },
    'Tamil-Language Learning': {
        name: 'Tamil-Language Learning',
        icon: Globe,
        description: 'Learn tech skills in Tamil language',
        color: 'from-green-500 to-green-600',
    },
    'Emerging Tech & Deep Tech': {
        name: 'Emerging Tech & Deep Tech',
        icon: Cpu,
        description: 'Quantum computing, AI, robotics, and cutting-edge technologies',
        color: 'from-pink-500 to-pink-600',
    },
    'Security & Compliance': {
        name: 'Security & Compliance',
        icon: Shield,
        description: 'Cybersecurity, governance, and compliance training',
        color: 'from-red-500 to-red-600',
    },
};

export const getCategoryMeta = (categoryName: string): CategoryMeta | undefined => {
    return categoryMetadata[categoryName];
};
