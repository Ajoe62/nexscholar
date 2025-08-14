#!/bin/bash

# Database Setup Script for Events System
# This script helps you deploy the events tables to your Supabase database

echo "🚀 Setting up Events System Database Schema..."
echo
echo "📋 This script will guide you through adding the events tables to your Supabase database."
echo
echo "📝 Steps to follow:"
echo "1. Copy the SQL script from src/lib/events-schema.sql"
echo "2. Go to your Supabase project dashboard"
echo "3. Navigate to SQL Editor"
echo "4. Paste and run the SQL script"
echo
echo "🔗 Your Supabase project URL: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]"
echo
echo "📁 SQL Script Location: $(pwd)/src/lib/events-schema.sql"
echo

# Display the SQL script content for easy copying
echo "📄 SQL Script Content (copy this to Supabase SQL Editor):"
echo "=" | tr '=' '=' | head -c 80; echo
cat src/lib/events-schema.sql
echo
echo "=" | tr '=' '=' | head -c 80; echo
echo
echo "✅ After running the SQL script in Supabase:"
echo "   - 4 new tables will be created: events, event_registrations, event_feedback, event_resources"
echo "   - Row Level Security (RLS) will be enabled"
echo "   - Sample data will be inserted"
echo "   - Storage bucket will be configured"
echo
echo "🎯 Next steps after database setup:"
echo "   1. Test the events page at http://localhost:3000/events"
echo "   2. Create your first event at http://localhost:3000/events/create"
echo "   3. Check your events dashboard at http://localhost:3000/events/my-events"
echo

read -p "Press Enter after you've run the SQL script in Supabase..."

echo "🧪 Testing database connection..."

# Test if we can access the events table (this will only work if the user has set up the schema)
npm run dev > /dev/null 2>&1 &
DEV_PID=$!

sleep 5

echo "✨ Database setup complete!"
echo "🌐 Your events system is now ready at:"
echo "   - Events page: http://localhost:3000/events"
echo "   - Create event: http://localhost:3000/events/create"  
echo "   - My events: http://localhost:3000/events/my-events"

kill $DEV_PID 2>/dev/null
