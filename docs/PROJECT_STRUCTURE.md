# 📋 Project Structure

Struktur lengkap project Liguns Entertain untuk memudahkan navigasi dan development.

## 📁 Directory Structure

```
web-liguns/
├── 📁 .git/                    # Git repository
├── 📁 docs/                    # Documentation
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── SUPABASE_SETUP.md      # Database setup
│   └── PROJECT_STRUCTURE.md   # This file
├── 📁 public/                  # Static assets
│   ├── manifest.json          # PWA manifest
│   ├── favicon.ico            # Favicon
│   └── robots.txt             # SEO robots
├── 📁 src/                     # Source code
│   ├── 📁 app/                # Next.js App Router
│   │   ├── 📁 (auth)/         # Auth routes group (future)
│   │   │   ├── 📁 login/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   └── 📁 register/
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── 📁 dashboard/      # Dashboard routes (future)
│   │   │   ├── 📁 admin/      # Admin panel
│   │   │   └── 📁 member/     # Member dashboard
│   │   ├── 📁 lowongan/       # Job listings
│ │   │   ├── 📁 [id]/         # Dynamic job detail
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── 📁 components/         # React components
│   │   ├── 📁 layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── 📁 ui/             # Reusable UI components (future)
│   │   └── 📁 dashboard/      # Dashboard components (future)
│   ├── 📁 lib/                # Utilities & helpers
│   │   ├── supabase.ts        # Supabase client & types
│   │   └── utils.ts           # Helper functions (future)
│   └── 📁 hooks/              # Custom React hooks (future)
├── .env.local.example         # Environment variables template
├── .gitignore                 # Git ignore rules
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS config
├── README.md                  # Main documentation
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## 📄 Key Files Explained

### Configuration Files

#### `next.config.ts`
- Next.js app configuration
- Image optimization settings
- Supabase domains whitelist

####  `tailwind.config.ts`
- Premium design system
- Custom colors, gradients
- Animations & keyframes
- Utility classes

#### `tsconfig.json`
- TypeScript compiler options
- Path aliases (@/*)
- Strict type checking

### Application Files

#### `src/app/layout.tsx` (Root Layout)
- Global HTML structure
- SEO metadata
- Font loading
- Analytics integration
- AdSense setup

#### `src/app/page.tsx` (Homepage)
- Hero section
- Statistics
- Job categories
- Features showcase
- Call to action

#### `src/app/globals.css`
- Tailwind directives
- Custom utilities
- Glassmorphism effects
- Premium components
- Responsive styles

### Components

#### `src/components/layout/Navbar.tsx`
- Sticky navigation
- Mobile menu
- Scroll effects
- Authentication buttons

#### `src/components/layout/Footer.tsx`
- Company info
- Quick links
- Social media
- Contact information

### Library & Utilities

#### `src/lib/supabase.ts`
- Supabase client initialization
- TypeScript interfaces
- Database types
- Helper functions

## 🎨 Design System

### Color Palette
```typescript
primary: {
  50-950: Purple shades
}
luxury: {
  gold: #D4AF37
  silver: #C0C0C0
  bronze: #CD7F32
  platinum: #E5E4E2
}
```

### Gradients
- `gradient-luxury`: Purple gradient
- `gradient-premium`: Pink gradient
- `gradient-dark`: Dark multi-layer

### Component Classes
- `glass-card`: Glassmorphism effect
- `btn-primary`: Primary button
- `btn-secondary`: Secondary button
- `input-premium`: Premium input
- `card-premium`: Premium card

## 📱 Routes

### Public Routes
```
/                    Homepage
/lowongan            Job listings
/lowongan/[id]       Job detail
/login               Login page
/register            Registration
/tentang             About us
/layanan             Services
/toko                Online store
```

### Protected Routes (Future)
```
/dashboard/member    Member dashboard
/dashboard/admin     Admin panel
/profile             User profile
/applications        My applications
```

## 🗄️ Database Tables

1. **profiles** - User profiles
2. **jobs** - Job listings
3. **applications** - Job applications
4. **attendance** - Employee attendance
5. **salaries** - Salary records
6. **loans** - Employee loans
7. **rewards** - User rewards

See `docs/SUPABASE_SETUP.md` for schema details.

## 🔐 Authentication Flow

```
1. User registers → Supabase Auth
2. Profile created → profiles table
3. Email verification (optional)
4. Login → JWT token
5. Access dashboard based on role
```

## 📦 Dependencies

### Core
- **next**: ^16.1.1 - React framework
- **react**: ^19.2.3 - UI library
- **typescript**: ^5.9.3 - Type safety

### Styling
- **tailwindcss**: ^4.1.18 - Utility CSS
- **framer-motion**: ^12.24.8 - Animations

### Backend
- **@supabase/supabase-js**: ^2.90.0 - Database & auth
- **@supabase/auth-helpers-nextjs**: ^0.15.0 - Auth helpers

### UI & Icons
- **lucide-react**: ^0.562.0 - Icons

## 🚀 Development Workflow

1. **Local Development**
   ```bash
   npm run dev     # Start dev server
   ```

2. **Build**
   ```bash
   npm run build   # Production build
   ```

3. **Deployment**
   ```bash
   git push origin main  # Auto-deploy to Vercel
   ```

## 📈 Future Additions

### Phase 2
- [ ] Job detail page
- [ ] Member dashboard
- [ ] Profile management
- [ ] Application system

### Phase 3
- [ ] Admin dashboard
- [ ] CRUD operations
- [ ] Attendance system
- [ ] Salary calculator

### Phase 4
- [ ] Real-time notifications
- [ ] Chat system
- [ ] Advanced analytics
- [ ] Export functionality

## 🔧 Maintenance

### Update Dependencies
```bash
npm update              # Update all
npm outdated            # Check outdated
```

### Database Migrations
```bash
# See docs/SUPABASE_SETUP.md
```

### Code Quality
```bash
npm run lint            # ESLint check
npm run type-check      # TypeScript check
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

**Last Updated**: 2026-01-07
