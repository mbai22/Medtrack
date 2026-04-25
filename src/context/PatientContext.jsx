import React, { createContext, useContext, useState, useEffect } from 'react';
import { samplePatients, sampleConsultations, sampleAppointments } from '../data/sampleData';

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

  // Initialiser avec les données de localStorage ou les données d'exemple
  useEffect(() => {
    const storedPatients = localStorage.getItem('patients');
    const storedConsultations = localStorage.getItem('consultations');
    const storedAppointments = localStorage.getItem('appointments');

    if (!storedPatients) {
      // Première utilisation : charger les données d'exemple
      setPatients(samplePatients);
      localStorage.setItem('patients', JSON.stringify(samplePatients));
    } else {
      setPatients(JSON.parse(storedPatients));
    }

    if (!storedConsultations) {
      setConsultations(sampleConsultations);
      localStorage.setItem('consultations', JSON.stringify(sampleConsultations));
    } else {
      setConsultations(JSON.parse(storedConsultations));
    }

    if (!storedAppointments) {
      setAppointments(sampleAppointments);
      localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
    } else {
      setAppointments(JSON.parse(storedAppointments));
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
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    return newPatient;
  };

  // Mettre à jour un patient
  const updatePatient = (id, patientData) => {
    const updatedPatients = patients.map((p) =>
      p.id === id ? { ...p, ...patientData } : p
    );
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
  };

  // Supprimer un patient
  const deletePatient = (id) => {
    const updatedPatients = patients.filter((p) => p.id !== id);
    const updatedConsultations = consultations.filter((c) => c.patientId !== id);
    const updatedAppointments = appointments.filter((a) => a.patientId !== id);

    setPatients(updatedPatients);
    setConsultations(updatedConsultations);
    setAppointments(updatedAppointments);

    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    localStorage.setItem('consultations', JSON.stringify(updatedConsultations));
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
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
    localStorage.setItem('consultations', JSON.stringify(updatedConsultations));
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
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
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

  const value = {
    patients,
    consultations,
    appointments,
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
  };

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
};
