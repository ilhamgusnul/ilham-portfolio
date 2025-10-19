# Backend API Documentation

## Overview
Backend untuk portfolio menggunakan **Vercel Serverless Functions**, **Neon PostgreSQL**, dan **Drizzle ORM**.

## Tech Stack
- **Runtime**: Vercel Serverless Functions (Node.js)
- **Database**: Neon PostgreSQL (serverless, auto-scaling)
- **ORM**: Drizzle ORM
- **Authentication**: Simple Bearer Token (upgrade to JWT in production)
- **Email**: Resend

## Database Schema

### Tables

#### `users`
- `id` (serial, primary key)
- `email` (varchar, unique)
- `password` (text) - TODO: Hash dengan bcrypt
- `name` (varchar)
- `created_at` (timestamp)

#### `projects`
- `id` (serial, primary key)
- `title` (varchar)
- `description` (text)
- `tech_stack` (text array)
- `category` (varchar) - 'web', 'mobile', 'design'
- `image_url` (text, nullable)
- `demo_url` (text, nullable)
- `github_url` (text, nullable)
- `completed_date` (varchar, nullable)
- `order` (integer, default 0)
- `is_visible` (boolean, default true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `skills`
- `id` (serial, primary key)
- `title` (varchar)
- `proficiency` (integer) - 0-100
- `tools` (text array)
- `order` (integer, default 0)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `contact_messages`
- `id` (serial, primary key)
- `name` (varchar)
- `email` (varchar)
- `message` (text)
- `is_read` (boolean, default false)
- `created_at` (timestamp)

## API Endpoints

### Public APIs (No Auth Required)

#### GET `/api/public/projects`
Mendapatkan daftar projects yang visible.

**Query Parameters:**
- `category` (optional) - Filter by category: 'web', 'mobile', 'design', or 'all'

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "E-Commerce Platform",
      "description": "...",
      "techStack": ["Laravel", "React", "Tailwind"],
      "category": "web",
      "imageUrl": null,
      "demoUrl": null,
      "githubUrl": null,
      "completedDate": "December 2023",
      "order": 1,
      "isVisible": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/public/skills`
Mendapatkan daftar skills.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Full Stack Web Development",
      "proficiency": 95,
      "tools": ["Laravel", "React", "Tailwind"],
      "order": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/public/contact`
Submit contact form message.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I want to hire you!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "...",
    "isRead": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Authentication

#### POST `/api/auth/login`
Login untuk mendapatkan access token.

**Body:**
```json
{
  "email": "i.romadhon26@gmail.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "base64_encoded_token",
    "user": {
      "id": 1,
      "email": "i.romadhon26@gmail.com",
      "name": "Ilham Gusnul Romadhon"
    }
  }
}
```

### Admin APIs (Auth Required)

**Authentication Header:**
```
Authorization: Bearer <token>
```

#### GET `/api/admin/projects`
Get all projects (including hidden ones).

#### POST `/api/admin/projects`
Create new project.

**Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "techStack": ["React", "Node.js"],
  "category": "web",
  "imageUrl": "https://...",
  "demoUrl": "https://...",
  "githubUrl": "https://...",
  "completedDate": "January 2024",
  "order": 1,
  "isVisible": true
}
```

#### PUT `/api/admin/projects?id=1`
Update project by ID.

**Body:** (same as POST, all fields optional)

#### DELETE `/api/admin/projects?id=1`
Delete project by ID.

---

#### GET `/api/admin/skills`
Get all skills.

#### POST `/api/admin/skills`
Create new skill.

**Body:**
```json
{
  "title": "Backend Development",
  "proficiency": 90,
  "tools": ["Node.js", "Express", "PostgreSQL"],
  "order": 5
}
```

#### PUT `/api/admin/skills?id=1`
Update skill by ID.

#### DELETE `/api/admin/skills?id=1`
Delete skill by ID.

---

#### GET `/api/admin/messages`
Get all contact messages.

#### PUT `/api/admin/messages?id=1`
Mark message as read.

#### DELETE `/api/admin/messages?id=1`
Delete message.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create `.env` file (sudah ada di project):
```env
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
ADMIN_EMAIL=i.romadhon26@gmail.com
```

### 3. Setup Database
```bash
# Push schema to Neon Database
npm run db:push

# Seed initial data
npm run db:seed
```

### 4. Development
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
vercel
```

**Environment Variables di Vercel:**
- `DATABASE_URL` atau `POSTGRES_URL`
- `RESEND_API_KEY` (get from https://resend.com/api-keys)
- `ADMIN_EMAIL`

## Database Management

### Drizzle Studio
Buka database GUI:
```bash
npm run db:studio
```

### Generate Migrations
```bash
npm run db:generate
```

### Push Schema Changes
```bash
npm run db:push
```

## Security Notes

**IMPORTANT untuk Production:**

1. **Password Hashing**: Gunakan bcrypt untuk hash password
   ```typescript
   import bcrypt from 'bcryptjs';
   const hashedPassword = await bcrypt.hash(password, 10);
   const isValid = await bcrypt.compare(password, hashedPassword);
   ```

2. **JWT Tokens**: Ganti simple token dengan JWT
   ```bash
   npm install jsonwebtoken @types/jsonwebtoken
   ```

3. **Rate Limiting**: Tambahkan rate limiting untuk API endpoints

4. **CORS**: Configure proper CORS origins di production

5. **Input Validation**: Gunakan library seperti `zod` untuk validasi

## Email Configuration (Resend)

1. Sign up di https://resend.com
2. Get API key dari dashboard
3. Add domain (optional, untuk production)
4. Update `.env`:
   ```
   RESEND_API_KEY=re_your_key_here
   ```

## Testing APIs

### Using cURL

**Get Projects:**
```bash
curl https://your-domain.vercel.app/api/public/projects
```

**Login:**
```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"i.romadhon26@gmail.com","password":"admin123"}'
```

**Create Project (Admin):**
```bash
curl -X POST https://your-domain.vercel.app/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"New Project","description":"...","techStack":["React"],"category":"web"}'
```

## Next Steps

1. ✅ Backend API sudah siap
2. 🔄 Update frontend untuk consume API
3. 🔄 Build admin dashboard UI
4. 🔄 Deploy to Vercel
5. 🔄 Setup custom domain (optional)

## Support

Jika ada pertanyaan atau issue, silakan contact via email atau create issue di repository.
