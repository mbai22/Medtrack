# 🚀 MediTrack - Démarrage Rapide

## ✅ Installation en 2 minutes

```bash
# 1. Ouvrir le terminal
cd c:\Users\ADMIN\Desktop\Programmation\gestion_patient

# 2. Installer les dépendances
npm install

# 3. Lancer l'application
npm run dev

# 4. Ouvrir dans le navigateur
# http://localhost:5173/
```

## 📱 C'est prêt !

L'application est maintenant **100% fonctionnelle** avec:

### ✨ 7 Pages Complètes
1. 📊 **Tableau de Bord** - Vue d'ensemble avec statistiques
2. 👥 **Patients** - Liste, recherche, filtrage, pagination
3. ➕ **Ajouter Patient** - Formulaire complet
4. 📋 **Fiche Patient** - Détails + historique consultations
5. ✏️ **Modifier Patient** - Édition des informations
6. 🏥 **Consultations** - Liste et ajout de consultations
7. 📅 **Rendez-vous** - Calendrier et planification

### 🎯 Fonctionnalités
- ✅ Gestion complète des patients
- ✅ Historique des consultations
- ✅ Calendrier des rendez-vous
- ✅ Recherche et filtrage avancés
- ✅ Stockage persistant (localStorage)
- ✅ 100% responsive (mobile + desktop)
- ✅ Données d'exemple chargées

### 🎨 Design
- Palette professionnelle (bleu navy + vert émeraude)
- Police Plus Jakarta Sans
- Icônes Heroicons
- Animations fluides
- Interface intuitive

## 📚 Documentation

| Fichier | Contenu |
|---------|---------|
| **README.md** | Documentation complète |
| **GUIDE_UTILISATION.md** | Guide d'utilisation détaillé |
| **ARCHITECTURE.md** | Structure technique |
| **DEPLOYMENT.md** | Guide de déploiement |

## 🔥 Cas d'Usage Rapides

### Ajouter un Patient
```
Dashboard → "Ajouter un patient" → Remplir formulaire → Valider
```

### Enregistrer une Consultation
```
Patient → "Ajouter une consultation" → Remplir → Valider
```

### Planifier un Rendez-vous
```
Rendez-vous → "Ajouter un rendez-vous" → Modal → Ajouter
```

### Chercher un Patient
```
Patients → Barre de recherche → Taper nom/tél → Filtrer
```

## 🗂️ Structure Créée

```
src/
├── components/          # 4 composants réutilisables
├── pages/              # 7 pages principales
├── context/            # Gestion d'état (Context API)
├── utils/              # Fonctions utilitaires
├── data/               # Données d'exemple
├── App.jsx             # Routing principal
├── main.jsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 💾 Données Persistantes

Automatiquement sauvegardées dans localStorage:
- **8 patients** d'exemple
- **15 consultations** d'exemple
- **5 rendez-vous** d'exemple

Toutes les modifications sont conservées même après fermeture du navigateur!

## 🛠️ Technologies

```json
{
  "React": "18.3.1",
  "Vite": "5.2.0",
  "Tailwind CSS": "3.4.3",
  "React Router": "6.22.3",
  "Heroicons": "2.1.3"
}
```

## 🎓 Prochaines Étapes

### Pour Tester
1. ✅ Ajouter quelques patients
2. ✅ Créer des consultations
3. ✅ Planifier des rendez-vous
4. ✅ Tester recherche et filtres

### Pour Modifier
- Éditer les couleurs dans `tailwind.config.js`
- Ajouter des champs dans les formulaires
- Modifier le texte du médecin (Dr. Jean Dupont)
- Ajouter des validations personnalisées

### Pour Déployer
1. Lire `DEPLOYMENT.md`
2. Choisir un service (Vercel recommandé)
3. Connecter le repo GitHub
4. Déployer en 1 clic!

## 🐛 Troubleshooting

### L'app ne démarre pas?
```bash
# Réinitialiser les dépendances
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 5173 déjà utilisé?
```bash
# Utiliser un autre port
npm run dev -- --port 5174
```

### Données disparues?
```bash
# Recharger les données d'exemple
localStorage.clear()
# Puis recharger la page
```

## 📞 Support

- 📖 Lire les documentations fournis
- 🔍 Vérifier les erreurs dans la console (F12)
- 💬 Vérifier les logs du terminal

## 🎉 Vous êtes Prêt!

L'application est **complète et fonctionnelle**. 

Démarrez avec:
```bash
npm run dev
```

Consultez **README.md** pour plus de détails.

---

**Bonne utilisation de MediTrack! 🏥**

Créé avec ❤️ React + Tailwind CSS
