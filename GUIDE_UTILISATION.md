# Guide d'Utilisation MediTrack

## Démarrer l'Application

```bash
npm run dev
```

L'application s'ouvrira automatiquement sur `http://localhost:5173/`

## Scénarios d'Utilisation Courants

### Scenario 1: Ajouter un nouveau patient

1. Cliquez sur **"Ajouter un patient"** depuis le tableau de bord
2. Remplissez les informations obligatoires (*):
   - Nom et Prénom
   - Date de naissance
   - Téléphone
   - Lieu d'habitation
3. Remplissez les autres informations (optionnel):
   - Professionnel
   - Groupe sanguin
   - Allergies
   - Antécédents médicaux
4. Cliquez sur **"Ajouter le patient"**
5. Vous serez redirigé vers la fiche du patient

### Scenario 2: Enregistrer une consultation

**Option A: Depuis le tableau de bord**
1. Cliquez sur **"Nouvelle consultation"**
2. Sélectionnez le patient dans la liste
3. Remplissez:
   - Motif de la consultation
   - Symptômes observés
   - Diagnostic établi
   - Traitement prescrit
4. Cliquez sur **"Enregistrer la consultation"**

**Option B: Depuis la fiche d'un patient**
1. Allez à **Patients** → Sélectionnez le patient
2. Cliquez sur **"Ajouter une consultation"**
3. Remplissez le formulaire
4. Validez

### Scenario 3: Chercher un patient

1. Allez à la page **Patients**
2. Utilisez la barre de recherche pour trouver par:
   - Nom
   - Prénom
   - Numéro de téléphone
3. Optionnel: Filtrez par sexe ou statut (Actif/Inactif)

### Scenario 4: Planifier un rendez-vous

1. Allez à **Rendez-vous**
2. Vue **Calendrier**: Naviguez jusqu'au mois souhaité
3. Cliquez sur **"Ajouter un rendez-vous"**
4. Sélectionnez:
   - Patient
   - Date
   - Heure
   - Motif
5. Cliquez sur **"Ajouter"**

### Scenario 5: Modifier les informations d'un patient

1. Allez à **Patients**
2. Trouvez le patient
3. Cliquez sur l'icône ✏️ (crayon)
4. Modifiez les informations
5. Cliquez sur **"Mettre à jour"**

## Filtres et Recherches

### Page Patients

| Filtre | Usage |
|--------|-------|
| **Recherche** | Saisissez un nom ou un numéro de téléphone |
| **Sexe** | Filtrer par Homme/Femme |
| **Statut** | Filtrer par Actif/Inactif |

### Consultations

- Triées automatiquement par date (plus récentes en premier)
- Cliquez sur **"Voir la fiche"** pour accéder au patient

## Le Tableau de Bord

Le tableau de bord affiche:

| Carte | Information |
|------|-------------|
| **Total Patients** | Nombre total de patients enregistrés |
| **Consultations Aujourd'hui** | Consultations du jour |
| **Nouveaux Patients (Ce mois)** | Nombre de nouveaux patients ce mois |
| **Rendez-vous à Venir** | Rendez-vous programmés pour les jours à venir |

Plus bas:
- **Rendez-vous à venir**: Les 5 prochains rendez-vous
- **Dernières Consultations**: Les 5 dernières consultations enregistrées
- **Patients Récents**: Les 10 derniers patients ajoutés

## Navigation Mobile

Sur mobile, le menu est accessible via le bouton **☰** en haut à gauche:
1. Cliquez sur **☰** pour ouvrir le menu
2. Cliquez sur une page pour naviguer
3. Cliquez sur **✕** ou en dehors du menu pour le fermer

## Raccourcis Utiles

| Action | Accès Rapide |
|--------|-------------|
| Ajouter un patient | Tableau de bord → Bouton "Ajouter un patient" |
| Nouvelle consultation | Tableau de bord → Bouton "Nouvelle consultation" |
| Voir tous les patients | Menu → Patients |
| Consulter l'historique | Patients → Sélectionner un patient |
| Gérer les rendez-vous | Menu → Rendez-vous |

## Suppression de Données

### Supprimer un patient

⚠️ **ATTENTION**: Cette action est irréversible!

1. Allez à **Patients**
2. Cliquez sur l'icône 🗑️ (poubelle)
3. Confirmez la suppression
4. Le patient et toutes ses consultations seront supprimés

## Informations Persistantes

Toutes les données sont sauvegardées automatiquement dans votre navigateur (localStorage):

- ✅ Les données sont conservées même après fermeture de l'application
- ✅ Pas de serveur nécessaire
- ⚠️ Les données sont locales au navigateur/appareil

## Conseils d'Utilisation

1. **Sauvegarde régulière**: Pensez à exporter/sauvegarder vos données régulièrement
2. **Données obligatoires**: Les champs marqués * doivent être remplis
3. **Dates**: Utilisez le format YYYY-MM-DD dans les champs date
4. **Recherche**: La recherche est insensible à la casse
5. **Pagination**: Vous pouvez afficher 10 patients par page

## Groupe Sanguin

Valeurs acceptées:
- A+, A-
- B+, B-
- AB+, AB-
- O+, O-

## Statut Patient

- **Actif**: Patient suivi régulièrement
- **Inactif**: Patient non actif actuellement

## Questions Fréquentes

**Q: Où sont stockées mes données?**
A: Dans le localStorage de votre navigateur. Aucune donnée n'est envoyée à un serveur.

**Q: Puis-je exporter mes données?**
A: Actuellement, vous pouvez accéder aux données via les outils de développement du navigateur (F12 → Application → localStorage).

**Q: Comment réinitialiser les données?**
A: Effacez le localStorage dans les paramètres du navigateur (Applications → Clear storage) ou videz les données manuellement.

**Q: L'app fonctionne-t-elle hors ligne?**
A: Oui, complètement! L'application ne nécessite pas de connexion internet.

---

Besoin de plus d'aide? Consultez le README.md ou ouvrez les devtools (F12).
