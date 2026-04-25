import React, { createContext, useContext, useState, useEffect } from 'react';
import { samplePatients, sampleConsultations, sampleAppointments } from '../data/sampleData';
import { sampleDoctors } from '../data/sampleDoctors';
import { sampleConsultationTemplates } from '../data/sampleTemplates';
import { sampleMedications } from '../data/sampleMedications';
import { createHistoryEntry, saveHistory, getObjectChanges, getEntityHistory, getAllHistory, formatHistoryEntry } from '../utils/history';
import { saveEncrypted, loadEncrypted, getEncryptionKey } from '../utils/security';

const PatientContext = createContext();

export const usePatientContext = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatientContext must be used within PatientProvider');
  }
  return context;
};

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [consultationTemplates, setConsultationTemplates] = useState([]);
  const [medications, setMedications] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [medicationReminders, setMedicationReminders] = useState([]);

  // Initialiser avec les données de localStorage ou les données d'exemple
  useEffect(() => {
    const encryptionKey = getEncryptionKey();
    const storedPatients = loadEncrypted('patients', encryptionKey);
    const storedConsultations = loadEncrypted('consultations', encryptionKey);
    const storedAppointments = loadEncrypted('appointments', encryptionKey);
    const storedDoctors = loadEncrypted('doctors', encryptionKey);
    const storedCurrentDoctor = loadEncrypted('currentDoctor', encryptionKey);
    const storedTemplates = loadEncrypted('consultationTemplates', encryptionKey);
    const storedMedications = loadEncrypted('medications', encryptionKey);
    const storedVitalSigns = loadEncrypted('vitalSigns', encryptionKey);
    const storedMedicationReminders = loadEncrypted('medicationReminders', encryptionKey);

    if (!storedPatients) {
      // Première utilisation : charger les données d'exemple
      setPatients(samplePatients);
      saveEncrypted('patients', samplePatients, encryptionKey);
    } else {
      setPatients(storedPatients);
    }

    if (!storedConsultations) {
      setConsultations(sampleConsultations);
      saveEncrypted('consultations', sampleConsultations, encryptionKey);
    } else {
      setConsultations(storedConsultations);
    }

    if (!storedAppointments) {
      setAppointments(sampleAppointments);
      saveEncrypted('appointments', sampleAppointments, encryptionKey);
    } else {
      setAppointments(storedAppointments);
    }

    if (!storedDoctors) {
      setDoctors(sampleDoctors);
      saveEncrypted('doctors', sampleDoctors, encryptionKey);
      // Définir le premier médecin comme médecin actuel par défaut
      setCurrentDoctor(sampleDoctors[0]);
      saveEncrypted('currentDoctor', sampleDoctors[0], encryptionKey);
    } else {
      setDoctors(storedDoctors);
    }

    if (storedCurrentDoctor) {
      setCurrentDoctor(storedCurrentDoctor);
    }

    if (!storedTemplates) {
      setConsultationTemplates(sampleConsultationTemplates);
      saveEncrypted('consultationTemplates', sampleConsultationTemplates, encryptionKey);
    } else {
      setConsultationTemplates(storedTemplates);
    }

    if (!storedMedications) {
      setMedications(sampleMedications);
      saveEncrypted('medications', sampleMedications, encryptionKey);
    } else {
      setMedications(storedMedications);
    }

    if (!storedVitalSigns) {
      setVitalSigns([]);
      saveEncrypted('vitalSigns', [], encryptionKey);
    } else {
      setVitalSigns(storedVitalSigns);
    }

    if (!storedMedicationReminders) {
      setMedicationReminders([]);
      saveEncrypted('medicationReminders', [], encryptionKey);
    } else {
      setMedicationReminders(storedMedicationReminders);
    }
  }, []);

  // Ajouter un patient
  const addPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    saveEncrypted('patients', updatedPatients, getEncryptionKey());
    const historyEntry = createHistoryEntry('patient', newPatient.id, 'create', { new: newPatient }, currentDoctor?.id);
    saveHistory(historyEntry);
    return newPatient;
  };

  // Mettre à jour un patient
  const updatePatient = (id, patientData) => {
    const oldPatient = patients.find((p) => p.id === id);
    const updatedPatients = patients.map((p) =>
      p.id === id ? { ...p, ...patientData } : p
    );
    setPatients(updatedPatients);
    saveEncrypted('patients', updatedPatients, getEncryptionKey());
    
    // Enregistrer l'historique
    if (oldPatient) {
      const changes = getObjectChanges(oldPatient, patientData);
      const historyEntry = createHistoryEntry('patient', id, 'update', changes, currentDoctor?.id);
      saveHistory(historyEntry);
    }
  };

  // Supprimer un patient
  const deletePatient = (id) => {
    const oldPatient = patients.find((p) => p.id === id);
    const updatedPatients = patients.filter((p) => p.id !== id);
    const updatedConsultations = consultations.filter((c) => c.patientId !== id);
    const updatedAppointments = appointments.filter((a) => a.patientId !== id);

    setPatients(updatedPatients);
    setConsultations(updatedConsultations);
    setAppointments(updatedAppointments);

    saveEncrypted('patients', updatedPatients, getEncryptionKey());
    saveEncrypted('consultations', updatedConsultations, getEncryptionKey());
    saveEncrypted('appointments', updatedAppointments, getEncryptionKey());
    
    // Enregistrer l'historique
    if (oldPatient) {
      const historyEntry = createHistoryEntry('patient', id, 'delete', { old: oldPatient }, currentDoctor?.id);
      saveHistory(historyEntry);
    }
  };

  // Obtenir un patient par ID
  const getPatient = (id) => {
    return patients.find((p) => p.id === id);
  };

  // Ajouter une consultation
  const addConsultation = (consultationData) => {
    const newConsultation = {
      ...consultationData,
      id: Date.now().toString(),
    };
    const updatedConsultations = [...consultations, newConsultation];
    setConsultations(updatedConsultations);
    saveEncrypted('consultations', updatedConsultations, getEncryptionKey());
    
    // Enregistrer l'historique
    const historyEntry = createHistoryEntry('consultation', newConsultation.id, 'create', { new: newConsultation }, currentDoctor?.id);
    saveHistory(historyEntry);
    
    return newConsultation;
  };

  // Obtenir les consultations d'un patient
  const getPatientConsultations = (patientId) => {
    return consultations
      .filter((c) => c.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Ajouter un rendez-vous
  const addAppointment = (appointmentData) => {
    const newAppointment = {
      ...appointmentData,
      id: Date.now().toString(),
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    saveEncrypted('appointments', updatedAppointments, getEncryptionKey());
    
    // Enregistrer l'historique
    const historyEntry = createHistoryEntry('appointment', newAppointment.id, 'create', { new: newAppointment }, currentDoctor?.id);
    saveHistory(historyEntry);
    
    return newAppointment;
  };

  // Obtenir les rendez-vous du jour
  const getTodayAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter((a) => {
      const appDate = new Date(a.date);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === today.getTime();
    });
  };

  // Obtenir les rendez-vous à venir
  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments
      .filter((a) => new Date(a.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  };

  // Obtenir les rendez-vous d'un mois spécifique
  const getMonthAppointments = (year, month) => {
    return appointments.filter((a) => {
      const date = new Date(a.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  // Statistiques
  const getStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayConsultations = consultations.filter((c) => {
      const cDate = new Date(c.date);
      cDate.setHours(0, 0, 0, 0);
      return cDate.getTime() === today.getTime();
    });

    const thisMonthPatients = patients.filter((p) => {
      const pDate = new Date(p.createdAt);
      return (
        pDate.getFullYear() === today.getFullYear() &&
        pDate.getMonth() === today.getMonth()
      );
    });

    return {
      totalPatients: patients.length,
      consultationsToday: todayConsultations.length,
      newPatientsThisMonth: thisMonthPatients.length,
      upcomingAppointments: getUpcomingAppointments().length,
    };
  };

  // Gestion des médecins
  const addDoctor = (doctorData) => {
    const newDoctor = {
      ...doctorData,
      id: Date.now().toString(),
      actif: true,
    };
    const updatedDoctors = [...doctors, newDoctor];
    setDoctors(updatedDoctors);
    saveEncrypted('doctors', updatedDoctors, getEncryptionKey());
    return newDoctor;
  };

  const updateDoctor = (id, doctorData) => {
    const updatedDoctors = doctors.map((d) =>
      d.id === id ? { ...d, ...doctorData } : d
    );
    setDoctors(updatedDoctors);
    saveEncrypted('doctors', updatedDoctors, getEncryptionKey());
    
    // Si c'est le médecin actuel qui est modifié, mettre à jour aussi
    if (currentDoctor && currentDoctor.id === id) {
      const updatedCurrent = updatedDoctors.find((d) => d.id === id);
      setCurrentDoctor(updatedCurrent);
      saveEncrypted('currentDoctor', updatedCurrent, getEncryptionKey());
    }
  };

  const deleteDoctor = (id) => {
    const updatedDoctors = doctors.filter((d) => d.id !== id);
    setDoctors(updatedDoctors);
    saveEncrypted('doctors', updatedDoctors, getEncryptionKey());
    
    // Si c'était le médecin actuel, changer pour un autre
    if (currentDoctor && currentDoctor.id === id) {
      const newCurrent = updatedDoctors[0] || null;
      setCurrentDoctor(newCurrent);
      saveEncrypted('currentDoctor', newCurrent, getEncryptionKey());
    }
  };

  const switchDoctor = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (doctor) {
      setCurrentDoctor(doctor);
      saveEncrypted('currentDoctor', doctor, getEncryptionKey());
    }
  };

  // Fonctions d'historique
  const getPatientHistory = (patientId) => {
    const history = getEntityHistory('patient', patientId);
    return history.map(formatHistoryEntry);
  };

  const getConsultationHistory = (consultationId) => {
    const history = getEntityHistory('consultation', consultationId);
    return history.map(formatHistoryEntry);
  };

  const getAppointmentHistory = (appointmentId) => {
    const history = getEntityHistory('appointment', appointmentId);
    return history.map(formatHistoryEntry);
  };

  const getGlobalHistory = (limit = 100) => {
    const history = getAllHistory(limit);
    return history.map(formatHistoryEntry);
  };

  // Gestion des modèles de consultations
  const addConsultationTemplate = (templateData) => {
    const newTemplate = {
      ...templateData,
      id: Date.now().toString(),
    };
    const updatedTemplates = [...consultationTemplates, newTemplate];
    setConsultationTemplates(updatedTemplates);
    saveEncrypted('consultationTemplates', updatedTemplates, getEncryptionKey());
    return newTemplate;
  };

  const updateConsultationTemplate = (id, templateData) => {
    const updatedTemplates = consultationTemplates.map((t) =>
      t.id === id ? { ...t, ...templateData } : t
    );
    setConsultationTemplates(updatedTemplates);
    saveEncrypted('consultationTemplates', updatedTemplates, getEncryptionKey());
  };

  const deleteConsultationTemplate = (id) => {
    const updatedTemplates = consultationTemplates.filter((t) => t.id !== id);
    setConsultationTemplates(updatedTemplates);
    saveEncrypted('consultationTemplates', updatedTemplates, getEncryptionKey());
  };

  // Gestion des médicaments
  const addMedication = (medicationData) => {
    const newMedication = {
      ...medicationData,
      id: Date.now().toString(),
    };
    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    saveEncrypted('medications', updatedMedications, getEncryptionKey());
    return newMedication;
  };

  const updateMedication = (id, medicationData) => {
    const updatedMedications = medications.map((m) =>
      m.id === id ? { ...m, ...medicationData } : m
    );
    setMedications(updatedMedications);
    saveEncrypted('medications', updatedMedications, getEncryptionKey());
  };

  const deleteMedication = (id) => {
    const updatedMedications = medications.filter((m) => m.id !== id);
    setMedications(updatedMedications);
    saveEncrypted('medications', updatedMedications, getEncryptionKey());
  };

  const searchMedications = (query) => {
    if (!query) return medications;
    const lowerQuery = query.toLowerCase();
    return medications.filter(
      (m) =>
        m.nom.toLowerCase().includes(lowerQuery) ||
        m.classe.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery)
    );
  };

  // Gestion des constantes vitales
  const addVitalSign = (vitalSignData) => {
    const newVitalSign = {
      ...vitalSignData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updatedVitalSigns = [...vitalSigns, newVitalSign];
    setVitalSigns(updatedVitalSigns);
    saveEncrypted('vitalSigns', updatedVitalSigns, getEncryptionKey());
    return newVitalSign;
  };

  const updateVitalSign = (id, vitalSignData) => {
    const updatedVitalSigns = vitalSigns.map((v) =>
      v.id === id ? { ...v, ...vitalSignData } : v
    );
    setVitalSigns(updatedVitalSigns);
    saveEncrypted('vitalSigns', updatedVitalSigns, getEncryptionKey());
  };

  const deleteVitalSign = (id) => {
    const updatedVitalSigns = vitalSigns.filter((v) => v.id !== id);
    setVitalSigns(updatedVitalSigns);
    saveEncrypted('vitalSigns', updatedVitalSigns, getEncryptionKey());
  };

  const getPatientVitalSigns = (patientId) => {
    return vitalSigns
      .filter((v) => v.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Gestion des rappels de médicaments
  const addMedicationReminder = (reminderData) => {
    const newReminder = {
      ...reminderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      active: true,
    };
    const updatedReminders = [...medicationReminders, newReminder];
    setMedicationReminders(updatedReminders);
    saveEncrypted('medicationReminders', updatedReminders, getEncryptionKey());
    return newReminder;
  };

  const updateMedicationReminder = (id, reminderData) => {
    const updatedReminders = medicationReminders.map((r) =>
      r.id === id ? { ...r, ...reminderData } : r
    );
    setMedicationReminders(updatedReminders);
    saveEncrypted('medicationReminders', updatedReminders, getEncryptionKey());
  };

  const deleteMedicationReminder = (id) => {
    const updatedReminders = medicationReminders.filter((r) => r.id !== id);
    setMedicationReminders(updatedReminders);
    saveEncrypted('medicationReminders', updatedReminders, getEncryptionKey());
  };

  const getPatientMedicationReminders = (patientId) => {
    return medicationReminders
      .filter((r) => r.patientId === patientId && r.active)
      .sort((a, b) => new Date(a.nextDose) - new Date(b.nextDose));
  };

  const getDueMedicationReminders = () => {
    const now = new Date();
    return medicationReminders.filter((r) => {
      if (!r.active) return false;
      const nextDose = new Date(r.nextDose);
      return nextDose <= now;
    });
  };

  const value = {
    patients,
    consultations,
    appointments,
    doctors,
    currentDoctor,
    consultationTemplates,
    medications,
    vitalSigns,
    medicationReminders,
    setPatients,
    setConsultations,
    setAppointments,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    addConsultation,
    getPatientConsultations,
    addAppointment,
    getTodayAppointments,
    getUpcomingAppointments,
    getMonthAppointments,
    getStats,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    switchDoctor,
    getPatientHistory,
    getConsultationHistory,
    getAppointmentHistory,
    getGlobalHistory,
    addConsultationTemplate,
    updateConsultationTemplate,
    deleteConsultationTemplate,
    addMedication,
    updateMedication,
    deleteMedication,
    searchMedications,
    addVitalSign,
    updateVitalSign,
    deleteVitalSign,
    getPatientVitalSigns,
    addMedicationReminder,
    updateMedicationReminder,
    deleteMedicationReminder,
    getPatientMedicationReminders,
    getDueMedicationReminders,
  };

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
};
