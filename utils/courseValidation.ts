// Frontend validation utilities for course data

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

// Course categories
export const COURSE_CATEGORIES = [
    'Student-Focused Learning',
    'Career-Focused Tracks',
    'Professional & Enterprise Upskilling',
    'AWS Aligned Programs',
    'Microsoft Aligned Programs',
    'Tamil-Language Learning',
    'Emerging Tech & Deep Tech',
    'Security & Compliance',
    'AI & Machine Learning'
] as const;

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] as const;
export const COURSE_LANGUAGES = ['English', 'Tamil', 'Hindi', 'Spanish', 'French'] as const;

// Validation functions
export const validateCourseTitle = (title: string): ValidationError | null => {
    if (!title || title.trim().length === 0) {
        return { field: 'title', message: 'Course title is required' };
    }
    if (title.length < 5) {
        return { field: 'title', message: 'Course title must be at least 5 characters long' };
    }
    if (title.length > 200) {
        return { field: 'title', message: 'Course title cannot exceed 200 characters' };
    }
    return null;
};

export const validateCourseDescription = (description: string): ValidationError | null => {
    if (!description || description.trim().length === 0) {
        return { field: 'description', message: 'Course description is required' };
    }
    if (description.length < 20) {
        return { field: 'description', message: 'Description must be at least 20 characters long' };
    }
    if (description.length > 5000) {
        return { field: 'description', message: 'Description cannot exceed 5000 characters' };
    }
    return null;
};

export const validateCourseCategory = (category: string): ValidationError | null => {
    if (!category) {
        return { field: 'category', message: 'Course category is required' };
    }
    if (!COURSE_CATEGORIES.includes(category as any)) {
        return { field: 'category', message: 'Invalid category selected' };
    }
    return null;
};

export const validateCourseLevel = (level: string): ValidationError | null => {
    if (!level) {
        return { field: 'level', message: 'Course level is required' };
    }
    if (!COURSE_LEVELS.includes(level as any)) {
        return { field: 'level', message: 'Invalid level selected' };
    }
    return null;
};

export const validatePrice = (price: number, type: 'free' | 'paid'): ValidationError | null => {
    if (type === 'paid') {
        if (price <= 0) {
            return { field: 'price', message: 'Price must be greater than 0 for paid courses' };
        }
        if (price > 1000000) {
            return { field: 'price', message: 'Price cannot exceed 1,000,000' };
        }
    } else {
        if (price !== 0) {
            return { field: 'price', message: 'Free courses must have price set to 0' };
        }
    }
    return null;
};

export const validateTags = (tags: string[]): ValidationError | null => {
    if (tags.length > 10) {
        return { field: 'tags', message: 'Maximum 10 tags allowed' };
    }
    for (const tag of tags) {
        if (tag.length > 50) {
            return { field: 'tags', message: 'Each tag cannot exceed 50 characters' };
        }
    }
    return null;
};

// Comprehensive course validation
export const validateCourseData = (courseData: {
    title: string;
    description: string;
    category: string;
    level: string;
    price?: number;
    pricingType?: 'free' | 'paid';
    tags?: string[];
}): ValidationResult => {
    const errors: ValidationError[] = [];

    // Validate title
    const titleError = validateCourseTitle(courseData.title);
    if (titleError) errors.push(titleError);

    // Validate description
    const descError = validateCourseDescription(courseData.description);
    if (descError) errors.push(descError);

    // Validate category
    const categoryError = validateCourseCategory(courseData.category);
    if (categoryError) errors.push(categoryError);

    // Validate level
    const levelError = validateCourseLevel(courseData.level);
    if (levelError) errors.push(levelError);

    // Validate price if provided
    if (courseData.price !== undefined && courseData.pricingType) {
        const priceError = validatePrice(courseData.price, courseData.pricingType);
        if (priceError) errors.push(priceError);
    }

    // Validate tags if provided
    if (courseData.tags) {
        const tagsError = validateTags(courseData.tags);
        if (tagsError) errors.push(tagsError);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Format validation errors for display
export const formatValidationErrors = (errors: ValidationError[]): string => {
    return errors.map(err => err.message).join('. ');
};

// Check if course data is complete
export const isCourseDataComplete = (courseData: any): boolean => {
    return !!(
        courseData.title &&
        courseData.description &&
        courseData.category &&
        courseData.level
    );
};
