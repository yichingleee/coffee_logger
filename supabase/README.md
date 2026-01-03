# Supabase Database Setup

This guide will help you complete the database setup for the Coffee Brew Tracker.

## ✅ Completed Steps

1. ✅ Created Supabase project
2. ✅ Added environment variables to `.env.local`

## 📋 Next Steps

### 1. Run the SQL Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **+ New Query**
5. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
6. Paste it into the SQL Editor
7. Click **Run** to execute the migration

This will:
- Create all necessary tables (`profiles`, `grinders`, `beans`, `logs`)
- Enable Row Level Security (RLS) on all tables
- Set up RLS policies so users can only access their own data
- Create a trigger to automatically create a profile when a user signs up
- Add database indexes for better performance

### 2. Verify the Setup

After running the migration, verify it worked:

1. In your Supabase Dashboard, go to **Table Editor**
2. You should see 4 new tables:
   - `profiles`
   - `grinders`
   - `beans`
   - `logs`

### 3. Files Created

The following files have been created for Phase 2:

- **`src/lib/supabase/client.ts`** - Supabase client for browser/client components
- **`src/lib/supabase/server.ts`** - Supabase client for server components
- **`src/lib/supabase/middleware.ts`** - Session management helper
- **`middleware.ts`** - Next.js middleware for route protection
- **`src/types/database.types.ts`** - TypeScript types for database schema
- **`supabase/migrations/001_initial_schema.sql`** - Database schema migration

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only read/write their own data
- No user can access another user's data
- Database-level security (not just application-level)

### Protected Routes
The middleware automatically protects these routes:
- `/dashboard`
- `/logs`
- `/pantry`
- `/grinders`

Users will be redirected to `/login` if they try to access these routes without being authenticated.

## 📚 How to Use

### Client Components (Browser)
```typescript
import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createClient()
  
  // Use supabase client
  const { data } = await supabase.from('beans').select()
}
```

### Server Components
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function MyServerComponent() {
  const supabase = await createClient()
  
  // Use supabase client
  const { data } = await supabase.from('beans').select()
}
```

### Route Handlers (API Routes)
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.from('beans').select()
  return NextResponse.json(data)
}
```

## 🎯 What's Next?

After completing the SQL migration, you'll be ready for:

**Phase 3: Authentication & Security**
- Configure OAuth providers (Google, Apple)
- Create login/signup pages
- Set up authentication flows

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs)
