# 🌟 Liguns Entertainment - Premium Talent Agency Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1+-38B2AC?style=for-the-badge&logo=tailwind-css)

**A luxury, professional platform for nightlife talent management with integrated HRIS**

[Quick Start](#-quick-start) • [Documentation](#-documentation) • [Features](#-features) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About

**Liguns Entertainment** is a premium talent agency platform designed for the nightlife industry (Karaoke/Spa) in Indonesia. It combines:

- 🌐 **Public Landing Page** - Showcase jobs and attract talent
- 👔 **Admin Dashboard** - Full HRIS with payroll calculator
- 👤 **Talent Dashboard** - Personal wallet, rankings, internal store

### Design Philosophy

- **Luxury Dark Mode**: Deep matte charcoal (#0a0a0a) with metallic gold (#D4AF37) accents
- **Glassmorphism**: Premium backdrop-blur effects throughout
- **Professional Typography**: Inter (sans-serif) + Playfair Display (serif)
- **Privacy First**: Phone numbers and addresses hidden from public

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Basic knowledge of Next.js and React

### Setup in 5 Minutes

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Setup database (see docs/SUPABASE_SETUP.md)
# - Create Supabase project
# - Run supabase/schema.sql in SQL Editor

# 4. Start development server
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

**Need detailed help?** → Read [`docs/QUICK_START.md`](docs/QUICK_START.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[QUICK_START.md](docs/QUICK_START.md)** | Get started in minutes |
| **[SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** | Database setup guide |
| **[IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md)** | Complete feature specs |
| **[PROJECT_STATUS.md](docs/PROJECT_STATUS.md)** | Current progress report |
| **[PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** | Directory layout |

---

## ✨ Features

### ✅ Completed (Phase 1: Foundation)

#### Database & Backend
- [x] 8-table PostgreSQL schema with RLS
- [x] Row Level Security policies
- [x] Automated triggers and functions
- [x] TypeScript type definitions
- [x] 20+ Supabase helper functions

#### Design System
- [x] Luxury dark mode theme
- [x] Premium glassmorphism effects
- [x] Custom component classes
- [x] Responsive utilities
- [x] 11 Shadcn UI components

#### Infrastructure
- [x] Next.js 14 with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS v4 setup
- [x] Font optimization (Inter + Playfair)
- [x] SEO metadata

### 🔄 In Progress (Phase 2: Public Frontend)

- [ ] Hero section component
- [ ] Job card component
- [ ] Job listing page
- [ ] Job detail page
- [ ] Application form

### ⏳ Planned

**Phase 3: Admin Dashboard**
- Talent management table
- Payroll calculator
- Attendance system
- Performance tracking

**Phase 4: Talent Dashboard**
- Salary wallet
- Performance rankings
- Internal store
- Purchase history

**Phase 5: Polish**
- Email notifications
- PDF exports
- Real-time updates
- Mobile app (future)

---

## 🛠️ Tech Stack

### Core
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.9+
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 4.1+

### UI Components
- **Component Library**: Shadcn UI
- **Icons**: Lucide React
- **Animations**: Framer Motion 12+

### Development
- **Package Manager**: npm
- **Deployment**: Vercel (recommended)
- **Version Control**: Git

---

## 📁 Project Structure

```
web-liguns/
├── docs/                      # Documentation
│   ├── QUICK_START.md        # Get started guide
│   ├── SUPABASE_SETUP.md     # Database setup
│   └── ...
├── public/                    # Static assets
├── src/
│   ├── app/                  # Next.js pages
│   │   ├── layout.tsx        # Root layout (dark mode)
│   │   ├── page.tsx          # Homepage
│   │   ├── jobs/[id]/        # Job detail pages
│   │   └── ...
│   ├── components/           # React components
│   │   ├── layout/           # Navbar, Footer
│   │   └── ui/               # Shadcn components
│   └── lib/                  # Utilities
│       ├── supabase.ts       # DB client & helpers
│       └── database.types.ts # TypeScript types
├── supabase/
│   └── schema.sql            # Database schema
├── .env.local.example        # Environment template
└── package.json
```

---

## 🎨 Design System

### Colors

```tsx
/* Primary Colors */
--background: #0a0a0a;     /* Deep Matte Charcoal */
--card: #121212;            /* Card background */
--primary: #D4AF37;         /* Metallic Gold */
--foreground: #fafafa;      /* Off-white text */

/* Component Colors */
--border: rgba(255, 255, 255, 0.1);  /* Subtle borders */
--input: rgba(255, 255, 255, 0.15);  /* Input backgrounds */
```

### Typography

```tsx
/* Headings */
font-family: 'Playfair Display', serif;
weights: 400, 500, 600, 700, 800, 900

/* Body */
font-family: 'Inter', sans-serif;
weights: 300, 400, 500, 600, 700, 800, 900
```

### Components

```tsx
.glass-card          // Glassmorphism card
.btn-primary         // Gold gradient button
.input-premium       // Glass input
.badge-gold          // Gold badge
.heading-primary     // Large gold heading
```

---

## 🗄️ Database Schema

### Tables

1. **profiles** - User profiles (admin, talent, user)
2. **jobs** - Job listings
3. **job_applications** - Application tracking
4. **attendance** - Daily attendance
5. **financial_records** - Payroll transactions
6. **gamification** - Performance rankings
7. **store_items** - Internal store products
8. **store_purchases** - Purchase history

### Key Features

- **Row Level Security**: Privacy enforced at DB level
- **Automated Triggers**: Updated timestamps
- **RPC Functions**: Salary calculations
- **JSONB Fields**: Flexible data storage

**Full schema**: [`supabase/schema.sql`](supabase/schema.sql)

---

## 🔐 Security & Privacy

### Privacy Rules

✅ **Public users CANNOT see**:
- Phone numbers
- Addresses
- Salary details
- Personal info beyond name & photo

✅ **Only Admins can see**:
- Full talent profiles
- Financial records
- Performance scores
- Contact information

### Security Measures

- Row Level Security (RLS) on all tables
- JWT-based authentication (Supabase)
- Environment variables for secrets
- HTTPS only in production
- Input validation & sanitization

---

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # ESLint check
```

### Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

See `.env.local.example` for full list.

---

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

**Auto-deployment**: Every push to `main` branch

### Manual Build

```bash
npm run build
npm run start
```

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Make changes
3. Test locally
4. Commit with clear message
5. Push and create PR

### Code Style

- Use TypeScript strict mode
- Follow component naming: `PascalCase.tsx`
- Use Tailwind classes (avoid inline styles)
- Document complex logic
- Write semantic HTML

---

## 📊 Project Status

**Phase 1**: ✅ Complete (Database, Design System, Infrastructure)  
**Phase 2**: 🔄 In Progress (Public Frontend)  
**Phase 3**: ⏳ Planned (Admin Dashboard)  
**Phase 4**: ⏳ Planned (Talent Dashboard)  
**Phase 5**: ⏳ Planned (Polish & Features)

See [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) for detailed progress.

---

## 📝 License

This is a proprietary project for **Liguns Entertainment**.  
All rights reserved © 2026 Liguns Entertainment.

---

## 🆘 Support

Need help? Check:

1. [`docs/QUICK_START.md`](docs/QUICK_START.md) - Getting started
2. [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) - Database issues
3. [`docs/IMPLEMENTATION_SUMMARY.md`](docs/IMPLEMENTATION_SUMMARY.md) - Feature specs

---

## 🎯 Roadmap

### Q1 2026
- [x] Phase 1: Foundation ✅
- [ ] Phase 2: Public Frontend
- [ ] Phase 3: Admin Dashboard

### Q2 2026
- [ ] Phase 4: Talent Dashboard
- [ ] Phase 5: Polish & Testing
- [ ] Production Launch

### Q3 2026
- [ ] Mobile App (React Native)
- [ ] Advanced Analytics
- [ ] Multi-language Support

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, Supabase & Tailwind CSS**

⭐ Star this repo if you find it useful!

</div>
