# Database Setup Instructions

## Setting up Supabase Database

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Name your project (e.g., "nexscholar")
6. Set a strong database password
7. Choose a region closest to your users
8. Click "Create new project"

### 2. Get Your Project Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **Project API Key** (`anon public` key)

### 3. Update Environment Variables

Create or update your `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Migrations

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" to create all tables and policies
5. Copy and paste the contents of `supabase/migrations/002_sample_data.sql`
6. Click "Run" to populate with sample scholarship data

### 5. Verify Setup

1. Go to Table Editor in your Supabase dashboard
2. You should see the following tables:
   - `users`
   - `scholarships`
   - `applications`
   - `saved_scholarships`
   - `mentorship_sessions`
   - `consultation_bookings`

### 6. Test Authentication

1. Start your Next.js application: `npm run dev`
2. Navigate to `/auth/register` and create a test account
3. After registration, you should be redirected and a user profile should be automatically created

## Database Schema Overview

### Tables

- **users**: User profiles with academic information
- **scholarships**: Available scholarship opportunities
- **applications**: User scholarship applications
- **saved_scholarships**: User bookmarked scholarships
- **mentorship_sessions**: Scheduled mentoring sessions
- **consultation_bookings**: Consultation appointments

### Key Features

- **Row Level Security (RLS)**: All tables have proper security policies
- **Automatic Timestamps**: `created_at` and `updated_at` fields are automatically managed
- **UUID Primary Keys**: All tables use UUID for better security and distribution
- **Foreign Key Relationships**: Proper relationships between all related tables

## Troubleshooting

### Common Issues

1. **404 Errors when fetching user profiles**:

   - Make sure you've run the initial schema migration
   - Check that your environment variables are correct
   - Verify that the `users` table exists in your Supabase dashboard

2. **Permission Denied Errors**:

   - Ensure RLS policies are set up correctly
   - Check that users are properly authenticated
   - Verify that the policies match your user access patterns

3. **Connection Issues**:
   - Double-check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Make sure there are no extra spaces or quotes in your `.env.local` file
   - Restart your development server after updating environment variables

### Getting Help

If you encounter issues:

1. Check the Supabase logs in your dashboard
2. Look at the browser console for detailed error messages
3. Verify your database schema matches the migration files
4. Ensure your RLS policies are correctly configured
