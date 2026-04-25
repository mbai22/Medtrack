import { z } from 'zod';

// Schéma de validation pour un patient
export const patientSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  dateNaissance: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    return date < today;
  }, 'La date de naissance doit être dans le passé'),
  sexe: z.enum(['Homme', 'Femme'], { required_error: 'Le sexe est requis' }),
  telephone: z.string().regex(/^0[1-9]([-. ]?[0-9]{2}){4}$/, 'Numéro de téléphone invalide'),
  telephoneSecondaire: z.string().optional().or(z.literal('')),
  lieu: z.string().min(5, 'Le lieu d\'habitation doit contenir au moins 5 caractères'),
  profession: z.string().optional().or(z.literal('')),
  groupeSanguin: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    required_error: 'Le groupe sanguin est requis'
  }),
  allergies: z.string().optional().or(z.literal('')),
  antecedents: z.string().optional().or(z.literal('')),
  statut: z.enum(['Actif', 'Inactif'], { required_error: 'Le statut est requis' }),
});

// Schéma de validation pour une consultation
export const consultationSchema = z.object({
  patientId: z.string().min(1, 'Le patient est requis'),
  date: z.string().min(1, 'La date est requise'),
  motif: z.string().min(3, 'Le motif doit contenir au moins 3 caractères'),
  symptomes: z.string().optional().or(z.literal('')),
  diagnostic: z.string().min(3, 'Le diagnostic doit contenir au moins 3 caractères'),
  traitement: z.string().optional().or(z.literal('')),
  examens: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  prochainRendezVous: z.string().optional().or(z.literal('')),
});

// Schéma de validation pour un rendez-vous
export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Le patient est requis'),
  date: z.string().min(1, 'La date est requise'),
  heure: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Heure invalide (format HH:MM)'),
  motif: z.string().min(3, 'Le motif doit contenir au moins 3 caractères'),
});

// Schéma de validation pour un médecin
export const doctorSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  specialite: z.string().min(2, 'La spécialité doit contenir au moins 2 caractères'),
  telephone: z.string().regex(/^0[1-9]([-. ]?[0-9]{2}){4}$/, 'Numéro de téléphone invalide'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  rpps: z.string().min(11, 'Le numéro RPPS doit contenir 11 chiffres').max(11),
});

// Types inférés pour TypeScript (si le fichier est renommé en .ts)
// export type PatientFormData = z.infer<typeof patientSchema>;
// export type ConsultationFormData = z.infer<typeof consultationSchema>;
// export type AppointmentFormData = z.infer<typeof appointmentSchema>;
// export type DoctorFormData = z.infer<typeof doctorSchema>;
