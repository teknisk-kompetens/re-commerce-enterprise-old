
# 🚀 VERCEL DEPLOYMENT GUIDE - RE-COMMERCE ENTERPRISE

## 🎯 SNABB OVERVIEW
Detta är en komplett guide för att deploya re-commerce-enterprise på Vercel med custom domain re-commerce.se.

## 📋 FÖRE DEPLOYMENT - KRITISKA FIXES

### 1. FIX NEXT.CONFIG.JS (OBLIGATORISK)
```bash
# Ersätt innehållet i next.config.js med innehållet från next.config.js.vercel
cp next.config.js.vercel next.config.js
```

### 2. FIX ENVIRONMENT VARIABLES
```bash
# Skapa .env.production.local baserat på template
cp .env.production.template .env.production.local
# Uppdatera NEXTAUTH_URL till din faktiska domain
```

### 3. GENERERA PRISMA CLIENT
```bash
npx prisma generate
```

## 🌟 VERCEL DEPLOYMENT STEG

### STEG 1: SKAPA VERCEL KONTO
1. Gå till [vercel.com](https://vercel.com)
2. Registrera med GitHub/GitLab/Bitbucket
3. Gratis tier är perfekt för denna app

### STEG 2: CONNECT GITHUB REPO
1. Pusha din kod till GitHub repository
2. I Vercel dashboard: "New Project"
3. Välj din repository
4. Vercel detekterar automatiskt Next.js

### STEG 3: KONFIGURERA ENVIRONMENT VARIABLES
I Vercel dashboard under "Environment Variables":
```
DATABASE_URL = postgresql://role_14b5206a81:VWLB2XmTJFTm6Ip92lnNJ59GgtxZgtmh@db-14b5206a81.db001.hosteddb.reai.io:5432/14b5206a81
NEXTAUTH_URL = https://re-commerce.se
NEXTAUTH_SECRET = i0eG2js4M62ZnfjDVZsVkEZNhzMYTNYWhjzdi9ZcJxE=
```

### STEG 4: DEPLOY
1. Klicka "Deploy"
2. Vänta på build completion
3. Testa på generated Vercel URL först

## 🌐 CUSTOM DOMAIN SETUP (re-commerce.se)

### STEG 1: LÄGG TILL DOMAIN I VERCEL
1. Gå till ditt projekt i Vercel
2. "Settings" → "Domains"
3. Lägg till "re-commerce.se"
4. Lägg till "www.re-commerce.se"

### STEG 2: KONFIGURERA DNS
I din DNS provider (där du registrerade re-commerce.se):
```
# A Record
@ → 76.76.21.21

# CNAME Record
www → cname.vercel-dns.com
```

### STEG 3: VERIFIERA
1. Vänta 24-48 timmar för DNS propagation
2. Testa https://re-commerce.se
3. Testa https://www.re-commerce.se

## 🔧 TROUBLESHOOTING

### Problem: Build Fails
```bash
# Kör lokalt först
yarn install
npx prisma generate
yarn build
```

### Problem: 500 Error
- Kontrollera environment variables är korrekta
- Verifiera DATABASE_URL fungerar
- Kontrollera Vercel function logs

### Problem: Custom Domain fungerar inte
- Kontrollera DNS settings
- Vänta på DNS propagation
- Använd DNS checker tools

## ✅ SUCCESS CHECKLIST

- [ ] next.config.js fixad
- [ ] Environment variables konfigurerade
- [ ] Prisma client genererad
- [ ] Projekt bygger lokalt
- [ ] Vercel deployment successful
- [ ] Test på Vercel URL fungerar
- [ ] Custom domain konfigurerad
- [ ] DNS propagation klar
- [ ] https://re-commerce.se fungerar
- [ ] Alla sidor laddar utan 502 errors

## 🎉 EFTER DEPLOYMENT

### Testa Kritiska Funktioner:
1. Startsida laddar
2. Login/signup fungerar
3. Dashboard fungerar
4. API endpoints svarar
5. Databas connectivity OK

### Performance Optimering:
- Vercel Analytics automatiskt aktivt
- CDN automatiskt konfigurerat
- HTTPS automatiskt aktivt
- Gzip compression aktivt

## 📞 SUPPORT

Om du får 502 errors på Vercel:
1. Kontrollera Vercel function logs
2. Verifiera environment variables
3. Kontrollera database connectivity
4. Kontakta Vercel support (excellent support)

**🚀 FÖRDELAR MED VERCEL:**
- ✅ Ingen 502 errors (serverless architecture)
- ✅ Automatisk scaling
- ✅ Global CDN
- ✅ Automatisk HTTPS
- ✅ Git integration
- ✅ Excellent Next.js support
- ✅ Gratis tier är generös

**🎯 SLUTRESULTAT:** https://re-commerce.se fungerar perfekt på professionell hosting!
