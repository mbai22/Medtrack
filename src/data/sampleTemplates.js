/**
 * Modèles de consultations prédéfinis
 */

export const sampleConsultationTemplates = [
  {
    id: '1',
    nom: 'Consultation de routine',
    motif: 'Consultation de routine',
    symptomes: 'Aucun symptôme particulier',
    diagnostic: 'État général satisfaisant',
    traitement: 'Aucun traitement nécessaire',
    examens: '',
    notes: 'Conseils hygiéno-diététiques donnés',
  },
  {
    id: '2',
    nom: 'Infection respiratoire',
    motif: 'Toux, fièvre, fatigue',
    symptomes: 'Toux productive, fièvre > 38°C, fatigue, douleurs musculaires',
    diagnostic: 'Infection des voies respiratoires supérieures',
    traitement: 'Paracétamol 1g toutes les 6h si fièvre\nHydratation abondante\nRepos',
    examens: 'NFS, CRP',
    notes: 'Surveillance de la fièvre, consulter si aggravation',
  },
  {
    id: '3',
    nom: 'Hypertension artérielle',
    motif: 'Suivi tension artérielle',
    symptomes: 'Parfois céphalées, vertiges',
    diagnostic: 'Hypertension artérielle légère',
    traitement: 'IEC ou ARA II selon tolérance\nMesures hygiéno-diététiques',
    examens: 'Bilan rénal, ECG',
    notes: 'Surveillance tensionnelle à domicile, mesures hygiéno-diététiques',
  },
  {
    id: '4',
    nom: 'Diabète type 2',
    motif: 'Suivi glycémie',
    symptomes: 'Polyurie, polydipsie, fatigue',
    diagnostic: 'Diabète type 2',
    traitement: 'Metformine 850mg 2x/jour\nRégime équilibré\nActivité physique régulière',
    examens: 'HbA1c, glycémie à jeun, microalbuminurie',
    notes: 'Surveillance glycémique, éducation thérapeutique',
  },
  {
    id: '5',
    nom: 'Douleurs lombaires',
    motif: 'Douleurs bas du dos',
    symptomes: 'Douleurs lombaires, raideur matinale',
    diagnostic: 'Lombalgie mécanique',
    traitement: 'AINS si douleur\nKinésithérapie\nExercices d\'étirement',
    examens: 'Radiographie lombaire',
    notes: 'Posture au travail, exercices réguliers',
  },
];
