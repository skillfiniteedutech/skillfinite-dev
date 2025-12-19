
export interface Course {
    id: string | number;
    title: string;
    duration: string;
    enrolled: string;
    price: string;
    mode: string;
    image: string;
    tag: string;
    category: string;
    // Extended fields made standard
    rating: number;
    reviews: number;
    level: string;
    lectures: number;
    instructor: string;
    bestseller: boolean;
    description: string;
}

export interface Partner {
    name: string;
    logo: string;
}

export const categories: string[] = [
    'All Courses',
    'Student-Focused Learning',
    'Career-Focused Tracks',
    'Professional & Enterprise Upskilling',
    'AWS Aligned Programs',
    'Microsoft Aligned Programs',
    'Tamil-Language Learning',
    'Emerging Tech & Deep Tech',
    'Security & Compliance',
    'AI & Machine Learning',
];

export const courses: Course[] = [
    // 1. Student-Focused Learning
    {
        id: 101,
        title: 'Complete Python Bootcamp: From Zero to Hero',
        duration: '22 Hrs',
        enrolled: '25,400',
        price: '$3,499',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800',
        tag: 'Best Seller',
        category: 'Student-Focused Learning',
        rating: 4.8,
        reviews: 4520,
        level: 'Beginner',
        lectures: 110,
        instructor: 'Jose Portilla',
        bestseller: true,
        description: 'Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games.'
    },
    {
        id: 102,
        title: 'The Web Developer Bootcamp 2024',
        duration: '64 Hrs',
        enrolled: '18,200',
        price: '$4,999',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800',
        tag: 'Popular',
        category: 'Student-Focused Learning',
        rating: 4.7,
        reviews: 3200,
        level: 'Beginner',
        lectures: 350,
        instructor: 'Colt Steele',
        bestseller: true,
        description: 'The only course you need to learn web development - HTML, CSS, JS, Node, and more!'
    },
    {
        id: 103,
        title: 'Java Programming Masterclass',
        duration: '80 Hrs',
        enrolled: '12,100',
        price: '$3,999',
        mode: 'Live Classroom',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
        tag: 'Essential',
        category: 'Student-Focused Learning',
        rating: 4.6,
        reviews: 1800,
        level: 'Intermediate',
        lectures: 280,
        instructor: 'Tim Buchalka',
        bestseller: false,
        description: 'Master Java 17 and JDK 17, and build your own applications with this comprehensive course.'
    },
    {
        id: 104,
        title: 'Data Structures & Algorithms in C++',
        duration: '45 Hrs',
        enrolled: '8,500',
        price: '$2,999',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800',
        tag: 'Deep Dive',
        category: 'Student-Focused Learning',
        rating: 4.9,
        reviews: 950,
        level: 'Advanced',
        lectures: 140,
        instructor: 'Abdul Bari',
        bestseller: true,
        description: 'Learn Data Structures and Algorithms from scratch using C++ and master technical interviews.'
    },

    // 2. Career-Focused Tracks
    {
        id: 201,
        title: 'AWS Certified Solutions Architect - Associate',
        duration: '50 Hrs',
        enrolled: '42,000',
        price: '$6,999',
        mode: 'Bootcamp',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
        tag: 'Certification',
        category: 'Career-Focused Tracks',
        rating: 4.8,
        reviews: 8200,
        level: 'Intermediate',
        lectures: 220,
        instructor: 'Stephane Maarek',
        bestseller: true,
        description: 'The ultimate guide to passing the AWS Certified Solutions Architect Associate exam.'
    },
    {
        id: 202,
        title: 'The Data Science Course 2024: Complete Data Science Bootcamp',
        duration: '32 Hrs',
        enrolled: '29,000',
        price: '$5,499',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        tag: 'High Demand',
        category: 'Career-Focused Tracks',
        rating: 4.6,
        reviews: 4100,
        level: 'Beginner',
        lectures: 180,
        instructor: '365 Careers',
        bestseller: true,
        description: 'Complete Data Science training: Mathematics, Statistics, Python, Advanced Statistics in Python, Machine Learning & Deep Learning.'
    },
    {
        id: 203,
        title: 'Complete Digital Marketing Course',
        duration: '24 Hrs',
        enrolled: '15,000',
        price: '$3,499',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1533750088811-7a8b16218a58?auto=format&fit=crop&q=80&w=800',
        tag: 'Career Growth',
        category: 'Career-Focused Tracks',
        rating: 4.5,
        reviews: 2200,
        level: 'Beginner',
        lectures: 120,
        instructor: 'Rob Percival',
        bestseller: false,
        description: 'Master Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics & More!'
    },

    // 3. Professional & Enterprise Upskilling
    {
        id: 301,
        title: 'PMP Exam Prep Seminar - PMBOK Guide',
        duration: '35 Hrs',
        enrolled: '12,500',
        price: '$12,999',
        mode: 'Executive',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
        tag: 'Certified',
        category: 'Professional & Enterprise Upskilling',
        rating: 4.7,
        reviews: 3100,
        level: 'Advanced',
        lectures: 250,
        instructor: 'Joseph Phillips',
        bestseller: true,
        description: 'Pass the PMP Exam on your first try! Earn 35 Contact Hours/PDUs.'
    },
    {
        id: 302,
        title: 'Generative AI for Business Leaders',
        duration: '10 Hrs',
        enrolled: '5,600',
        price: '$8,999',
        mode: 'Workshop',
        image: 'https://images.unsplash.com/photo-1677442136019-21f48ed6d916?auto=format&fit=crop&q=80&w=800',
        tag: 'Trending',
        category: 'Professional & Enterprise Upskilling',
        rating: 4.8,
        reviews: 890,
        level: 'Intermediate',
        lectures: 45,
        instructor: 'Andrew Ng',
        bestseller: true,
        description: 'Understand how Generative AI is reshaping business and how to leverage it for strategy and growth.'
    },

    // 4. AWS Aligned Programs
    {
        id: 401,
        title: 'AWS Certified Developer - Associate',
        duration: '32 Hrs',
        enrolled: '21,000',
        price: '$6,499',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=800',
        tag: 'Developer',
        category: 'AWS Aligned Programs',
        rating: 4.7,
        reviews: 3500,
        level: 'Intermediate',
        lectures: 180,
        instructor: 'Stephane Maarek',
        bestseller: true,
        description: 'Pass the AWS Certified Developer Associate Exam & Master the AWS Cloud.'
    },
    {
        id: 402,
        title: 'AWS SysOps Administrator - Associate',
        duration: '28 Hrs',
        enrolled: '15,000',
        price: '$6,499',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
        tag: 'Admin',
        category: 'AWS Aligned Programs',
        rating: 4.6,
        reviews: 2100,
        level: 'Advanced',
        lectures: 160,
        instructor: 'Neal Davis',
        bestseller: false,
        description: 'Become an AWS SysOps Administrator and clear the SOA-C02 exam with confidence.'
    },

    // 5. Microsoft Aligned Programs
    {
        id: 501,
        title: 'Microsoft Azure Fundamentals (AZ-900)',
        duration: '12 Hrs',
        enrolled: '55,000',
        price: '$2,999',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1633419461186-7d40a2e12729?auto=format&fit=crop&q=80&w=800',
        tag: 'Foundation',
        category: 'Microsoft Aligned Programs',
        rating: 4.5,
        reviews: 9800,
        level: 'Beginner',
        lectures: 80,
        instructor: 'Scott Duffy',
        bestseller: true,
        description: 'Everything you need to know to pass the AZ-900 Microsoft Azure Fundamentals exam.'
    },
    {
        id: 502,
        title: 'AZ-104: Microsoft Azure Administrator',
        duration: '40 Hrs',
        enrolled: '22,000',
        price: '$6,999',
        mode: 'Bootcamp',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
        tag: 'Admin',
        category: 'Microsoft Aligned Programs',
        rating: 4.7,
        reviews: 3400,
        level: 'Intermediate',
        lectures: 210,
        instructor: 'Alan Rodrigues',
        bestseller: true,
        description: 'Comprehensive guide to becoming a Microsoft Azure Administrator and passing the AZ-104 exam.'
    },

    // 6. Tamil-Language Learning
    {
        id: 601,
        title: 'Python Programming in Tamil',
        duration: '20 Hrs',
        enrolled: '12,000',
        price: 'Free',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        tag: 'தமிழ்',
        category: 'Tamil-Language Learning',
        rating: 4.9,
        reviews: 2500,
        level: 'Beginner',
        lectures: 90,
        instructor: 'Naveen Kumar',
        bestseller: true,
        description: 'Learn Python programming from scratch in your native language Tamil.'
    },
    {
        id: 602,
        title: 'Web Development Full Course (Tamil)',
        duration: '45 Hrs',
        enrolled: '8,500',
        price: '$1,999',
        mode: 'Live Classroom',
        image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800',
        tag: 'தமிழ்',
        category: 'Tamil-Language Learning',
        rating: 4.8,
        reviews: 1200,
        level: 'Beginner',
        lectures: 200,
        instructor: 'Cyber Dude Networks',
        bestseller: false,
        description: 'Become a Full Stack Web Developer learning HTML, CSS, Javascript in Tamil.'
    },

    // 7. Emerging Tech & Deep Tech
    {
        id: 701,
        title: 'Quantum Computing for Everyone',
        duration: '15 Hrs',
        enrolled: '2,500',
        price: '$8,999',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
        tag: 'Future',
        category: 'Emerging Tech & Deep Tech',
        rating: 4.6,
        reviews: 450,
        level: 'Beginner',
        lectures: 60,
        instructor: 'Dr. Hems',
        bestseller: false,
        description: 'Understand the building blocks of Quantum Computing without complex math.'
    },
    {
        id: 702,
        title: 'Edge AI and IoT Intelligence',
        duration: '30 Hrs',
        enrolled: '3,200',
        price: '$10,999',
        mode: 'Lab',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        tag: 'IoT',
        category: 'Emerging Tech & Deep Tech',
        rating: 4.7,
        reviews: 600,
        level: 'Intermediate',
        lectures: 140,
        instructor: 'IoT Academy',
        bestseller: true,
        description: 'Deploy Artificial Intelligence models on Edge devices and build smart IoT solutions.'
    },

    // 8. Security & Compliance
    {
        id: 801,
        title: 'Comptia Security+ (SY0-701) Complete Course',
        duration: '22 Hrs',
        enrolled: '18,500',
        price: '$5,999',
        mode: 'Online',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
        tag: 'Security',
        category: 'Security & Compliance',
        rating: 4.8,
        reviews: 2900,
        level: 'Beginner',
        lectures: 150,
        instructor: 'Jason Dion',
        bestseller: true,
        description: 'Pass the CompTIA Security+ certification exam with confidence on your first attempt.'
    },
    {
        id: 802,
        title: 'Certified Ethical Hacker (CEH) v12',
        duration: '40 Hrs',
        enrolled: '9,000',
        price: '$15,499',
        mode: 'Bootcamp',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
        tag: 'Hacking',
        category: 'Security & Compliance',
        rating: 4.6,
        reviews: 1500,
        level: 'Advanced',
        lectures: 210,
        instructor: 'Zaid Sabih',
        bestseller: true,
        description: 'Learn Ethical Hacking from scratch and master advanced penetration testing techniques.'
    }
];

export const partners: Partner[] = [
    {
        name: 'AWS',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    },
    {
        name: 'Microsoft',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    },
    {
        name: 'Google Cloud',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
    },
    {
        name: 'Salesforce',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    },
    {
        name: 'Oracle',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
    },
];

export const trustedCompanies: string[] = [
    'Reliance Retail',
    'Infosys BPM',
    'HP Enterprise',
    'Tata Consultancy Services',
    'Wipro',
    'HCL Tech',
    'Accenture',
];

// Helper functions for course filtering
export const getTrendingCourses = (): Course[] => {
    const trendingTags = ['Trending', 'Hot', 'Popular', 'Best Seller'];
    return courses.filter(course =>
        trendingTags.some(tag => course.tag.includes(tag))
    ).slice(0, 12);
};

export const getRecommendedCourses = (): Course[] => {
    const recommendedTags = ['Essential', 'Foundation', 'Career', 'Strategic'];
    return courses.filter(course =>
        recommendedTags.some(tag => course.tag.includes(tag))
    ).slice(0, 8);
};

export const getTopRatedCourses = (): Course[] => {
    return courses.filter(course =>
        course.rating >= 4.7
    ).slice(0, 12);
};

export const getNewCourses = (): Course[] => {
    const newTags = ['New', 'Cutting Edge', 'Future'];
    // Or just pick the last few
    return courses.slice(-5);
};

export const getCoursesByCategory = (category: string): Course[] => {
    if (category === 'All Courses') return courses;
    return courses.filter(course => course.category === category);
};

export const getCategoryCount = (category: string): number => {
    return getCoursesByCategory(category).length;
};

// Compatibility export
export type ExtendedCourse = Course;

export const getExtendedCourses = (): Course[] => {
    return courses;
};

export interface CurriculumItem {
    id: number;
    title: string;
    duration: string;
    videoUrl?: string; // Mock URL
    preview: boolean;
}

export interface CurriculumSection {
    id: number;
    title: string;
    items: CurriculumItem[];
}

export interface Review {
    id: number;
    user: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
}

export interface CourseDetail extends Course {
    subtitle?: string;
    longDescription: string;
    learningPoints: string[];
    requirements: string[];
    curriculum: CurriculumSection[];
    updatedAt: string;
    language: string;
    captions: string[];
    reviewsList: Review[];
}

export const getCourseDetail = (id: string | number): CourseDetail | null => {
    const course = courses.find(c => c.id === id || c.id.toString() === id.toString());
    if (!course) return null;

    // Hardcoded rich details for a better experience
    return {
        ...course,
        updatedAt: "November 2025",
        language: "English",
        captions: ["English [Auto]", "Spanish", "French"],
        longDescription: `
            <p className="text-lg text-gray-700 leading-relaxed mb-6"><strong>Master ${course.title} and propel your career forward!</strong></p>
            <p className="text-gray-700 leading-relaxed mb-4">This comprehensive course is designed for ${course.level}s. You will start with the fundamentals and gradually move to advanced concepts, ensuring a deep understanding of the subject matter.</p>
            <p className="text-gray-700 leading-relaxed mb-4"><strong>What makes this course unique?</strong></p>
            <p className="text-gray-700 leading-relaxed mb-6">Unlike other courses, we focus on practical, real-world application. You won't just learn the theory; you'll build tangible projects that you can showcase in your portfolio.</p>
            <p className="text-gray-700 leading-relaxed">Join ${course.enrolled} other students who have already started their journey with us.</p>
        `,
        learningPoints: [
            `Master the core concepts of ${course.category}`,
            "Build real-world projects from scratch",
            "Understand best practices and industry standards",
            "Debug and troubleshoot common issues",
            "Prepare for technical interviews",
            "Automate repetitive tasks"
        ],
        requirements: [
            "No prior experience needed - we will teach you everything from scratch",
            "A computer with internet access",
            "A passion for learning!"
        ],
        curriculum: [
            {
                id: 1,
                title: "Introduction",
                items: [
                    { id: 101, title: "Welcome to the Course", duration: "05:20", preview: true },
                    { id: 102, title: "Setting up your environment", duration: "12:15", preview: true },
                    { id: 103, title: "Course Overview", duration: "08:30", preview: false }
                ]
            },
            {
                id: 2,
                title: "Core Concepts",
                items: [
                    { id: 201, title: "Understanding the Basics", duration: "15:45", preview: false },
                    { id: 202, title: "Deep Dive into Syntax", duration: "20:10", preview: false },
                    { id: 203, title: "First Practical Exercise", duration: "25:00", preview: false }
                ]
            },
            {
                id: 3,
                title: "Advanced Topics",
                items: [
                    { id: 301, title: "Performance Optimization", duration: "18:20", preview: false },
                    { id: 302, title: "Security Best Practices", duration: "14:50", preview: false }
                ]
            }
        ],
        reviewsList: [
            {
                id: 1,
                user: "Alex Thompson",
                avatar: "",
                rating: 5,
                date: "2 weeks ago",
                comment: "This course changed my career. The instructor is fantastic and explains everything clearly."
            },
            {
                id: 2,
                user: "Maria Rodriguez",
                avatar: "",
                rating: 4.5,
                date: "1 month ago",
                comment: "Great content, very detailed. I assume some prior knowledge would help, but still manageable for beginners."
            },
            {
                id: 3,
                user: "John Chen",
                avatar: "",
                rating: 5,
                date: "3 weeks ago",
                comment: "Best investment I've made for my education this year. Highly recommended!"
            }
        ]
    };
};

export interface EnrolledCourse extends Course {
    progress: number;
    lastAccessed: string;
}

export const getUserCourses = (): EnrolledCourse[] => {
    // Mock enrolled courses - select random 3 from existing
    const all = courses;
    return all.slice(0, 3).map(course => ({
        ...course,
        progress: Math.floor(Math.random() * 100),
        lastAccessed: '2 days ago'
    }));
};
