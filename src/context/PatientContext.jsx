import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { samplePatients, sampleConsultations, sampleAppointments } from '../data/sampleData';
import { sampleDoctors } from '../data/sampleDoctors';
import { sampleConsultationTemplates } from '../data/sampleTemplates';
import { sampleMedications } from '../data/sampleMedications';
import { createHistoryEntry, saveHistory, getObjectChanges, getEntityHistory, getAllHistory, formatHistoryEntry } from '../utils/history';
import { api } from '../services/api';

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pData, cData, aData] = await Promise.all([
          api.getPatients({ limit: 1000 }).catch(() => null),
          api.getConsultations({ limit: 1000 }).catch(() => null),
          api.getAppointments().catch(() => null),
        ]);

        if (pData) setPatients(pData.patients);
        if (cData) setConsultations(cData.consultations);
        if (aData) setAppointments(aData);
      } catch {
        const storedPatients = localStorage.getItem('patients_backup');
        if (storedPatients) {
          setPatients(JSON.parse(storedPatients));
          setConsultations(JSON.parse(localStorage.getItem('consultations_backup') || '[]'));
          setAppointments(JSON.parse(localStorage.getItem('appointments_backup') || '[]'));
        } else {
          setPatients(samplePatients);
          setConsultations(sampleConsultations);
          setAppointments(sampleAppointments);
        }
      }
    };

    loadData();

    const storedDoctors = localStorage.getItem('doctors');
    const storedCurrentDoctor = localStorage.getItem('currentDoctor');
    const storedTemplates = localStorage.getItem('consultationTemplates');
    const storedMedications = localStorage.getItem('medications');
    const storedVitalSigns = localStorage.getItem('vitalSigns');
    const storedMedicationReminders = localStorage.getItem('medicationReminders');

    if (storedDoctors) {
      setDoctors(JSON.parse(storedDoctors));
    } else {
      setDoctors(sampleDoctors);
      localStorage.setItem('doctors', JSON.stringify(sampleDoctors));
    }

    if (!storedCurrentDoctor && sampleDoctors.length > 0) {
      setCurrentDoctor(sampleDoctors[0]);
    } else if (storedCurrentDoctor) {
      setCurrentDoctor(JSON.parse(storedCurrentDoctor));
    }

    if (storedTemplates) {
      setConsultationTemplates(JSON.parse(storedTemplates));
    } else {
      setConsultationTemplates(sampleConsultationTemplates);
    }

    if (storedMedications) {
      setMedications(JSON.parse(storedMedications));
    } else {
      setMedications(sampleMedications);
    }

    if (storedVitalSigns) {
      setVitalSigns(JSON.parse(storedVitalSigns));
    }

    if (storedMedicationReminders) {
      setMedicationReminders(JSON.parse(storedMedicationReminders));
    }
  }, []);

  const addPatient = async (patientData) => {
    const data = {
      nom: patientData.nom,
      prenom: patientData.prenom,
      date_naissance: patientData.dateNaissance,
      sexe: patientData.sexe,
      telephone: patientData.telephone,
      telephone_secondaire: patientData.telephoneSecondaire || '',
      lieu: patientData.lieu,
      profession: patientData.profession || '',
      groupe_sanguin: patientData.groupeSanguin,
      allergies: patientData.allergies || '',
      antecedents: patientData.antecedents || '',
      statut: patientData.statut || 'Actif',
    };

    try {
      const patient = await api.createPatient(data);
      const mapped = { ...patient, id: String(patient.id), dateNaissance: patient.date_naissance, telephoneSecondaire: patient.telephone_secondaire, groupeSanguin: patient.groupe_sanguin, createdAt: patient.created_at };
      setPatients(prev => [...prev, mapped]);
      return mapped;
    } catch (err) {
      const newPatient = {
        ...patientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setPatients(prev => [...prev, newPatient]);
      return newPatient;
    }
  };

  const updatePatient = async (id, patientData) => {
    const data = {
      nom: patientData.nom,
      prenom: patientData.prenom,
      date_naissance: patientData.dateNaissance,
      sexe: patientData.sexe,
      telephone: patientData.telephone,
      telephone_secondaire: patientData.telephoneSecondaire || '',
      lieu: patientData.lieu,
      profession: patientData.profession || '',
      groupe_sanguin: patientData.groupeSanguin,
      allergies: patientData.allergies || '',
      antecedents: patientData.antecedents || '',
      statut: patientData.statut || 'Actif',
    };

    try {
      const patient = await api.updatePatient(id, data);
      const mapped = { ...patient, id: String(patient.id), dateNaissance: patient.date_naissance, telephoneSecondaire: patient.telephone_secondaire, groupeSanguin: patient.groupe_sanguin, createdAt: patient.created_at };
      setPatients(prev => prev.map(p => p.id === id ? mapped : p));
      return mapped;
    } catch {
      setPatients(prev => prev.map(p => p.id === id ? { ...p, ...patientData } : p));
    }
  };

  const deletePatient = async (id) => {
    try {
      await api.deletePatient(id);
    } catch {}
    setPatients(prev => prev.filter(p => p.id !== id));
    setConsultations(prev => prev.filter(c => c.patient_id !== id));
    setAppointments(prev => prev.filter(a => a.patient_id !== id));
  };

  const getPatient = (id) => {
    return patients.find(p => String(p.id) === String(id));
  };

  const addConsultation = async (consultationData) => {
    const data = {
      patient_id: consultationData.patientId,
      date: consultationData.date || new Date().toISOString(),
      motif: consultationData.motif,
      symptomes: consultationData.symptomes || '',
      diagnostic: consultationData.diagnostic,
      traitement: consultationData.traitement || '',
      examens: consultationData.examens || '',
      notes: consultationData.notes || '',
      prochain_rendez_vous: consultationData.prochainRendezVous || '',
    };

    try {
      const consultation = await api.createConsultation(data);
      const mapped = { ...consultation, id: String(consultation.id), patientId: consultation.patient_id, prochainRendezVous: consultation.prochain_rendez_vous };
      setConsultations(prev => [...prev, mapped]);
      return mapped;
    } catch (err) {
      const newConsultation = {
        ...consultationData,
        id: Date.now().toString(),
      };
      setConsultations(prev => [...prev, newConsultation]);
      return newConsultation;
    }
  };

  const getPatientConsultations = (patientId) => {
    return consultations
      .filter(c => String(c.patientId || c.patient_id) === String(patientId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const addAppointment = async (appointmentData) => {
    const data = {
      patient_id: appointmentData.patientId,
      date: appointmentData.date,
      heure: appointmentData.heure,
      motif: appointmentData.motif,
    };

    try {
      const appointment = await api.createAppointment(data);
      const mapped = { ...appointment, id: String(appointment.id), patientId: appointment.patient_id };
      setAppointments(prev => [...prev, mapped]);
      return mapped;
    } catch (err) {
      const newAppointment = {
        ...appointmentData,
        id: Date.now().toString(),
      };
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    }
  };

  const getTodayAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    return appointments.filter((a) => {
      const d = a.date ? a.date.split('T')[0] : a.date;
      return d === todayStr;
    });
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter((a) => (a.date ? a.date.split('T')[0] : a.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  };

  const getMonthAppointments = (year, month) => {
    return appointments.filter((a) => {
      const date = new Date(a.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  const getStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const todayConsultations = consultations.filter((c) => {
      const d = c.date ? c.date.split('T')[0] : c.date;
      return d === todayStr;
    });

    const thisMonthPatients = patients.filter((p) => {
      const pDate = new Date(p.createdAt || p.created_at);
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

  const addDoctor = (doctorData) => {
    const newDoctor = {
      ...doctorData,
      id: Date.now().toString(),
      actif: true,
    };
    const updatedDoctors = [...doctors, newDoctor];
    setDoctors(updatedDoctors);
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
    return newDoctor;
  };

  const updateDoctor = (id, doctorData) => {
    const updatedDoctors = doctors.map((d) =>
      d.id === id ? { ...d, ...doctorData } : d
    );
    setDoctors(updatedDoctors);
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
    if (currentDoctor && currentDoctor.id === id) {
      const updatedCurrent = updatedDoctors.find((d) => d.id === id);
      setCurrentDoctor(updatedCurrent);
      localStorage.setItem('currentDoctor', JSON.stringify(updatedCurrent));
    }
  };

  const deleteDoctor = (id) => {
    const updatedDoctors = doctors.filter((d) => d.id !== id);
    setDoctors(updatedDoctors);
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
    if (currentDoctor && currentDoctor.id === id) {
      const newCurrent = updatedDoctors[0] || null;
      setCurrentDoctor(newCurrent);
      localStorage.setItem('currentDoctor', JSON.stringify(newCurrent));
    }
  };

  const switchDoctor = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (doctor) {
      setCurrentDoctor(doctor);
      localStorage.setItem('currentDoctor', JSON.stringify(doctor));
    }
  };

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

  const addConsultationTemplate = (templateData) => {
    const newTemplate = {
      ...templateData,
      id: Date.now().toString(),
    };
    const updatedTemplates = [...consultationTemplates, newTemplate];
    setConsultationTemplates(updatedTemplates);
    localStorage.setItem('consultationTemplates', JSON.stringify(updatedTemplates));
    return newTemplate;
  };

  const updateConsultationTemplate = (id, templateData) => {
    const updatedTemplates = consultationTemplates.map((t) =>
      t.id === id ? { ...t, ...templateData } : t
    );
    setConsultationTemplates(updatedTemplates);
    localStorage.setItem('consultationTemplates', JSON.stringify(updatedTemplates));
  };

  const deleteConsultationTemplate = (id) => {
    const updatedTemplates = consultationTemplates.filter((t) => t.id !== id);
    setConsultationTemplates(updatedTemplates);
    localStorage.setItem('consultationTemplates', JSON.stringify(updatedTemplates));
  };

  const addMedication = (medicationData) => {
    const newMedication = {
      ...medicationData,
      id: Date.now().toString(),
    };
    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    localStorage.setItem('medications', JSON.stringify(updatedMedications));
    return newMedication;
  };

  const updateMedication = (id, medicationData) => {
    const updatedMedications = medications.map((m) =>
      m.id === id ? { ...m, ...medicationData } : m
    );
    setMedications(updatedMedications);
    localStorage.setItem('medications', JSON.stringify(updatedMedications));
  };

  const deleteMedication = (id) => {
    const updatedMedications = medications.filter((m) => m.id !== id);
    setMedications(updatedMedications);
    localStorage.setItem('medications', JSON.stringify(updatedMedications));
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

  const addVitalSign = (vitalSignData) => {
    const newVitalSign = {
      ...vitalSignData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updatedVitalSigns = [...vitalSigns, newVitalSign];
    setVitalSigns(updatedVitalSigns);
    localStorage.setItem('vitalSigns', JSON.stringify(updatedVitalSigns));
    return newVitalSign;
  };

  const updateVitalSign = (id, vitalSignData) => {
    const updatedVitalSigns = vitalSigns.map((v) =>
      v.id === id ? { ...v, ...vitalSignData } : v
    );
    setVitalSigns(updatedVitalSigns);
    localStorage.setItem('vitalSigns', JSON.stringify(updatedVitalSigns));
  };

  const deleteVitalSign = (id) => {
    const updatedVitalSigns = vitalSigns.filter((v) => v.id !== id);
    setVitalSigns(updatedVitalSigns);
    localStorage.setItem('vitalSigns', JSON.stringify(updatedVitalSigns));
  };

  const getPatientVitalSigns = (patientId) => {
    return vitalSigns
      .filter((v) => v.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const addMedicationReminder = (reminderData) => {
    const newReminder = {
      ...reminderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      active: true,
    };
    const updatedReminders = [...medicationReminders, newReminder];
    setMedicationReminders(updatedReminders);
    localStorage.setItem('medicationReminders', JSON.stringify(updatedReminders));
    return newReminder;
  };

  const updateMedicationReminder = (id, reminderData) => {
    const updatedReminders = medicationReminders.map((r) =>
      r.id === id ? { ...r, ...reminderData } : r
    );
    setMedicationReminders(updatedReminders);
    localStorage.setItem('medicationReminders', JSON.stringify(updatedReminders));
  };

  const deleteMedicationReminder = (id) => {
    const updatedReminders = medicationReminders.filter((r) => r.id !== id);
    setMedicationReminders(updatedReminders);
    localStorage.setItem('medicationReminders', JSON.stringify(updatedReminders));
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
