# Foliage E-commerce Platform

A modern, full-stack e-commerce application built with Next.js 15, TypeScript, Tailwind CSS, and Prisma ORM.

## 🌿 Features

### Storefront
- Modern, responsive product catalog
- Product filtering and search
- Shopping cart functionality
- User authentication
- Order management
- Hero section with featured products

### Admin Dashboard
- Product management (CRUD operations)
- Category management
- Order tracking and management
- Analytics and statistics
- Inventory management

## 🛠 Tech Stack

- **Frontend**: Next.js 15+, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js App Router, API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Prisma Adapter
- **UI Components**: Custom Shadcn/ui-inspired components
- **Icons**: Lucide React
- **Media**: Uploadcare for image management
- **Styling**: Tailwind CSS with custom theme

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (or Supabase account)
- Uploadcare account (for image uploads)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create/update `.env.local`:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY="your-uploadcare-key"
```

### 3. Set Up Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see your app!

## 📁 Project Structure

```
app/
  ├── (storefront)/    # Public pages
  ├── admin/          # Admin dashboard
  ├── api/            # API routes
  └── layout.tsx      # Root layout

components/
  ├── ui/             # Base components
  ├── shared/         # Navbar, Footer
  ├── storefront/     # Product components
  └── admin/          # Admin components

lib/
  ├── prisma.ts       # Prisma singleton
  ├── auth.ts         # NextAuth config
  └── utils.ts        # Utilities

prisma/
  └── schema.prisma   # Database schema
```

## 🔐 Database Models

- **User**: Customer and admin accounts
- **Category**: Product categories
- **Product**: Product listings with inventory
- **Order**: Customer orders
- **OrderItem**: Items in orders

## 📝 Available Scripts

```bash
npm run dev                    # Start dev server
npm run build                 # Build for production
npm start                     # Start production server
npm run lint                  # Run linter
npm run prisma:generate       # Generate Prisma client
npm run prisma:migrate        # Run database migrations
npm run prisma:studio         # Open Prisma Studio
```

## 🔐 Authentication

- Credentials-based authentication
- NextAuth.js with database sessions
- Protected admin routes (to be implemented)
- User roles (customer/admin)

## 🎨 Customization

### Images & Background
To add product images and a site background image, put the files in `public/images/`:

- `public/images/hydroponic-bg.jpg` — optional background image used when you enable the CSS block in `app/globals.css`.
- `public/images/spinach.jpg`, `public/images/basil.jpg`, `public/images/lettuce.jpg` — product images (optional).

If you don't add product images, the site will use small SVG placeholders included in `public/images/sample-plant-1.svg`, `sample-plant-2.svg`, and `sample-plant-3.svg`.

Recommended sizes: 1400–2000px wide for hero/background images, and ~800px wide for product photos. To add the global background, place `hydroponic-bg.jpg` in `public/images/` and then open `app/globals.css` and uncomment the `body { background-image: ... }` block.

I also added a small "reveal on scroll" animation (see `components/ui/Reveal.tsx`) and native smooth scrolling (`html { scroll-behavior: smooth; }`) to give the site a more fluid, flowing feel.


### Colors
Edit `tailwind.config.js` to customize the color scheme:
- Primary: Sage Green
- Secondary: Cream
- Dark: Neutral

### Components
All UI components are in `components/ui/` and fully customizable with Tailwind CSS.

## 📚 Documentation

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions and troubleshooting.

## 📜 License

This project is open-source. All dependencies are open-source or have free tiers.

## 🚀 Deployment

Ready to deploy on:
- Vercel (recommended)
- AWS
- Heroku
- Any Node.js hosting

## 💡 Next Steps

1. Implement product creation/editing forms
2. Add shopping cart functionality
3. Integrate payment processing
4. Set up email notifications
5. Add user reviews and ratings
6. Implement search functionality

---

**Built with ❤️ for sustainable e-commerce**
