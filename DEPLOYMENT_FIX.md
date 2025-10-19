# 🚀 Quick Deployment Fix - Admin Access

## ✅ Changes Made:

1. **Moved admin files** dari `src/admin/` ke `admin/` di root
2. **Updated import paths** untuk point ke `/src/services/api.js`
3. **Created redirect file** `admin.html` di root

## 📍 Admin Access URLs:

Setelah deploy/redeploy, admin bisa diakses di:

### Primary URL:
```
https://ilhamgusnul.vercel.app/admin/login.html
```

### Alternative URLs:
```
https://ilhamgusnul.vercel.app/admin.html  (auto-redirect to login)
https://ilhamgusnul.vercel.app/admin/      (akan coba load index.html)
```

## 🔐 Login Credentials:
- **Email:** i.romadhon26@gmail.com
- **Password:** admin123

## 🔄 Deploy Changes to Vercel:

```bash
# Option 1: Auto-deploy via Git
git add .
git commit -m "Fix admin access - move to root"
git push

# Option 2: Manual deploy
vercel --prod
```

## ✅ After Deploy Test:

1. Open: https://ilhamgusnul.vercel.app/admin/login.html
2. Login dengan credentials di atas
3. Akan redirect ke dashboard: https://ilhamgusnul.vercel.app/admin/index.html

## 📁 New File Structure:

```
portfolio-vite-vanilla/
├── admin/                    ← Admin panel (di root sekarang)
│   ├── login.html
│   ├── index.html
│   ├── admin.css
│   └── admin.js
├── admin.html                ← Redirect helper
├── api/                      ← Backend APIs
├── src/
│   ├── services/
│   │   └── api.js           ← API service layer
│   └── main.js
└── index.html                ← Portfolio homepage
```

## 🎯 Next Steps:

1. **Redeploy ke Vercel** (git push atau vercel --prod)
2. **Test admin login** di URL baru
3. **Done!** Admin panel siap digunakan

---

_Admin panel sekarang accessible di Vercel!_ 🎉
