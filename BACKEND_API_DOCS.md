# 🚀 Roastume Backend API Documentation

## Overview

This document describes the REST API endpoints for the Roastume application built with Next.js and Supabase.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most endpoints require authentication via NextAuth.js session. Include session cookies in requests.

---

## 📄 **Resume Endpoints**

### GET /api/resumes

Fetch all resumes with user profiles.

**Response:**

```json
{
  "resumes": [
    {
      "id": "uuid",
      "name": "JOHN DOE",
      "blurb": "Software engineer with 5 years experience",
      "likes": 15,
      "comments": [],
      "fileUrl": "https://supabase.co/storage/v1/object/public/resumes/file.pdf",
      "fileType": "pdf",
      "ownerId": "uuid",
      "createdAt": 1704067200000,
      "avatar": "https://avatar-url.com/avatar.jpg"
    }
  ]
}
```

### POST /api/resumes

Create a new resume.

**Authentication:** Required

**Request Body:**

```json
{
  "name": "John Doe",
  "blurb": "Software engineer with 5 years experience",
  "fileUrl": "https://supabase.co/storage/v1/object/public/resumes/file.pdf",
  "fileType": "pdf"
}
```

**Response:**

```json
{
  "resume": {
    "id": "uuid",
    "name": "JOHN DOE",
    "blurb": "Software engineer with 5 years experience",
    "likes": 0,
    "comments": [],
    "fileUrl": "https://supabase.co/storage/v1/object/public/resumes/file.pdf",
    "fileType": "pdf",
    "ownerId": "uuid",
    "createdAt": 1704067200000,
    "avatar": "https://avatar-url.com/avatar.jpg"
  }
}
```

### GET /api/resumes/[id]

Get a single resume with comments.

**Response:**

```json
{
  "resume": {
    "id": "uuid",
    "name": "JOHN DOE",
    "blurb": "Software engineer with 5 years experience",
    "likes": 15,
    "comments": [
      {
        "id": "uuid",
        "author": "Jane Smith",
        "avatar": "https://avatar-url.com/jane.jpg",
        "text": "Great experience section!",
        "createdAt": 1704067200000
      }
    ],
    "fileUrl": "https://supabase.co/storage/v1/object/public/resumes/file.pdf",
    "fileType": "pdf",
    "ownerId": "uuid",
    "createdAt": 1704067200000,
    "avatar": "https://avatar-url.com/avatar.jpg"
  }
}
```

---

## 👍 **Like Endpoints**

### POST /api/resumes/[id]/like

Toggle like on a resume.

**Authentication:** Required

**Response:**

```json
{
  "liked": true,
  "likesCount": 16
}
```

---

## 💬 **Comment Endpoints**

### POST /api/resumes/[id]/comments

Add a comment to a resume.

**Authentication:** Required

**Request Body:**

```json
{
  "text": "Great resume! Love the design."
}
```

**Response:**

```json
{
  "comment": {
    "id": "uuid",
    "author": "Jane Smith",
    "avatar": "https://avatar-url.com/jane.jpg",
    "text": "Great resume! Love the design.",
    "createdAt": 1704067200000
  }
}
```

---

## 📁 **File Upload Endpoints**

### POST /api/upload

Upload a resume file to Supabase Storage.

**Authentication:** Required

**Request:** Multipart form data with `file` field

**File Restrictions:**

- Types: JPEG, PNG, WebP, PDF
- Max size: 5MB

**Response:**

```json
{
  "fileUrl": "https://supabase.co/storage/v1/object/public/resumes/user-id/timestamp.pdf",
  "fileType": "pdf",
  "fileName": "resume.pdf"
}
```

---

## 👤 **Profile Endpoints**

### GET /api/profiles

Get current user profile.

**Authentication:** Required

**Response:**

```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": "https://avatar-url.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/profiles

Update current user profile.

**Authentication:** Required

**Request Body:**

```json
{
  "name": "John Smith",
  "avatar_url": "https://new-avatar-url.com/avatar.jpg"
}
```

**Response:**

```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Smith",
    "avatar_url": "https://new-avatar-url.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

---

## 🗄️ **Database Schema**

### Tables

#### profiles

- `id` (UUID, Primary Key) - References auth.users(id)
- `email` (TEXT, Unique, Not Null)
- `name` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### resumes

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to profiles.id)
- `name` (TEXT, Not Null)
- `blurb` (TEXT)
- `file_url` (TEXT)
- `file_type` (TEXT) - 'image' or 'pdf'
- `likes_count` (INTEGER, Default 0)
- `comments_count` (INTEGER, Default 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### comments

- `id` (UUID, Primary Key)
- `resume_id` (UUID, Foreign Key to resumes.id)
- `user_id` (UUID, Foreign Key to profiles.id)
- `text` (TEXT, Not Null)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### likes

- `id` (UUID, Primary Key)
- `resume_id` (UUID, Foreign Key to resumes.id)
- `user_id` (UUID, Foreign Key to profiles.id)
- `created_at` (TIMESTAMP)
- Unique constraint on (resume_id, user_id)

---

## 🔒 **Security Features**

### Row Level Security (RLS)

- All tables have RLS enabled
- Users can only modify their own data
- Public read access for resumes and comments
- Authenticated users can create comments and likes

### File Storage Security

- Users can only upload to their own folder
- File type and size validation
- Public read access for resume files

### Authentication

- NextAuth.js integration with Google OAuth
- Automatic profile creation on signup
- Session-based authentication for API endpoints

---

## 🚀 **Setup Instructions**

1. **Create Supabase Project:**

   ```bash
   # Visit https://supabase.com and create a new project
   ```

2. **Run Database Schema:**

   ```sql
   -- Copy and run the SQL from supabase/schema.sql in your Supabase SQL editor
   ```

3. **Update Environment Variables:**

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Test API Endpoints:**

   ```bash
   # Start development server
   pnpm dev

   # Test endpoints with curl or Postman
   curl http://localhost:3001/api/resumes
   ```

---

## 📊 **Error Handling**

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔄 **Data Flow**

1. **User Authentication:** NextAuth.js → Supabase profiles
2. **File Upload:** Client → API → Supabase Storage
3. **Resume Creation:** Client → API → Supabase Database
4. **Real-time Updates:** Supabase Realtime (optional)

This API provides a complete backend solution for the Roastume application with authentication, file storage, and data management.
