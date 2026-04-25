# 🧪 Guide de Test MediTrack

## ✅ Vérification Rapide (5 minutes)

### 1️⃣ Démarrage de l'Application (30 sec)

```bash
npm run dev
```

**Attendez vous à voir:**
- ✅ `VITE v5.4.21 ready in ...ms`
- ✅ `➜ Local: http://localhost:5173/`
- ✅ Pas d'erreurs de compilation

**Ouvrir le navigateur:**
- URL: `http://localhost:5173/`
- Vous devriez voir le **Dashboard** de MediTrack

---

### 2️⃣ Test du Dashboard (1 min)

#### Vérifications:
- [x] **Logo "MediTrack"** visible en haut à gauche
- [x] **Sidebar** avec 4 options de navigation
- [x] **4 cartes statistiques**:
  - Total Patients: `8`
  - Consultations Aujourd'hui: `0`
  - Nouveaux Patients (Ce mois): Nombre > 0
  - Rendez-vous à Venir: Nombre > 0
- [x] **Section "Rendez-vous à venir"** avec au moins 1 item
- [x] **Section "Dernières Consultations"** avec au moins 1 item
- [x] **Tableau "Patients Récents"** avec 10 patients
- [x] **2 boutons action rapide** (Ajouter patient, Nouvelle consultation)

---

### 3️⃣ Test Liste des Patients (1.5 min)

#### Navigation:
1. Cliquez sur **"Patients"** dans la sidebar

#### Vérifications:
- [x] Page charge avec une **liste de 10 patients**
- [x] **Barre de recherche** fonctionnelle
- [x] **Filtres disponibles** (Sexe, Statut)
- [x] **Pagination** visible en bas
- [x] **Table complète** avec colonnes: Nom, Tel, Lieu, Âge, Statut
- [x] **3 boutons action** par patient: Voir, Modifier, Supprimer
- [x] **Compteur** "X patient(s) trouvé(s)"

#### Test Recherche:
1. Tapez "Dupont" dans la recherche
2. Résultat: **1 patient** (Alice Dupont)
3. Effacez et tapez "06"
4. Résultat: **Multiple patients**

#### Test Filtres:
1. Sélectionnez "Femme" dans le filtre sexe
2. Résultat: **Patients féminins seulement**
3. Sélectionnez "Inactif" dans statut
4. Résultat: **1 patient** (Rousseau Sophie)

---

### 4️⃣ Test Détail Patient (1 min)

#### Navigation:
1. Dans **Patients**, cliquez sur "Voir" pour un patient

#### Vérifications:
- [x] **Fiche patient complète** s'affiche
- [x] **Nom, âge, sexe** du patient visibles
- [x] **Boutons** Modifier et Supprimer
- [x] **Infos médicales**: Groupe sanguin, profession, statut
- [x] **Allergies et antécédents** affichés
- [x] **Section "Historique des consultations"** visible
- [x] **Au moins 1-2 consultations** affichées
- [x] **Bouton "Ajouter une consultation"** visible

---

### 5️⃣ Test Ajouter un Patient (1.5 min)

#### Navigation:
1. Cliquez sur **"Ajouter un patient"** (Dashboard ou Patients)

#### Vérifications:
- [x] **Formulaire apparaît** avec tous les champs
- [x] **Champs marqués avec ***: Nom, Prénom, Date naissance, Tél, Lieu
- [x] **Select Sexe**, **Groupe sanguin**, **Statut** fonctionnels
- [x] **Textareas** pour allergies et antécédents

#### Test Remplissage:
1. Remplissez avec données de test:
   - Nom: `TestDurand`
   - Prénom: `TestJean`
   - Date: `1990-05-15`
   - Sexe: `Homme`
   - Tél: `06 11 22 33 44`
   - Lieu: `Paris`

2. Cliquez **"Ajouter le patient"**
3. Vérifications:
   - [x] Redirection vers la **fiche du patient**
   - [x] **9 patients** dans la liste (au lieu de 8)
   - [x] Le nouveau patient **apparaît en haut**

#### Cleanup:
1. Allez à Patients
2. Trouvez "TestDurand"
3. Cliquez le bouton 🗑️
4. Confirmez la suppression
5. Vérification: **Back to 8 patients**

---

### 6️⃣ Test Consultations (1 min)

#### Navigation:
1. Cliquez sur **"Consultations"** dans la sidebar

#### Vérifications:
- [x] **Liste de toutes les consultations** (15+)
- [x] **Triées par date** (les plus récentes en premier)
- [x] **Informations affichées**: Patient, date, motif, diagnostic
- [x] **Lien "Voir la fiche"** vers le patient
- [x] **Pagination** si plus de 20 items

#### Ajouter une Consultation:
1. Cliquez **"Nouvelle consultation"**
2. Sélectionnez un patient: `Dupont Alice`
3. Remplissez:
   - Motif: `Visite de test`
   - Diagnostic: `Bon état général`
   - Autres champs optionnels
4. Cliquez **"Enregistrer"**
5. Vérifications:
   - [x] Redirection vers **fiche du patient**
   - [x] Nouvelle consultation apparaît dans l'historique

---

### 7️⃣ Test Rendez-vous (1 min)

#### Navigation:
1. Cliquez sur **"Rendez-vous"** dans la sidebar

#### Vérifications Vue Calendrier:
- [x] **Calendrier du mois actuel** visible
- [x] **Navigation** mois précédent/suivant fonctionne
- [x] **Rendez-vous affichés** dans les jours
- [x] **Bouton toggle** pour changer de vue

#### Test Vue Liste:
1. Cliquez sur **"Liste"**
2. Vérifications:
   - [x] Tous les rendez-vous affichés en liste
   - [x] **Triés par date**
   - [x] Informations: Patient, date, heure, motif

#### Ajouter un Rendez-vous:
1. Cliquez **"Ajouter un rendez-vous"**
2. Modal apparaît
3. Sélectionnez:
   - Patient: `Martin Jean`
   - Date: Demain
   - Heure: `15:30`
   - Motif: `Test RDV`
4. Cliquez **"Ajouter"**
5. Vérifications:
   - [x] Modal ferme
   - [x] Nouveau RDV visible au calendrier
   - [x] Compte rendez-vous augmente

---

### 8️⃣ Test Responsive (30 sec)

#### Sur Desktop (1920x1080):
1. Sidebar visible à gauche
2. Contenu à droite
3. Menu hamburger **absent**

#### Sur Tablet (768x1024):
1. Ouvrez Dev Tools: **F12**
2. Cliquez l'icône responsive
3. Sélectionnez **"iPad"**
4. Vérifications:
   - [x] Menu hamburger **visible** en haut gauche
   - [x] Cliquez le ☰ → Sidebar apparaît
   - [x] Overlay semi-transparent
   - [x] Cliquez menu item → Navigation fonctionne

#### Sur Mobile (375x667):
1. Sélectionnez **"iPhone 12"** dans responsive
2. Vérifications:
   - [x] Menu hamburger visible
   - [x] Contenu lisible sans scroll horizontal
   - [x] Boutons cliquables
   - [x] Formulaires adaptés

---

### 9️⃣ Test Persistance Données (1 min)

#### Vérification localStorage:
1. Ouvrez Dev Tools: **F12**
2. Allez à **Application** (ou Storage)
3. Cliquez **localStorage**
4. Vérifications:
   - [x] **patients** - JSON array avec 8+ items
   - [x] **consultations** - JSON array avec 15+ items
   - [x] **appointments** - JSON array avec 5+ items

#### Test Persistance:
1. Ajouter un patient test
2. **Fermer complètement le navigateur**
3. **Rouvrir** et naviguer vers l'app
4. Vérifications:
   - [x] Patient test toujours présent
   - [x] Données **non perdues**

---

### 🔟 Test Navigation Complète (1 min)

#### Parcourir toutes les pages:

1. ✅ Dashboard → Patients → Dashboard
2. ✅ Patients → Patient Detail → Modifier → Patients
3. ✅ Patients → Ajouter Patient → Dashboard
4. ✅ Consultations → Liste → Ajouter → Patient Detail
5. ✅ Rendez-vous → Calendrier → Liste → RDV
6. ✅ Tous les boutons action fonctionnent

---

## 🧠 Erreurs à Chercher

### Console du Navigateur (F12 → Console)
- ⚠️ **Pas d'erreurs rouges**
- ⚠️ **Pas de warnings graves**
- ⚠️ Quelques avertissements mineurs OK

### Performance
- ✅ Pages chargent **< 1 sec**
- ✅ Pas de lag/freeze
- ✅ Animations fluides

### Données
- ✅ **8 patients** chargés au démarrage
- ✅ **15 consultations** chargées
- ✅ **5 rendez-vous** chargés
- ✅ Aucune donnée corrompue

---

## 📊 Test Complet - Checklist

### Fonctionnalités Principales
- [ ] Dashboard affiche stats correctement
- [ ] Recherche patients fonctionne
- [ ] Filtres patients fonctionne
- [ ] Ajouter patient fonctionne
- [ ] Modifier patient fonctionne
- [ ] Supprimer patient fonctionne
- [ ] Ajouter consultation fonctionne
- [ ] Calendrier rendez-vous fonctionne
- [ ] Ajouter rendez-vous fonctionne

### UI/UX
- [ ] Sidebar responsive
- [ ] Hamburger menu fonctionne
- [ ] Tous les boutons visuels
- [ ] Couleurs correctes
- [ ] Police correcte
- [ ] Espacements corrects

### Données
- [ ] localStorage sauvegarde
- [ ] Persistance après reload
- [ ] Données d'exemple chargées
- [ ] Validation formulaires

### Responsive
- [ ] Desktop OK
- [ ] Tablet OK
- [ ] Mobile OK

---

## 🐛 Debug Rapide

### Si l'app ne démarre pas:
```bash
rm -rf node_modules
npm install
npm run dev
```

### Si compilations échouent:
1. Ouvrir Dev Tools (F12)
2. Console tab
3. Vérifier les erreurs
4. Chercher dans les fichiers

### Si données manquent:
```javascript
// Dans Console du navigateur:
localStorage.clear()
// Puis recharger la page
```

### Si le port 5173 est occupé:
```bash
npm run dev -- --port 5174
```

---

## ✅ Tests Réussis = Application Prête!

Si tous les tests passent, l'application est:
- ✅ **Fonctionnelle**
- ✅ **Stable**
- ✅ **Prête à l'emploi**
- ✅ **Prête à déployer**

Profitez de **MediTrack**! 🏥

---

**Temps total de test: ~15-20 minutes**

Si un test échoue → Vérifier la console pour les erreurs
