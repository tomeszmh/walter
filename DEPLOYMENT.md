# Deployment Guide - Walter & Walter Kft. Website

Ez az útmutató segít a weboldal élő publikálásában.

## 🚀 Gyors opciók (ajánlott)

### 1. Netlify (Legkönnyebb - 2 perc)

1. **Regisztráció:**
   - Menj a [netlify.com](https://www.netlify.com) oldalra
   - Regisztrálj egy ingyenes fiókot (GitHub, Google vagy email)

2. **Deploy:**
   - Húzd be a `walter` mappát a Netlify dashboardra
   - Vagy használd a Netlify CLI-t:
     ```bash
     npm install -g netlify-cli
     netlify deploy
     netlify deploy --prod
     ```

3. **Eredmény:**
   - Azonnal kapsz egy URL-t (pl: `walter-walter.netlify.app`)
   - Ingyenes SSL tanúsítvány
   - Automatikus HTTPS

### 2. Vercel (Nagyon egyszerű)

1. **Regisztráció:**
   - Menj a [vercel.com](https://vercel.com) oldalra
   - Regisztrálj GitHub fiókkal

2. **Deploy:**
   - Kattints "New Project"
   - Válaszd ki a repository-t vagy húzd be a mappát
   - Vercel automatikusan felismeri és deploy-olja

3. **Eredmény:**
   - URL: `walter-walter.vercel.app`
   - Ingyenes SSL
   - Gyors CDN

### 3. GitHub Pages (Ha GitHub-ot használsz)

1. **GitHub Repository létrehozása:**
   ```bash
   cd /Users/tamas.nyiri/Klarna/walter
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/FELHASZNALONEV/walter-website.git
   git push -u origin main
   ```

2. **GitHub Pages beállítása:**
   - Menj a repository Settings → Pages
   - Válaszd ki a `main` branch-t
   - Válaszd ki a `/ (root)` mappát
   - Mentsd el

3. **Eredmény:**
   - URL: `FELHASZNALONEV.github.io/walter-website`
   - Ingyenes, de lassabb lehet

## 📦 Egyéb opciók

### 4. Surge.sh (CLI alapú)

```bash
npm install -g surge
cd /Users/tamas.nyiri/Klarna/walter
surge
# Következd az utasításokat
# URL: walter-walter.surge.sh
```

### 5. Cloudflare Pages

1. Menj a [pages.cloudflare.com](https://pages.cloudflare.com) oldalra
2. Kapcsold össze a GitHub repository-t
3. Automatikus deploy minden push után

### 6. Traditional Web Hosting

Ha van saját web hosting szolgáltatásod:

1. **FTP feltöltés:**
   - Használd FileZilla-t vagy bármilyen FTP klienst
   - Töltsd fel az összes fájlt a `public_html` vagy `www` mappába
   - Fájlok: `index.html`, `styles.css`, `script.js`, `logo.svg`

2. **Domain beállítása:**
   - Ha van saját domain (pl: `waltergepeszet.hu`), állítsd be a DNS-t

## 🔧 Domain beállítása (opcionális)

Ha saját domain-t szeretnél használni (pl: `waltergepeszet.hu`):

1. **Netlify-nál:**
   - Site settings → Domain management
   - Add custom domain
   - Kövesd a DNS beállítási utasításokat

2. **Vercel-nél:**
   - Project Settings → Domains
   - Add domain
   - Állítsd be a DNS rekordokat

## 📝 Fontos megjegyzések

- **Form kezelés:** A jelenlegi form csak demonstrációs. Éles környezetben szükséges backend integráció.
- **Email küldés:** A form adatok küldéséhez szükséges egy email szolgáltatás (pl: EmailJS, Formspree, vagy saját backend).
- **SEO:** Hozzáadhatsz meta tag-eket az `index.html` `<head>` részéhez.

## 🎯 Ajánlott: Netlify

A legegyszerűbb és leggyorsabb megoldás:
- ✅ Ingyenes
- ✅ Automatikus HTTPS
- ✅ Gyors CDN
- ✅ Könnyű domain beállítás
- ✅ Form handling (Formspree integráció)

## 🚀 Gyors start Netlify-val

1. Menj a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Húzd be a `walter` mappát
3. Kész! 🎉

