# 🚀 Deployment Guide - Liguns Entertain

Panduan lengkap untuk deploy Liguns Entertain ke berbagai platform.

## 🎯 Vercel (Recommended)

Vercel adalah pilihan terbaik untuk deploy Next.js app dengan CI/CD otomatis.

### Setup dengan GitHub

1. **Push code ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Klik "Add New Project"
   - Import repository dari GitHub
   - Vercel akan otomatis mendeteksi Next.js

3. **Setup Environment Variables**
   
   Tambahkan di Vercel Dashboard → Settings → Environment Variables:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_GA_ID=your_google_analytics_id
   NEXT_PUBLIC_ADSENSE_ID=your_adsense_id
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Klik "Deploy"
   - Tunggu beberapa menit
   - Website Anda live! 🎉

### Custom Domain

1. Di Vercel Dashboard → Settings → Domains
2. Tambahkan domain custom Anda
3. Update DNS records di registrar domain:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. Tunggu propagasi DNS (5-60 menit)

### Automatic Deployments

Setiap push ke branch `main` akan otomatis trigger deployment baru:

```bash
git add .
git commit -m "Update feature"
git push origin main
# ✅ Auto deployed to production!
```

## 🐳 Docker (Alternative)

### Build Docker Image

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine AS base

   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Build & Run**
   ```bash
   docker build -t liguns-entertain .
   docker run -p 3000:3000 liguns-entertain
   ```

## 🌐 Netlify

1. **Connect Repository**
   - Login ke [netlify.com](https://netlify.com)
   - New site from Git
   - Choose repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   Same as Vercel setup above

## 📱 Mobile App (PWA)

Website sudah PWA-ready! Users dapat install sebagai app:

### iOS
1. Buka website di Safari
2. Tap Share button
3. "Add to Home Screen"

### Android
1. Buka website di Chrome
2. Tap menu (⋮)
3. "Install app"

## 🔒 SSL/HTTPS

Vercel menyediakan SSL gratis otomatis. Untuk custom domain, SSL akan otomatis di-setup.

## 📊 Monitoring

### Vercel Analytics
- Sudah included gratis
- View di Vercel Dashboard → Analytics

### Google Analytics
Sudah terintegrasi jika `NEXT_PUBLIC_GA_ID` di-set.

### Error Monitoring (Optional)

Tambahkan Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## ⚡ Performance Optimization

### Before Deploy Checklist

- [ ] Compress images
- [ ] Enable caching headers
- [ ] Minify CSS/JS (otomatis by Next.js)
- [ ] Use CDN for static assets
- [ ] Enable gzip compression
- [ ] Optimize fonts loading

### Vercel Edge Config

Gunakan edge functions untuk response lebih cepat:

```javascript
export const config = {
  runtime: 'edge',
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

`.github/workflows/test.yml`:
```yaml
name: Test & Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

## 🌍 Multi-Region Deployment

Vercel otomatis deploy ke multiple regions untuk latency rendah global.

## 📈 Scaling

### Database (Supabase)
- Mulai dengan Free Tier
- Upgrade ke Pro saat traffic meningkat
- Monitor connection pooling

### CDN
- Vercel Edge Network otomatis
- Untuk static assets, consider Cloudflare

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local`
   - Use Vercel Environment Variables

2. **API Routes**
   - Validate input
   - Use rate limiting
   - Implement CORS properly

3. **Supabase RLS**
   - Always enable RLS
   - Test policies thoroughly

4. **HTTPS Only**
   - Force HTTPS redirect
   - Use secure cookies

## 🎉 Post-Deployment

1. **Test Everything**
   - All pages load
   - Forms submit correctly
   - Authentication works
   - Images display

2. **SEO Setup**
   - Submit sitemap to Google
   - Verify Google Search Console
   - Setup Google Analytics

3. **Monitoring**
   - Setup uptime monitoring
   - Check error logs
   - Monitor performance

## 📞 Support

Jika ada issues, check:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**Happy Deploying! 🚀**
