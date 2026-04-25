# Structure du Projet MediTrack

```
gestion_patient/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx              # Navigation principale
│   │   ├── StatCard.jsx             # Carte statistique du tableau de bord
│   │   ├── PatientModal.jsx         # Modal réutilisable
│   │   └── FormInput.jsx            # Composant input/select/textarea réutilisable
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx            # Tableau de bord principal
│   │   ├── Patients.jsx             # Liste des patients avec recherche
│   │   ├── PatientForm.jsx          # Formulaire ajouter/modifier patient
│   │   ├── PatientDetail.jsx        # Fiche détaillée d'un patient
│   │   ├── Consultations.jsx        # Liste de toutes les consultations
│   │   ├── ConsultationForm.jsx     # Formulaire ajouter consultation
│   │   └── Appointments.jsx         # Gestion des rendez-vous
│   │
│   ├── context/
│   │   └── PatientContext.jsx       # Context API pour la gestion d'état globale
│   │
│   ├── utils/
│   │   └── helpers.js              # Fonctions utilitaires (date, age, etc.)
│   │
│   ├── data/
│   │   └── sampleData.js           # Données d'exemple
│   │
│   ├── App.jsx                      # Composant racine avec Router
│   ├── main.jsx                     # Point d'entrée React
│   └── index.css                    # Styles globaux
│
├── index.html                       # HTML principal
├── package.json                     # Dépendances et scripts
├── tailwind.config.js              # Configuration Tailwind CSS
├── postcss.config.js               # Configuration PostCSS
├── vite.config.js                  # Configuration Vite
├── README.md                        # Documentation principale
├── GUIDE_UTILISATION.md            # Guide d'utilisation
└── ARCHITECTURE.md                 # Ce fichier
```

## Architecture de l'Application

### Hiérarchie des Composants

```
App
├── Router
│   └── PatientProvider (Context)
│       ├── Sidebar
│       │   ├── NavItem (Link)
│       │   └── UserProfile
│       │
│       └── Main Routes
│           ├── Dashboard
│           │   ├── StatCard (x4)
│           │   ├── RecentPatients (table)
│           │   └── UpcomingAppointments
│           │
│           ├── /patients (Patients.jsx)
│           │   ├── SearchBar
│           │   ├── FilterBar
│           │   ├── PatientsTable
│           │   └── Pagination
│           │
│           ├── /patients/nouveau (PatientForm.jsx)
│           │   └── FormFields
│           │
│           ├── /patients/:id (PatientDetail.jsx)
│           │   ├── PatientCard
│           │   ├── ConsultationList
│           │   └── AddConsultationButton
│           │
│           ├── /patients/:id/modifier (EditPatient)
│           │   └── PatientForm (mode edit)
│           │
│           ├── /consultations (Consultations.jsx)
│           │   ├── ConsultationCard (list)
│           │   └── Pagination
│           │
│           ├── /consultations/nouvelle (ConsultationForm.jsx)
│           │   └── ConsultationFormFields
│           │
│           └── /rendez-vous (Appointments.jsx)
│               ├── CalendarView
│               └── ListeView
```

## Flux de Données

### Gestion d'État avec Context

```
PatientContext
├── State
│   ├── patients[]
│   ├── consultations[]
│   └── appointments[]
│
└── Actions
    ├── addPatient(data)
    ├── updatePatient(id, data)
    ├── deletePatient(id)
    ├── getPatient(id)
    ├── addConsultation(data)
    ├── getPatientConsultations(patientId)
    ├── addAppointment(data)
    ├── getMonthAppointments(year, month)
    └── getStats()
```

### Persistance des Données

```
localStorage
├── patients (JSON)
├── consultations (JSON)
└── appointments (JSON)

↓ (Premier chargement vide)

sampleData.js
├── samplePatients[]
├── sampleConsultations[]
└── sampleAppointments[]
```

## Flux de Navigation

```
/ (Dashboard)
├── /patients
│   ├── /patients/nouveau → POST → /patients/:id
│   ├── /patients/:id
│   │   └── /patients/:id/modifier
│   └── /patients/:id → Consultations
│
├── /consultations
│   ├── /consultations/nouvelle
│   │   ├── Select patient
│   │   └── POST → /patients/:id
│   └── /consultations/nouvelle/:patientId
│
└── /rendez-vous
    └── /rendez-vous → Modal → POST (local)
```

## Modèles de Données

### Patient
```javascript
{
  id: string (Date.now()),
  nom: string,
  prenom: string,
  dateNaissance: string (YYYY-MM-DD),
  sexe: string,
  telephone: string,
  telephoneSecondaire: string,
  lieu: string,
  profession: string,
  groupeSanguin: string,
  allergies: string,
  antecedents: string,
  statut: string ("Actif" | "Inactif"),
  createdAt: ISO 8601
}
```

### Consultation
```javascript
{
  id: string,
  patientId: string,
  date: ISO 8601,
  motif: string,
  symptomes: string,
  diagnostic: string,
  traitement: string,
  examens: string,
  notes: string
}
```

### Appointment
```javascript
{
  id: string,
  patientId: string,
  date: ISO 8601,
  heure: string (HH:MM),
  motif: string
}
```

## Composants Réutilisables

### StatCard
- Props: `label`, `value`, `icon`, `color`
- Usage: Affichage de statistiques

### FormInput
- Props: `label`, `name`, `type`, `value`, `onChange`, `required`, `options`
- Types: `text`, `email`, `date`, `time`, `tel`, `select`, `textarea`
- Usage: Formulaires

### PatientModal
- Props: `isOpen`, `title`, `onClose`, `children`
- Usage: Modals de confirmation ou d'ajout

## Helpers et Utilitaires

### helpers.js
```javascript
getAge(dateNaissance)              // int
formatDate(date)                   // string (français long)
formatDateShort(date)              // string (DD/MM/YYYY)
formatDateForInput(date)           // string (YYYY-MM-DD)
getInitials(nom, prenom)           // string
getDayOfWeek(date)                 // string
formatDateTime(date)               // string (avec heure)
```

## Styling

### Tailwind Configuration
- **Colors**: Primary (#0F172A), Accent (#10B981), Danger (#EF4444)
- **Fonts**: Plus Jakarta Sans
- **Responsive**: Mobile-first approach

### Custom CSS (index.css)
- Google Fonts import
- Scrollbar styling
- Animations (fadeIn, slideIn)
- Focus states
- Form resets

## Performance

### Optimisations
- React.memo pour les composants (si nécessaire)
- useCallback pour les handlers (optionnel)
- Pagination (10 items par page)
- Lazy loading possible pour les images

### Limitations
- localStorage limit ~5-10MB
- Client-side rendering uniquement
- Pas de synchronisation multi-onglet automatique

## Sécurité

### Points à Considérer
- ⚠️ Données stockées localement (sensibles)
- Pas de chiffrement/authentification (prototype)
- À implémenter pour production:
  - Auth user
  - Backend API
  - HTTPS
  - Chiffrement des données sensibles

## Extensibilité

### Points de Croissance
1. **Backend**: Express/Node.js API
2. **Base de Données**: MongoDB, PostgreSQL
3. **Auth**: JWT, OAuth
4. **Stockage**: Cloud (AWS S3)
5. **Export**: PDF, CSV
6. **Notifications**: Email, SMS
7. **Mobile**: React Native
8. **Monitoring**: Sentry, LogRocket

## Dépendances

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.3",
    "@heroicons/react": "^2.1.3"
  },
  "devDependencies": {
    "vite": "^5.2.0",
    "tailwindcss": "^3.4.3",
    "@vitejs/plugin-react": "^4.3.1"
  }
}
```

## Scripts

```bash
npm run dev       # Démarrer dev server (localhost:5173)
npm run build     # Build production
npm run preview   # Prévisualiser build
```

---

Version: 1.0.0
Créé: 2024
