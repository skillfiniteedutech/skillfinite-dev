const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com';
};

/**
 * Add course to wishlist
 */
export const addToWishlist = async (courseId: string): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/wishlist/add/${courseId}`, {
            method: 'POST',
            headers: headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add to wishlist');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
};

/**
 * Remove course from wishlist
 */
export const removeFromWishlist = async (courseId: string): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/wishlist/remove/${courseId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to remove from wishlist');
        }

        return await response.json();
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
};

/**
 * Get user's wishlist
 */
export const getWishlist = async (): Promise<any[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // Return empty array when not authenticated
            return [];
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/wishlist`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            return []; // Return empty on error
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return []; // Return empty on error
    }
};

/**
 * Check if course is in wishlist
 */
export const checkWishlist = async (courseId: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/wishlist/check/${courseId}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.data.isInWishlist;
    } catch (error) {
        console.error('Error checking wishlist:', error);
        return false;
    }
};
