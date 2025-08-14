# 🚀 Events System Database Setup Instructions

## Step 1: Access Your Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **nexscholar** project
3. Click on **SQL Editor** in the left sidebar

## Step 2: Run the Events Database Schema

1. In the SQL Editor, create a new query
2. Copy and paste the entire contents of `src/lib/events-schema.sql` into the query editor
3. Click **Run** to execute the script

### What this will create:
- ✅ **events** table - Store event information
- ✅ **event_registrations** table - Track user registrations  
- ✅ **event_feedback** table - Store event feedback
- ✅ **event_resources** table - Manage event materials
- ✅ **Row Level Security (RLS)** policies for data protection
- ✅ **Sample data** for testing
- ✅ **Storage bucket** for event images

## Step 3: Verify Setup

After running the SQL script, you should see:
- 4 new tables in your Database → Tables section
- Sample events in the events table
- Storage bucket named "events" in Storage section

## Step 4: Test the Events System

Once the database is set up, you can test:

```bash
npm run dev
```

Then visit:
- **Events Page**: http://localhost:3000/events
- **Create Event**: http://localhost:3000/events/create  
- **My Events**: http://localhost:3000/events/my-events

## Step 5: Generate Updated Types (Optional)

If you want TypeScript to recognize the new tables:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

## 🎯 Ready to Go!

After completing these steps, your events system will be fully functional with:
- Event creation and management
- User registration system
- Event filtering and search
- Responsive design
- Complete CRUD operations

## 🔧 Troubleshooting

**If you see TypeScript errors about missing tables:**
- Make sure you've run the SQL schema in Supabase
- Check that all 4 tables appear in your Database → Tables section
- Restart your development server: `npm run dev`

**If events don't load:**
- Check the browser console for errors
- Verify your Supabase connection in `src/lib/supabase.ts`
- Ensure RLS policies allow reading published events
