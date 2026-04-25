# Guide de Déploiement MediTrack

## Préparation du Build

### 1. Générer la Build de Production

```bash
npm run build
```

Cela créera un dossier `dist/` avec l'application optimisée.

### 2. Tester la Build en Local

```bash
npm run preview
```

Permet de tester la version production localement sur `http://localhost:4173/`

## Déploiement

### Option 1: Vercel (Recommandé - Gratuit & Facile)

#### Étapes:

1. **Créer un compte** sur [vercel.com](https://vercel.com)

2. **Installer Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Déployer**:
   ```bash
   vercel
   ```

4. **Suivre les instructions** - Vercel configurera tout automatiquement

#### Avantages:
- ✅ Déploiement automatique depuis Git
- ✅ HTTPS gratuit
- ✅ CDN global
- ✅ Déploiements prévisionnels (preview)
- ✅ Domaine gratuit sous vercel.app

### Option 2: Netlify (Alternative - Gratuit)

#### Étapes:

1. **Créer un compte** sur [netlify.com](https://netlify.com)

2. **Installer Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

3. **Authentifier**:
   ```bash
   netlify login
   ```

4. **Déployer**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### Avantages:
- ✅ Très simple
- ✅ Deployments automatiques avec Git
- ✅ Formulaires intégrés
- ✅ Functions serverless

### Option 3: GitHub Pages (Gratuit)

1. **Créer un repo** sur GitHub

2. **Ajouter GitHub Actions** (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. **Activer GitHub Pages**:
   - Allez aux Settings du repo
   - GitHub Pages → Source → gh-pages branch

#### Avantages:
- ✅ Complètement gratuit
- ✅ Intégré à GitHub

### Option 4: Docker (Pour Serveur Privé)

#### Créer `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### Déployer:

```bash
# Build l'image
docker build -t meditrack .

# Lancer le container
docker run -p 3000:3000 meditrack
```

### Option 5: Serveur Web Standard

#### 1. Sur Apache:

```bash
# Copier le contenu de dist/ dans /var/www/html/meditrack/
cp -r dist/* /var/www/html/meditrack/
```

#### 2. Configurer `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### 3. Sur Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/meditrack/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Optimisations Pré-Déploiement

### 1. Vérifier les Erreurs

```bash
npm run build 2>&1 | grep -i error
```

### 2. Analyser la Taille du Build

```bash
npm install -g vite-plugin-visualizer
# Puis ajouter à vite.config.js et rerun build
```

### 3. Minimiser les Bundles

Vite le fait automatiquement, mais vérifiez `dist/` :
- HTML minimisé
- CSS minimisé
- JavaScript minifié
- Assets optimisés

## Variables d'Environnement

### Créer `.env` (Développement):

```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=MediTrack Dev
```

### Créer `.env.production`:

```
VITE_API_URL=https://api.meditrack.com
VITE_APP_NAME=MediTrack
```

### Usage dans le code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

## Monitoring et Logs

### Sur Vercel:
- Dashboard automatique
- Logs en temps réel
- Analytics

### Sur Netlify:
- Netlify Analytics
- Function logs

### Solution Custom:
- Sentry (error tracking)
- LogRocket (user session replay)
- Google Analytics

## Maintenance

### Mises à Jour

```bash
# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour les packages
npm update

# Mise à jour majeure (plus de risque)
npm install package-name@latest
```

### Backup

1. **Backup du code**: Git
2. **Backup des données**: localStorage export manuel

## SSL/HTTPS

- ✅ Vercel: Automatique
- ✅ Netlify: Automatique
- ✅ GitHub Pages: Automatique
- ⚠️ Serveur personnel: Utiliser Let's Encrypt (gratuit)

### Let's Encrypt avec Nginx:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

## Performance

### Checklist:

- [ ] `npm run build` sans erreurs
- [ ] Taille du bundle < 500KB (gzip)
- [ ] Pas d'images non optimisées
- [ ] CSS/JS minifiés
- [ ] Cache headers configuré
- [ ] Compression gzip activée

### Metrics Cible:

- **First Contentful Paint**: < 1s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: > 90

## Troubleshooting

### Problème: "Cannot find module"

```bash
# Supprimer node_modules et reinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problème: Build échoue

```bash
# Vérifier la configuration
npm run build --verbose

# Nettoyer et réessayer
npm cache clean --force
npm install
npm run build
```

### Problème: Données perdues après déploiement

⚠️ localStorage est par domaine/port. Si vous changez d'URL:
- Les anciennes données ne seront pas accessibles
- Solution: Exporter les données avant le changement

## Rollback

### Sur Vercel:
- Deployments tab → Sélectionner version antérieure → Redeploy

### Sur Netlify:
- Deploys → Sélectionner build antérieur → Publish deploy

### Sur GitHub Pages:
- Revenir au commit précédent + push

## Security Checklist

- [ ] Pas de secrets en plaintext
- [ ] HTTPS activé
- [ ] CORS configuré (si API)
- [ ] CSP headers configurés
- [ ] Pas de dépendances vulnérables (`npm audit`)
- [ ] localStorage encrypté (si données sensibles)

```bash
# Vérifier les vulnérabilités
npm audit
npm audit fix
```

## Domaine Personnalisé

### Vercel:
- Settings → Domains → Ajouter domaine
- Configurer DNS selon les instructions

### Netlify:
- Domain settings → Custom domain
- Mettre à jour DNS

### GitHub Pages:
- Settings → Pages → Custom domain
- Ajouter fichier CNAME au repo

## Coûts

| Service | Coût | Notes |
|---------|------|-------|
| Vercel | Gratuit | $20/mo pro |
| Netlify | Gratuit | $19/mo pro |
| GitHub Pages | Gratuit | Limité à 100GB |
| Heroku | Payant | $7+ /mo |
| AWS | Payant | ~$1-5/mo |
| Docker VPS | Payant | $5-20/mo |

## Recommandation

Pour débuter: **Vercel** ou **Netlify**
- Simple
- Gratuit
- Performant
- Maintenance minimum

Pour production: **Vercel** + **Backend API**
- Scalable
- Sécurisé
- Analytics
- Support

---

Questions? Consultez la doc respective du service de déploiement.
