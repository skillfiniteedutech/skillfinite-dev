# Protected Routes System

This document explains how to use the protected routes system implemented in your Next.js application.

## Overview

The protected routes system consists of several components that work together to secure your application:

1. **AuthContext** - Global authentication state management
2. **ProtectedRoute** - Component wrapper for protecting pages
3. **Middleware** - Server-side route protection
4. **useAuth** - Hook for accessing authentication state
5. **useAuthGuard** - Hook for easy authentication guards

## Quick Start

### 1. Protecting a Page Component

Wrap your page component with the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from '@/components/protected-route'

function MyProtectedPage() {
  return (
    <div>
      <h1>This is a protected page</h1>
      <p>Only authenticated users can see this content.</p>
    </div>
  )
}

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <MyProtectedPage />
    </ProtectedRoute>
  )
}
```

### 2. Using the Higher-Order Component

Alternatively, use the `withProtection` HOC:

```tsx
import { withProtection } from '@/components/protected-route'

function MyProtectedPage() {
  return (
    <div>
      <h1>This is a protected page</h1>
    </div>
  )
}

export default withProtection(MyProtectedPage)
```

### 3. Using Authentication Hooks

Access authentication state in your components:

```tsx
import { useAuth } from '@/components/auth-context'

function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## Components

### AuthContext

The `AuthContext` provides global authentication state and methods:

```tsx
import { useAuth } from '@/components/auth-context'

const { 
  user,           // Current user object
  token,          // Authentication token
  isLoading,      // Loading state
  isAuthenticated, // Boolean indicating if user is authenticated
  login,          // Function to log in
  logout,         // Function to log out
  checkAuth       // Function to check authentication status
} = useAuth()
```

### ProtectedRoute

The `ProtectedRoute` component automatically redirects unauthenticated users:

```tsx
<ProtectedRoute 
  redirectTo="/login"  // Where to redirect unauthenticated users
  fallback={<LoadingSpinner />}  // Custom loading component
>
  <YourProtectedContent />
</ProtectedRoute>
```

### useAuthGuard Hook

The `useAuthGuard` hook provides flexible authentication guards:

```tsx
import { useAuthGuard, useRequireAuth, useRequireGuest } from '@/hooks/use-auth-guard'

// Require authentication
function ProtectedComponent() {
  const { isAuthenticated, isLoading } = useRequireAuth('/login')
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null // Will redirect
  
  return <div>Protected content</div>
}

// Require guest access (for login/signup pages)
function LoginPage() {
  const { isAuthenticated, isLoading } = useRequireGuest()
  
  if (isLoading) return <div>Loading...</div>
  if (isAuthenticated) return null // Will redirect to dashboard
  
  return <LoginForm />
}

// Optional authentication
function OptionalComponent() {
  const { isAuthenticated, isLoading } = useOptionalAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {isAuthenticated ? (
        <div>Welcome back, user!</div>
      ) : (
        <div>Please log in for personalized content.</div>
      )}
    </div>
  )
}
```

## Middleware Configuration

The middleware automatically protects routes based on the configuration in `middleware.ts`:

```typescript
// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/courses',
  '/course',
  '/schedule',
  '/analytics',
  '/community',
  '/messages',
  '/notifications',
  '/settings',
  '/profile',
]

// Routes that are always public
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth-test',
  '/',
]
```

## Authentication Flow

1. **User visits protected route** → Middleware checks for auth token
2. **No token found** → Redirected to login page with `redirect` parameter
3. **User logs in** → AuthContext stores token and user data
4. **Login successful** → User redirected back to originally requested page
5. **Token expires** → User automatically logged out and redirected to login

## Best Practices

### 1. Always Use ProtectedRoute for Sensitive Content

```tsx
// ✅ Good
export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  )
}

// ❌ Bad - No protection
export default function AdminPage() {
  return <AdminContent />
}
```

### 2. Handle Loading States

```tsx
function MyComponent() {
  const { isLoading, isAuthenticated } = useAuth()
  
  if (isLoading) {
    return <div>Loading authentication...</div>
  }
  
  if (!isAuthenticated) {
    return <div>Please log in</div>
  }
  
  return <div>Authenticated content</div>
}
```

### 3. Use Appropriate Hooks

```tsx
// For pages that require authentication
const { isAuthenticated } = useRequireAuth('/login')

// For login/signup pages
const { isAuthenticated } = useRequireGuest()

// For components that work with or without auth
const { isAuthenticated } = useOptionalAuth()
```

### 4. Custom Redirect URLs

```tsx
// Redirect to specific page after login
<ProtectedRoute redirectTo="/login?redirect=/admin">
  <AdminContent />
</ProtectedRoute>

// Use in login page
const searchParams = useSearchParams()
const redirectTo = searchParams.get('redirect') || '/dashboard'
router.push(redirectTo)
```

## Error Handling

The system automatically handles common authentication errors:

- **Invalid tokens** → User logged out and redirected to login
- **Expired sessions** → Automatic logout
- **Network errors** → Graceful fallback to localStorage

## Testing

Test your protected routes by:

1. **Logged out state** → Visit protected route, should redirect to login
2. **Logged in state** → Visit login page, should redirect to dashboard
3. **Token expiration** → Wait for token to expire, should auto-logout
4. **Direct URL access** → Try accessing protected routes directly

## Troubleshooting

### Common Issues

1. **Infinite redirects** → Check middleware configuration
2. **Authentication state not persisting** → Verify cookie settings
3. **Protected routes not working** → Ensure AuthProvider wraps your app

### Debug Mode

Enable debug logging by checking the browser console for authentication-related messages.

## Security Notes

- Tokens are stored in httpOnly cookies for security
- localStorage is used as a fallback for client-side access
- Middleware provides server-side protection
- Client-side protection prevents unauthorized access during navigation
- Automatic logout on token expiration

## Migration Guide

If you're migrating from an existing authentication system:

1. Replace direct localStorage access with `useAuth()` hook
2. Wrap protected pages with `ProtectedRoute`
3. Update login/logout logic to use AuthContext methods
4. Test all protected routes to ensure they work correctly

## Support

For issues or questions about the protected routes system, check:

1. Browser console for error messages
2. Network tab for API call failures
3. Cookie storage for token issues
4. Middleware logs for server-side problems
