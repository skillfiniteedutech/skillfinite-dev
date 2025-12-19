// Quick test script to check authentication status
// Run this in your browser console on the checkout page

console.log('=== Authentication Debug ===');

// 1. Check if token exists
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
if (token) {
    console.log('Token (first 20 chars):', token.substring(0, 20) + '...');

    // 2. Decode JWT to see user info (without verification)
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        console.log('Decoded token:', decoded);
        console.log('User ID:', decoded.id);
        console.log('User role:', decoded.role);
        console.log('Token expires:', new Date(decoded.exp * 1000));
    } catch (e) {
        console.error('Failed to decode token:', e);
    }
}

// 3. Test API call to check authentication
async function testAuth() {
    const baseUrl = 'https://skillfinite-backend-47sd.onrender.com';

    try {
        const response = await fetch(`${baseUrl}/api/enrollment/student/courses`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('API Response Status:', response.status);
        const data = await response.json();
        console.log('API Response:', data);

        if (response.status === 403) {
            console.error('❌ 403 Forbidden - Possible causes:');
            console.error('  1. User role mismatch');
            console.error('  2. OTP verification required');
            console.error('  3. Account not activated');
        }
    } catch (error) {
        console.error('API Error:', error);
    }
}

if (token) {
    testAuth();
} else {
    console.error('❌ No token found - you need to log in first!');
    console.log('Redirect to login page...');
}
