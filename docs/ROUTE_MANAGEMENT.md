# Route Management Guide

## Overview

This guide explains how to use the centralized route management system to ensure consistent, type-safe navigation across the Next.js application.

## The Problem

In Next.js, using incorrect route paths can cause issues that work in development but fail in production:

```typescript
// ❌ WRONG - This works in dev but breaks in production on Vercel
router.push('/course/' + courseId);  // Should be /courses/ (plural)
router.push('/courses/[id]');         // Literal [id] gets URL-encoded to %5Bid%5D
```

**Why it breaks in production:**
- Development server is forgiving and may auto-correct routes
- Production builds enforce strict route matching
- Invalid characters like `[` and `]` get percent-encoded: `%5B` and `%5D`
- Results in navigation to broken URLs like `@%5Bid%5D`

## The Solution

Use the centralized route helpers from `lib/routes.ts`:

```typescript
import { ROUTES, buildRoute } from '@/lib/routes';

// ✅ CORRECT - Type-safe and guaranteed to work
router.push(buildRoute.course(courseId));
```

---

## Usage Examples

### Static Routes

For simple pages without parameters:

```typescript
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

function MyComponent() {
  const router = useRouter();

  // Navigate to courses list
  const goToCourses = () => router.push(ROUTES.COURSES);

  // Navigate to profile
  const goToProfile = () => router.push(ROUTES.PROFILE);

  // Navigate to login
  const goToLogin = () => router.push(ROUTES.LOGIN);
}
```

**With Next.js Link:**

```tsx
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

function Navigation() {
  return (
    <nav>
      <Link href={ROUTES.HOME}>Home</Link>
      <Link href={ROUTES.COURSES}>Courses</Link>
      <Link href={ROUTES.MY_COURSES}>My Learning</Link>
      <Link href={ROUTES.CART}>Cart</Link>
    </nav>
  );
}
```

---

### Dynamic Routes

For pages that require parameters:

```typescript
import { useRouter } from 'next/navigation';
import { buildRoute } from '@/lib/routes';

function CourseCard({ courseId }: { courseId: string }) {
  const router = useRouter();

  // Navigate to course detail page
  const viewCourse = () => {
    router.push(buildRoute.course(courseId));
  };

  // Navigate to course learning page
  const startLearning = () => {
    router.push(buildRoute.courseLearn(courseId));
  };

  return (
    <div>
      <button onClick={viewCourse}>View Details</button>
      <button onClick={startLearning}>Start Learning</button>
    </div>
  );
}
```

**With Next.js Link:**

```tsx
import Link from 'next/link';
import { buildRoute } from '@/lib/routes';

function CourseCard({ courseId }: { courseId: string }) {
  return (
    <div>
      <Link href={buildRoute.course(courseId)}>
        View Course Details
      </Link>
      
      <Link href={buildRoute.courseLearn(courseId)}>
        Start Learning
      </Link>
    </div>
  );
}
```

---

### Routes with Query Parameters

For pages with search or filter parameters:

```typescript
import { buildRoute, addQueryParams, ROUTES } from '@/lib/routes';

// Simple search
const searchRoute = buildRoute.coursesSearch('react');
// Result: '/courses?search=react'

// Category filter
const categoryRoute = buildRoute.coursesByCategory('Web Development');
// Result: '/courses?category=Web%20Development'

// Complex query params
const complexRoute = addQueryParams(ROUTES.COURSES, {
  search: 'javascript',
  level: 'beginner',
  price: 'free'
});
// Result: '/courses?search=javascript&level=beginner&price=free'
```

---

### Payment Success Redirect

Example from `payment-button.tsx`:

```typescript
import { buildRoute } from '@/lib/routes';

const handlePaymentSuccess = () => {
  toast({
    title: "Payment Successful! 🎉",
    description: `You've successfully purchased ${courseTitle}`,
  });
  
  onPaymentSuccess?._();
  
  // Redirect to course page
  router.push(buildRoute.course(courseId));
};
```

---

### Conditional Navigation

Based on enrollment status:

```typescript
import { ROUTES, buildRoute } from '@/lib/routes';

function CourseAction({ course, isEnrolled }) {
  const router = useRouter();

  const handleClick = () => {
    if (isEnrolled) {
      // Go to learning page
      router.push(buildRoute.courseLearn(course.id));
    } else if (course.price === 0) {
      // Enroll in free course
      enrollInCourse(course.id);
    } else {
      // Add to cart
      addToCart(course);
      router.push(ROUTES.CART);
    }
  };

  return <button onClick={handleClick}>
    {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
  </button>;
}
```

---

## API Routes

For backend API calls, use `buildApiRoute`:

```typescript
import { buildApiRoute } from '@/lib/routes';

async function checkEnrollment(courseId: string) {
  const response = await fetch(
    `${baseUrl}${buildApiRoute.enrollmentStatus(courseId)}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  
  return response.json();
}
```

**Note:** API routes may use different naming conventions (e.g., `/api/enrollment/course/${id}`) than frontend routes (`/courses/${id}`).

---

## Best Practices

### ✅ DO

1. **Always use route helpers:**
   ```typescript
   router.push(buildRoute.course(id));
   ```

2. **Import from centralized file:**
   ```typescript
   import { ROUTES, buildRoute } from '@/lib/routes';
   ```

3. **Use constants for static routes:**
   ```typescript
   <Link href={ROUTES.PROFILE}>Profile</Link>
   ```

4. **Let TypeScript help you:**
   ```typescript
   // TypeScript will autocomplete available routes
   ROUTES.
   buildRoute.
   ```

### ❌ DON'T

1. **Don't hardcode route strings:**
   ```typescript
   router.push('/courses');  // ❌ Use ROUTES.COURSES
   ```

2. **Don't concatenate route parts manually:**
   ```typescript
   router.push('/courses/' + id);  // ❌ Use buildRoute.course(id)
   ```

3. **Don't use literal dynamic segments:**
   ```typescript
   router.push('/courses/[id]');  // ❌ This will break in production
   ```

4. **Don't mix route styles:**
   ```typescript
   // ❌ Inconsistent
   router.push('/courses');
   router.push(ROUTES.PROFILE);
   
   // ✅ Consistent
   router.push(ROUTES.COURSES);
   router.push(ROUTES.PROFILE);
   ```

---

## Migration Guide

If you have existing code with hardcoded routes:

### Before
```typescript
function MyComponent() {
  router.push('/courses');
  router.push(`/courses/${courseId}`);
  router.push(`/courses/${courseId}/learn`);
}
```

### After
```typescript
import { ROUTES, buildRoute } from '@/lib/routes';

function MyComponent() {
  router.push(ROUTES.COURSES);
  router.push(buildRoute.course(courseId));
  router.push(buildRoute.courseLearn(courseId));
}
```

---

## Testing Routes

The route helpers include built-in validation:

```typescript
import { buildRoute, validateRoute } from '@/lib/routes';

// ✅ Valid - returns '/courses/abc-123'
buildRoute.course('abc-123');

// ❌ Throws error - empty courseId
buildRoute.course('');  // Error: courseId is required

// ❌ Throws error - contains literal segments
validateRoute('/courses/[id]');  // Error: contains literal dynamic segments
```

---

## Available Routes

### Static Routes (ROUTES)
- `HOME` - `/`
- `LOGIN` - `/login`
- `SIGNUP` - `/signup`
- `LOGOUT` - `/logout`
- `COURSES` - `/courses`
- `MY_COURSES` - `/mycourses`
- `CART` - `/cart`
- `WISHLIST` - `/wishlist`
- `PROFILE` - `/profile`
- `SETTINGS` - `/settings`
- `COMMUNITY` - `/community`
- `MESSAGES` - `/messages`
- `SCHEDULE` - `/schedule`

### Dynamic Route Builders (buildRoute)
- `course(id)` - `/courses/{id}`
- `courseLearn(id)` - `/courses/{id}/learn`
- `profileBilling()` - `/profile/billing`
- `coursesSearch(query)` - `/courses?search={query}`
- `coursesByCategory(category)` - `/courses?category={category}`

---

## Why This Matters

### Development vs Production

**Local Development (npm run dev):**
- Forgiving route matching
- Hot reload and fast refresh
- May silently fix minor mistakes

**Production (Vercel):**
- Strict route analysis at build time
- Pre-rendered static pages
- Invalid routes get percent-encoded
- Example: `/courses/[id]` → `@%5Bid%5D`

### Benefits of Centralized Routes

1. **Type Safety** - TypeScript catches typos at compile time
2. **Consistency** - Single source of truth for all routes
3. **Refactoring** - Change a route in one place, updates everywhere
4. **Autocomplete** - IDE suggests available routes
5. **Validation** - Runtime checks prevent invalid routes
6. **Documentation** - Self-documenting code

---

## Questions?

If you encounter routing issues:

1. Check if the route exists in `lib/routes.ts`
2. Verify you're using the correct builder function
3. Ensure the route path matches your `app/` directory structure
4. Test in both development and production builds

For new routes, add them to `lib/routes.ts` following the existing patterns.
