# NexScholar - Scholarship Management Platform

A comprehensive scholarship management platform built with Next.js 15, Supabase, and TypeScript.
To be deployed

## 🚀 Features

- **User Authentication**: Secure login/register with Supabase Auth
- **Profile Management**: Complete user profiles with academic information
- **Scholarship Discovery**: Browse and search scholarships with advanced filtering
- **Application Tracking**: Manage scholarship applications and deadlines
- **Expert Consultations**: Book consultation sessions with scholarship experts
- **Document Management**: Upload and organize scholarship documents
- **Dashboard**: Personalized dashboard with stats and recommendations

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/nexscholar.git
   cd nexscholar
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up Supabase Database**

   - Create a new Supabase project
   - Run the SQL script in `src/lib/database-schema.sql` in your Supabase SQL Editor
   - This will create all necessary tables, policies, and sample data

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

The application uses the following main tables:

- `users` - User profiles and authentication data
- `scholarships` - Scholarship listings and details
- `applications` - Scholarship applications by users
- `saved_scholarships` - User bookmarked scholarships
- `consultation_bookings` - Expert consultation appointments
- `documents` - User uploaded documents

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- User data isolation through authentication policies
- Secure file upload with user-specific storage buckets
- Environment variables for sensitive configuration

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables for Production**
   In your Vercel dashboard, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
   ```

## 📱 Pages

- `/` - Landing page with platform overview
- `/auth/login` - User login
- `/auth/register` - User registration
- `/dashboard` - User dashboard with stats and recommendations
- `/profile` - User profile management
- `/scholarships` - Scholarship browsing and search
- `/consult` - Expert consultation booking
- `/documents` - Document upload and management

## 🎨 Styling

The application uses Tailwind CSS with a custom color scheme:

- Primary: Blue (#2563EB)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please create an issue in the GitHub repository or contact the development team.
