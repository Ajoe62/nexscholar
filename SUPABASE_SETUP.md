# Supabase Setup Guide for Nexscholar

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up for a free account
2. Click "New Project" and create a new project
3. Choose a name (e.g., "nexscholar") and set a secure database password
4. Wait for the project to be fully provisioned (usually takes 1-2 minutes)

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Project API Key** (anon/public key)

## 3. Configure Environment Variables

1. In your project root, copy `.env.local.example` to `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query and copy the contents of `supabase/schema.sql`
3. Click "Run" to execute the schema
4. Verify that all tables were created by checking the **Table Editor**

## 5. Populate with Sample Data (Optional)

1. In the SQL Editor, create another new query
2. Copy the contents of `supabase/sample_data.sql`
3. Click "Run" to insert sample scholarship data
4. Go to **Table Editor** → **scholarships** to see the data

## 6. Enable Row Level Security (RLS)

The schema already includes RLS policies, but verify they're enabled:

1. Go to **Authentication** → **Policies**
2. Ensure all tables have appropriate policies enabled
3. For public read access to scholarships, ensure the policy allows `SELECT` for all users

## 7. Configure Authentication (Optional for MVP)

1. Go to **Authentication** → **Settings**
2. Configure your preferred authentication providers
3. Set up email templates if using email authentication
4. Update the site URL to your domain (or `http://localhost:3000` for development)

## 8. Test the Connection

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/scholarships`
3. If everything is configured correctly, you should see:
   - The scholarships page loads without errors
   - Sample scholarship data appears (if you populated it)
   - Filtering and search functionality works

## 9. Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables configured in `.env.local`
- [ ] Database schema applied successfully
- [ ] Sample data inserted (optional)
- [ ] Scholarships page loads and displays data
- [ ] Search and filtering features work
- [ ] No console errors related to Supabase

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**

   - Double-check your `.env.local` file
   - Ensure you're using the anon/public key, not the service role key
   - Restart your development server after changing environment variables

2. **"Schema not found" error**

   - Make sure you ran the `schema.sql` file in the SQL Editor
   - Check that all tables exist in the Table Editor

3. **RLS blocking data access**

   - Verify that RLS policies allow public read access
   - Check the policies in **Authentication** → **Policies**

4. **Connection timeout**
   - Ensure your Supabase project is active (not paused)
   - Check your internet connection
   - Verify the project URL is correct

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the browser console for specific error messages
- Ensure all environment variables are set correctly

## Next Steps

Once Supabase is set up and working:

1. Test the scholarship filtering system
2. Implement user authentication
3. Add consultation booking functionality
4. Set up file storage for document uploads

Your Nexscholar MVP backend is now ready for development!
