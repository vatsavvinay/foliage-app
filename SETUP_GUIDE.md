# Foliage E-commerce Platform - Setup Guide

## 📋 Table of Contents
1. [Tech Stack Overview](#tech-stack-overview)
2. [Prerequisites](#prerequisites)
3. [Installation & Setup](#installation--setup)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [Project Structure](#project-structure)
8. [Open Source Compliance](#open-source-compliance)
9. [Troubleshooting](#troubleshooting)

---

## 🛠 Tech Stack Overview

### Frontend
- **Next.js 15+** - React framework with App Router for modern web applications
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Lucide Icons** - Beautiful, consistent icon library

### UI Components
- **Custom Shadcn/ui-inspired Components** - Built from scratch with Tailwind CSS
  - Button, Card, Input, Textarea, Badge components
  - Fully customizable and themable

### Backend & Database
- **Prisma ORM** - Type-safe database access layer
- **PostgreSQL** - Robust relational database
- **Supabase** - PostgreSQL hosting platform with pooled connections

### Authentication
- **NextAuth.js v4** - OAuth and Credentials authentication
- **Prisma Adapter** - Database-backed session management

### Media Management
- **Uploadcare** - Cloud-based image upload and optimization
- **Next.js Image Optimization** - Automatic image optimization and responsive serving

---

## ✅ Prerequisites

Before starting, ensure you have:

1. **Node.js** (v18.0 or higher)
   - Download from https://nodejs.org
   - Verify installation: `node --version`

2. **npm** or **yarn** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for version control)
   - Download from https://git-scm.com

4. **PostgreSQL Database**
   - Use Supabase (recommended for quick setup)
   - Sign up at https://supabase.com
   - Get your database connection string

5. **Uploadcare Account** (for image uploads)
   - Sign up at https://uploadcare.com
   - Get your public API key

6. **Code Editor**
   - VS Code (recommended) - https://code.visualstudio.com

---

## 📦 Installation & Setup

### Step 1: Clone the Repository

```bash
cd /Users/vinay.marrapu/foliage-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- NextAuth.js
- And all other dependencies

### Step 3: Install Tailwind CSS Animation Plugin (Optional)

If you want to use Tailwind's animation utilities, install the plugin:

```bash
npm install tailwindcss-animate
```

---

## 🗄 Database Setup

### Option 1: Supabase (Recommended)

1. **Create a Supabase Account**
   - Visit https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub or email

2. **Create a New Project**
   - Organization: Create new or select existing
   - Project Name: "foliage"
   - Database Password: Create a strong password
   - Region: Choose the closest to your users (e.g., us-west-2)
   - Click "Create new project"

3. **Get Your Connection String**
   - In Supabase dashboard, go to "Settings" → "Database"
   - Copy the "Connection string" (URI option)
   - Format: `postgresql://[user]:[password]@[host]:[port]/[database]`

4. **Enable Pooling (Important for Production)**
   - In Supabase Settings → Database → Connection Pooling
   - Enable pooling
   - Change pool mode to "Transaction" for better compatibility
   - Get the pooling connection string (usually uses port 6543)

### Option 2: Local PostgreSQL

1. **Install PostgreSQL**
   - macOS: `brew install postgresql`
   - Windows: Download installer from https://www.postgresql.org/download/windows/
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**
   ```bash
   createdb foliage
   ```

3. **Connection String**
   ```
   postgresql://postgres:[YOUR_PASSWORD]@localhost:5432/foliage
   ```

---

## 🔐 Environment Configuration

### Step 1: Update `.env.local` File

The file is already created at the root. Update it with your actual values:

```env
# Database (use your Supabase or local PostgreSQL connection string)
DATABASE_URL="postgresql://postgres.nelpvxzsfqakohbahbza:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-min-32-chars-recommended"
NEXTAUTH_URL="http://localhost:3000"

# Uploadcare
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY="your-uploadcare-public-key"
```

### Step 2: Generate NextAuth Secret

Generate a secure random string for `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Or use an online tool: https://generate-secret.vercel.app

### Step 3: Get Uploadcare Public Key

1. Sign up at https://uploadcare.com
2. Create a new project
3. Go to Settings → API Keys
4. Copy your "Public Key"
5. Add it to `.env.local`

---

## 🚀 Running the Application

### Step 1: Generate Prisma Client

```bash
npm run prisma:generate
```

This generates type-safe Prisma client based on your schema.

### Step 2: Run Database Migrations

```bash
npm run prisma:migrate
```

This will:
1. Create tables based on your schema
2. Create initial database structure
3. Generate migration files in `prisma/migrations/`

**Note:** First migration requires a migration name. Enter something like "init" when prompted.

### Step 3: Seed the Database (Optional)

Create a `prisma/seed.ts` file to add sample data:

```typescript
import { prisma } from '@/lib/prisma';

async function main() {
  // Create sample categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Eco-Friendly Electronics',
      slug: 'eco-electronics',
      description: 'Sustainable electronic products',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
```

Then run:
```bash
npx prisma db seed
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at:
- Storefront: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin
- Prisma Studio: http://localhost:5555 (when running `npm run prisma:studio`)

### Step 5: Open in Browser

- Navigate to http://localhost:3000
- You should see the Foliage home page with the Hero section

---

## 📁 Project Structure

```
foliage-app/
├── app/
│   ├── (storefront)/           # Public facing pages
│   │   ├── page.tsx            # Home page
│   │   └── products/
│   │       └── page.tsx        # Products listing
│   ├── admin/                  # Protected admin area
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── page.tsx            # Dashboard
│   │   ├── products/           # Product management
│   │   ├── categories/         # Category management
│   │   └── orders/             # Order management
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth endpoints
│   │   ├── products/           # Product API routes
│   │   └── orders/             # Order API routes
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts
│   ├── shared/                 # Shared components
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── Footer.tsx          # Footer
│   │   └── Hero.tsx            # Hero section
│   ├── storefront/             # Storefront components
│   │   ├── ProductCard.tsx
│   │   └── ProductFilters.tsx
│   └── admin/                  # Admin components
│       ├── DataTable.tsx
│       └── Table.tsx
├── lib/
│   ├── prisma.ts              # Prisma singleton client
│   ├── auth.ts                # NextAuth configuration
│   └── utils.ts               # Utility functions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration history
├── public/                     # Static assets
├── .env.local                 # Environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
└── SETUP_GUIDE.md             # This file
```

---

## 📜 Open Source Compliance

All technologies used in this project are **open-source** and freely available:

### Core Technologies
| Technology | License | Opensource | URL |
|-----------|---------|-----------|-----|
| **Next.js** | MIT | ✅ Yes | https://github.com/vercel/next.js |
| **React** | MIT | ✅ Yes | https://github.com/facebook/react |
| **TypeScript** | Apache 2.0 | ✅ Yes | https://github.com/microsoft/TypeScript |
| **Tailwind CSS** | MIT | ✅ Yes | https://github.com/tailwindlabs/tailwindcss |
| **Prisma** | Apache 2.0 | ✅ Yes | https://github.com/prisma/prisma |
| **NextAuth.js** | ISC | ✅ Yes | https://github.com/nextauthjs/next-auth |
| **PostgreSQL** | PostgreSQL License | ✅ Yes | https://www.postgresql.org |
| **Lucide Icons** | ISC | ✅ Yes | https://github.com/lucide-icons/lucide |

### Proprietary Services (Optional)
| Service | Type | Free Tier | Alternative |
|---------|------|----------|-------------|
| **Supabase** | Database Hosting | ✅ Yes (500MB) | Self-hosted PostgreSQL |
| **Uploadcare** | Image Hosting | ✅ Yes (160GB/month) | Self-hosted MinIO or Cloudinary |
| **Vercel** | Hosting | ✅ Yes | Self-hosted or Netlify |

### ✅ You Can Use This Stack Commercially
- All core technologies are open-source
- You own your data and code
- No vendor lock-in for database or deployment
- Free to use and modify for commercial purposes

---

## 🔧 Common Commands

```bash
# Development
npm run dev                    # Start development server

# Build & Production
npm run build                  # Build for production
npm start                      # Start production server

# Database
npm run prisma:generate       # Generate Prisma client
npm run prisma:migrate        # Run migrations
npm run prisma:studio         # Open Prisma Studio (GUI)

# Linting
npm run lint                  # Run ESLint

# Other
npm install                   # Install dependencies
npm uninstall <package>       # Remove a package
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npm install @prisma/client
npm run prisma:generate
```

### Issue: "Database connection refused"

**Check:**
1. Database is running and accessible
2. `DATABASE_URL` in `.env.local` is correct
3. Password doesn't have special characters (escape if needed)
4. For Supabase, ensure you're using the pooling connection string with port 6543

**Fix:**
```bash
# Test connection with Prisma
npx prisma db push

# Or reset database (careful!)
npx prisma migrate reset
```

### Issue: "NextAuth secret not configured"

**Solution:**
```bash
# Generate new secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET="your-generated-secret-here"
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Run on different port
npm run dev -- -p 3001
```

### Issue: Images not loading from Uploadcare

**Check:**
1. `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY` is set in `.env.local`
2. Public key is correct (copy from Uploadcare dashboard)
3. Image URLs are from `ucarecdn.com` domain
4. Check browser console for CORS errors

---

## 📚 Next Steps

After setup, you can:

1. **Create Admin Account**
   - Add initial admin user to database using Prisma Studio
   - Or create an API endpoint for admin signup

2. **Implement Product Management**
   - Create forms for adding/editing products
   - Integrate Uploadcare for product images
   - Build product listing with filters

3. **Set Up Cart & Checkout**
   - Implement shopping cart logic (client-side or server)
   - Create checkout flow
   - Integrate payment gateway (Stripe, PayPal)

4. **Deploy to Production**
   - Deploy to Vercel (recommended for Next.js)
   - Deploy to AWS, Heroku, or self-hosted
   - Use Supabase for database
   - Use Uploadcare for media

5. **Customize Branding**
   - Update colors in `tailwind.config.js`
   - Update favicon and metadata
   - Customize font families
   - Add custom logo

---

## 📞 Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

## 📝 License

This project structure and setup is provided as-is for your e-commerce application.

---

**Happy Coding! 🚀**

For any questions or issues, refer to the documentation links above or check the project's GitHub issues.
