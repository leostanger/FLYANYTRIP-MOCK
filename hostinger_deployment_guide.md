# 🚀 FlyAnyTrip Hostinger Deployment Guide
## flyanytrip.com → Complete Step-by-Step Process

---

> [!IMPORTANT]
> **Hostinger Shared Hosting Node.js support nahi karta!**
> Aapka backend Node.js/Express me hai.
> Isliye plan ye hoga:
> - **Frontend (React)** → Hostinger `public_html` (build kar ke upload)
> - **Backend (Node.js)** → **Railway** (free) par deploy
> - **Database** → **Neon PostgreSQL** as-is (already cloud pe hai, kuch nahi badlna)

---

## 📋 Overview Architecture

```
flyanytrip.com (Hostinger)
    └── public_html/
            └── React Build Files (index.html, assets/)
                    ↕ API Calls
Railway Backend URL
    └── Node.js Backend
            ↕ Database
        Neon PostgreSQL (Cloud - already working)
```

---

## PHASE 1 — Backend Deploy to Railway (Free)

### Step 1.1 — Railway Account Banao
1. Browser me jao: **https://railway.app**
2. **"Start a New Project"** → **"Login with GitHub"**
3. GitHub se login karo

### Step 1.2 — Backend Folder GitHub pe Push Karo
Command Prompt me backend folder me jao:
```
cd "m:\FLYANYTRIP FINAL UI\FLYANYTRIP MILAN\backend"
git init
git add .
git commit -m "FlyAnyTrip backend"
```
- GitHub.com par jao → **New Repository** banao → `flyanytrip-backend`
- Copy karo remote URL
```
git remote add origin https://github.com/yourname/flyanytrip-backend.git
git branch -M main
git push -u origin main
```

### Step 1.3 — Railway pe Deploy
1. Railway dashboard → **"New Project"** → **"Deploy from GitHub repo"**
2. `flyanytrip-backend` select karo
3. Railway automatically Node.js detect karega aur deploy karega

### Step 1.4 — Railway Environment Variables Set Karo
Railway dashboard → aapka project → **"Variables"** tab → ye sab add karo:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_A9HVOf5vrDFT@ep-misty-heart-ax41xn1w.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `ADIVAHA_PID` | `77A93722` |
| `ADIVAHA_API_KEY` | `69EF161DEEBA7` |
| `RAZORPAY_KEY_ID` | `rzp_test_RH0I6LBnmc0Ziz` |
| `RAZORPAY_KEY_SECRET` | `7ReMSO0JONPPyRe0WkuylqTl` |
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `bookings@flyanytrip.com` |
| `SMTP_PASS` | `Bookings@*)2025` |
| `FRONTEND_URL` | `https://flyanytrip.com` |
| `PORT` | `5000` |

### Step 1.5 — Railway URL Note Karo
Deploy hone ke baad Railway ek URL dega jaise:
`https://flyanytrip-backend-production.up.railway.app`

**Ye URL save karo** — frontend me use hoga.

---

## PHASE 2 — Frontend Build Karo (Local)

### Step 2.1 — .env File Banao Frontend Me
File banao: `frontend/.env`

```env
VITE_API_BASE_URL=https://flyanytrip-backend-production.up.railway.app/api
```

### Step 2.2 — Frontend Build Karo
```
cd "m:\FLYANYTRIP FINAL UI\FLYANYTRIP MILAN\frontend"
npm run build
```

Build complete hone ke baad `dist/` folder banega.

---

## PHASE 3 — Hostinger File Manager Upload

### Step 3.1 — Hostinger cPanel Login
1. **hpanel.hostinger.com** → login
2. **"File Manager"** open karo

### Step 3.2 — Existing PHP Files Backup
1. `public_html` me sab files select karo
2. Compress → zip banao (backup)
3. Existing PHP files delete karo

### Step 3.3 — React Build Upload
1. Local pe `frontend/dist/` folder ko zip karo → `dist.zip`
2. Hostinger File Manager → `public_html/` me jao
3. **"Upload"** → `dist.zip` upload
4. Extract karo
5. Files directly `public_html/` me aani chahiye

Final structure:
```
public_html/
  ├── index.html
  ├── assets/
  └── vite.svg
```

### Step 3.4 — .htaccess File Banao (REQUIRED!)
File Manager → `public_html/` → **New File** → naam: `.htaccess`

Content:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

> [!IMPORTANT]
> `.htaccess` file **zaruri** hai! Bina iske React Router ka URL refresh karne par 404 aayega.

---

## PHASE 4 — Neon PostgreSQL (Kuch Nahi Karna!)

> [!NOTE]
> **Database migrate karne ki zarurat nahi!** Neon PostgreSQL already cloud par hai. Railway backend same `DATABASE_URL` use karega. Sab kaam karega.

---

## PHASE 5 — Custom Domain Backend ke liye (Optional)

### Hostinger DNS me CNAME add karo:
- Name: `api`
- Value: `flyanytrip-backend-production.up.railway.app`

Frontend `.env` update karo:
```env
VITE_API_BASE_URL=https://api.flyanytrip.com/api
```

---

## ✅ Final Checklist

- [ ] Railway backend deployed + URL mila
- [ ] `frontend/.env` me Railway URL set kiya
- [ ] `npm run build` run kiya → `dist/` ready
- [ ] Hostinger `public_html/` me `dist/` files upload kiye
- [ ] `.htaccess` file create kiya
- [ ] `flyanytrip.com` open karo → React app dikhni chahiye
- [ ] Flight search test karo
- [ ] Payment flow test karo

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| `404` on URL refresh | `.htaccess` file missing hai |
| API calls fail | Railway URL `.env` me check karo |
| CORS error | Railway Variables me `FRONTEND_URL=https://flyanytrip.com` set karo |
| White screen | Browser Console (F12) me error dekho |
| Database error | Railway Variables me `DATABASE_URL` verify karo |
