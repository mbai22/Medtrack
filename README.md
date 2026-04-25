# MediTrack - Gestion des Patients

Une application complète de gestion des patients pour médecins généralistes, construite avec React, Tailwind CSS et React Router.

## 🚀 Caractéristiques

### Pages Principales

#### 1. **Tableau de Bord** (`/`)
- Vue d'ensemble des statistiques clés
  - Total des patients
  - Consultations d'aujourd'hui
  - Nouveaux patients ce mois-ci
  - Rendez-vous à venir
- Derniers rendez-vous à venir
- Dernières consultations enregistrées
- Tableau des 10 derniers patients
- Actions rapides pour ajouter un patient ou une consultation

#### 2. **Gestion des Patients** (`/patients`)
- **Liste des patients** avec recherche et filtres
  - Recherche par nom ou téléphone
  - Filtrage par sexe (Homme/Femme)
  - Filtrage par statut (Actif/Inactif)
  - Pagination (10 patients par page)
- **Ajouter un patient** (`/patients/nouveau`)
  - Formulaire complet avec validation
  - Informations médicales et de contact
- **Détail du patient** (`/patients/:id`)
  - Profil complet du patient
  - Historique des consultations
  - Actions pour ajouter une consultation ou modifier
- **Modifier un patient** (`/patients/:id/modifier`)
  - Édition de tous les champs

#### 3. **Consultations** (`/consultations`)
- **Liste de toutes les consultations**
  - Triées par date (plus récente en premier)
  - Affichage du patient, motif et diagnostic
- **Ajouter une consultation** (`/consultations/nouvelle/:patientId`)
  - Sélection du patient
  - Date, motif, diagnostic, traitement
  - Examens demandés et notes

#### 4. **Rendez-vous** (`/rendez-vous`)
- **Vue calendrier mensuels**
  - Navigation entre les mois
  - Affichage des rendez-vous par jour
- **Vue liste**
  - Tous les rendez-vous triés par date
- **Ajouter un rendez-vous** (modal)
  - Sélection du patient
  - Date, heure et motif

### Navigation

**Sidebar** (toujours visible sur desktop, hamburger menu sur mobile)
- Tableau de bord
- Patients
- Consultations
- Rendez-vous
- Profil du médecin (Dr. Jean Dupont)

## 🛠️ Technologies

- **React 18** - Bibliothèque UI
- **Vite** - Build tool et dev server
- **Tailwind CSS v3** - Styles
- **React Router v6** - Navigation
- **Heroicons** - Icônes
- **localStorage** - Persistance des données

## 📦 Installation

### Prérequis
- Node.js (v16+)
- npm

### Étapes

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Ouvrir dans le navigateur
# L'app sera disponible sur http://localhost:5173/
```

### Build pour production
```bash
npm run build

# Prévisualiser la version production
npm run preview
```

## 📊 Structure de Données

### Patient
```javascript
{
  id: string,
  nom: string,
  prenom: string,
  dateNaissance: string (YYYY-MM-DD),
  sexe: string ("Homme" | "Femme"),
  telephone: string,
  telephoneSecondaire: string,
  lieu: string,
  profession: string,
  groupeSanguin: string,
  allergies: string,
  antecedents: string,
  statut: string ("Actif" | "Inactif"),
  createdAt: ISO 8601 timestamp
}
```

### Consultation
```javascript
{
  id: string,
  patientId: string,
  date: ISO 8601 timestamp,
  motif: string,
  symptomes: string,
  diagnostic: string,
  traitement: string,
  examens: string,
  notes: string
}
```

### Rendez-vous
```javascript
{
  id: string,
  patientId: string,
  date: ISO 8601 timestamp,
  heure: string (HH:MM),
  motif: string
}
```

## 💾 Stockage des Données

L'application utilise **localStorage** pour persister les données :
- `patients` - Liste de tous les patients
- `consultations` - Historique des consultations
- `appointments` - Rendez-vous programmés

Les données d'exemple sont chargées au premier lancement de l'application.

## 🎨 Palette de Couleurs

- **Primaire**: Deep navy blue (#0F172A)
- **Accent**: Emerald green (#10B981)
- **Danger**: Red (#EF4444)
- **Secondaires**: Gray scale

## 📱 Responsive

L'application est **100% responsive** :
- Desktop: Sidebar fixe à gauche
- Tablet & Mobile: Menu hamburger collapsible

## 🔧 Utilitaires

### Fonctions disponibles (`src/utils/helpers.js`)

- `getAge(dateNaissance)` - Calcule l'âge
- `formatDate(date)` - Format français complet
- `formatDateShort(date)` - Format DD/MM/YYYY
- `formatDateForInput(date)` - Format pour input date HTML
- `getInitials(nom, prenom)` - Retourne les initiales
- `getDayOfWeek(date)` - Jour de la semaine en français
- `formatDateTime(date)` - Date avec heure

## 📋 Fonctionnalités Avancées

### Gestion d'État
- **Context API** pour la gestion des patients, consultations et rendez-vous
- **localStorage** pour la persistance
- Synchronisation automatique entre les composants

### Recherche et Filtrage
- Recherche en temps réel sur les patients
- Filtrage multi-critères
- Pagination automatique

### Validation
- Champs requis (marqués avec *)
- Validation des dates
- Vérification de la sélection du patient

## 🚦 Données d'Exemple

L'application est livrée avec 8 patients et 15 consultations d'exemple pour une démonstration complète.

## 📝 Notes d'Utilisation

1. **Ajouter un patient** : `Ajouter un patient` → Remplir le formulaire → `Ajouter le patient`
2. **Ajouter une consultation** : Aller à la fiche patient → `Ajouter une consultation` → Remplir les champs
3. **Modifier un patient** : Liste patients → Icône crayon → Modifier → `Mettre à jour`
4. **Voir l'historique** : Cliquer sur un patient pour voir toutes ses consultations

## 🎯 Prochaines Améliorations Possibles

- Export PDF des fiches patients
- Export des consultations
- Statistiques avancées (par mois, par motif)
- Rappels automatiques de rendez-vous
- Graphiques de données
- Authentification utilisateur
- Sauvegarde cloud
- Intégration avec une base de données backend

## 📄 Licence

Libre d'utilisation

## 👨‍💻 Auteur

Application générée automatiquement avec React + Tailwind CSS

---

**Besoin d'aide ?** Consultez la documentation React, Tailwind CSS ou React Router.
