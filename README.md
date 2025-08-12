# 🎯 Roastume - Resume Feedback Platform

## 🚀 Overview

Roastume is a modern web application that allows users to share their resumes and receive constructive feedback ("roasts") from the community. Built with a unique comic-book inspired design, it makes the traditionally stressful process of resume feedback fun and engaging.

## ✨ Key Features

### 🔐 **Authentication & User Management**

- Google OAuth integration via NextAuth.js
- Automatic profile creation and management
- Secure session handling with JWT

### 📄 **Resume Management**

- Upload resumes (images & PDFs up to 10MB)
- Full CRUD operations (Create, Read, Update, Delete)
- File storage with Supabase Storage
- Owner-only edit/delete permissions

### 💬 **Advanced Comment System**

- Nested comment replies with threading
- Upvote/downvote system for comments
- Edit and delete own comments
- Three-dot menu for comment management
- Real-time comment counts

### 👤 **User Profiles**

- Personal dashboard with user's resumes
- Resume statistics (likes, comments)
- Profile management and settings

### 📱 **Responsive Design**

- Mobile-first approach with responsive breakpoints
- Touch-friendly interface
- Hamburger menu for mobile navigation
- Comic book aesthetic with bold borders and shadows

## 🛠️ Technology Stack

### **Frontend**

- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript 5** - Type safety and developer experience
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **shadcn/ui** - Component library (New York style)
- **Radix UI** - Headless UI primitives for accessibility

### **Backend & Database**

- **Supabase** - PostgreSQL database with real-time features
- **NextAuth.js** - Authentication system
- **Row Level Security (RLS)** - Database-level security

### **State Management**

- **Custom React Context** - Modular state management
- **Optimistic Updates** - Immediate UI feedback
- **localStorage** - Client-side persistence

## 🏗️ Project Structure

```
roastume/
├── app/                     # Next.js App Router
│   ├── (roastume)/         # Main app routes
│   │   ├── profile/        # User profile page
│   │   ├── resume/[id]/    # Individual resume view
│   │   └── upload/         # Resume upload page
│   └── api/                # API routes
│       ├── auth/           # NextAuth.js
│       ├── comments/       # Comment management
│       ├── resumes/        # Resume CRUD
│       └── upload/         # File upload
├── components/             # Reusable React components
│   ├── ui/                 # shadcn/ui components
│   ├── enhanced-comment.tsx # Advanced comment system
│   ├── my-resume-card.tsx  # Owner resume controls
│   └── navbar.tsx          # Responsive navigation
├── lib/                    # Utility libraries
│   ├── store/              # Modular state management
│   ├── api.ts              # API client functions
│   └── auth.ts             # Authentication config
└── supabase-schema.sql     # Database schema
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project
- Google OAuth credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/roastume.git
   cd roastume
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Set up the database**

   ```bash
   # Run the SQL schema in your Supabase dashboard
   # File: supabase-schema.sql
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses a normalized PostgreSQL schema with the following tables:

- **profiles** - User profile information
- **resumes** - Resume metadata and files
- **comments** - Comments with reply threading
- **comment_votes** - Upvote/downvote tracking
- **likes** - Resume like tracking

All tables include Row Level Security (RLS) policies for data protection.

## 🎨 Design System

Roastume features a unique comic-book inspired design with:

- **Bold Borders** - 3-5px thick borders throughout
- **Drop Shadows** - Consistent shadow patterns for depth
- **Vibrant Colors** - Carefully chosen color palette
- **Typography** - Bangers (display) and Kalam (body) fonts
- **Hover Effects** - Translate and scale animations
- **Responsive Layout** - Mobile-first approach

## 🔧 API Routes

### Authentication

- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Resumes

- `GET/POST /api/resumes` - List/create resumes
- `GET/PUT/DELETE /api/resumes/[id]` - Individual resume operations
- `GET /api/resumes/my` - User's own resumes
- `POST /api/resumes/[id]/comments` - Add comments

### Comments

- `GET/PUT/DELETE /api/comments/[id]` - Comment CRUD operations
- `POST /api/comments/[id]/vote` - Vote on comments
- `GET/POST /api/comments/[id]/replies` - Comment replies

### File Upload

- `POST /api/upload` - File upload handling

## 🚀 Deployment

The application is deployed on Vercel and can be accessed at:
**[https://vercel.com/harishs-projects-883913b8/v0-roastume-website-ui](https://vercel.com/harishs-projects-883913b8/v0-roastume-website-ui)**

### Deploy Your Own

1. Fork this repository
2. Connect to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## 📞 Support

If you have any questions or need help, please open an issue or contact the maintainers.

---

**Made with ❤️ and lots of ☕ by the Roastume team**
