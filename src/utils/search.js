/**
 * Fonctions de recherche avancée
 */

/**
 * Recherche dans les patients
 */
export const searchPatients = (patients, query) => {
  if (!query || query.trim() === '') return patients;
  
  const lowerQuery = query.toLowerCase();
  
  return patients.filter((patient) => {
    return (
      patient.nom.toLowerCase().includes(lowerQuery) ||
      patient.prenom.toLowerCase().includes(lowerQuery) ||
      patient.telephone.includes(lowerQuery) ||
      patient.lieu.toLowerCase().includes(lowerQuery) ||
      patient.profession?.toLowerCase().includes(lowerQuery) ||
      patient.allergies?.toLowerCase().includes(lowerQuery) ||
      patient.antecedents?.toLowerCase().includes(lowerQuery)
    );
  });
};

/**
 * Recherche dans les consultations
 */
export const searchConsultations = (consultations, patients, query) => {
  if (!query || query.trim() === '') return consultations;
  
  const lowerQuery = query.toLowerCase();
  
  return consultations.filter((consultation) => {
    const patient = patients.find((p) => p.id === consultation.patientId);
    const patientName = patient ? `${patient.prenom} ${patient.nom}`.toLowerCase() : '';
    
    return (
      consultation.motif.toLowerCase().includes(lowerQuery) ||
      consultation.diagnostic?.toLowerCase().includes(lowerQuery) ||
      consultation.traitement?.toLowerCase().includes(lowerQuery) ||
      consultation.symptomes?.toLowerCase().includes(lowerQuery) ||
      consultation.examens?.toLowerCase().includes(lowerQuery) ||
      consultation.notes?.toLowerCase().includes(lowerQuery) ||
      patientName.includes(lowerQuery)
    );
  });
};

/**
 * Recherche dans les rendez-vous
 */
export const searchAppointments = (appointments, patients, query) => {
  if (!query || query.trim() === '') return appointments;
  
  const lowerQuery = query.toLowerCase();
  
  return appointments.filter((appointment) => {
    const patient = patients.find((p) => p.id === appointment.patientId);
    const patientName = patient ? `${patient.prenom} ${patient.nom}`.toLowerCase() : '';
    
    return (
      appointment.motif.toLowerCase().includes(lowerQuery) ||
      patientName.includes(lowerQuery)
    );
  });
};

/**
 * Recherche globale (patients + consultations + rendez-vous)
 */
export const globalSearch = (patients, consultations, appointments, query) => {
  const lowerQuery = query.toLowerCase();
  const results = {
    patients: [],
    consultations: [],
    appointments: [],
  };
  
  // Recherche patients
  results.patients = patients.filter((patient) => {
    return (
      patient.nom.toLowerCase().includes(lowerQuery) ||
      patient.prenom.toLowerCase().includes(lowerQuery) ||
      patient.telephone.includes(lowerQuery)
    );
  });
  
  // Recherche consultations
  results.consultations = consultations.filter((consultation) => {
    const patient = patients.find((p) => p.id === consultation.patientId);
    const patientName = patient ? `${patient.prenom} ${patient.nom}`.toLowerCase() : '';
    
    return (
      consultation.motif.toLowerCase().includes(lowerQuery) ||
      consultation.diagnostic?.toLowerCase().includes(lowerQuery) ||
      patientName.includes(lowerQuery)
    );
  });
  
  // Recherche rendez-vous
  results.appointments = appointments.filter((appointment) => {
    const patient = patients.find((p) => p.id === appointment.patientId);
    const patientName = patient ? `${patient.prenom} ${patient.nom}`.toLowerCase() : '';
    
    return (
      appointment.motif.toLowerCase().includes(lowerQuery) ||
      patientName.includes(lowerQuery)
    );
  });
  
  return results;
};

/**
 * Filtre les patients par critères multiples
 */
export const filterPatients = (patients, filters) => {
  return patients.filter((patient) => {
    // Filtre par sexe
    if (filters.sexe && filters.sexe !== 'all' && patient.sexe !== filters.sexe) {
      return false;
    }
    
    // Filtre par statut
    if (filters.statut && filters.statut !== 'all' && patient.statut !== filters.statut) {
      return false;
    }
    
    // Filtre par ville
    if (filters.ville && filters.ville.trim() !== '') {
      const lowerVille = filters.ville.toLowerCase();
      if (!patient.lieu.toLowerCase().includes(lowerVille)) {
        return false;
      }
    }
    
    // Filtre par groupe sanguin
    if (filters.groupeSanguin && filters.groupeSanguin !== 'all' && patient.groupeSanguin !== filters.groupeSanguin) {
      return false;
    }
    
    return true;
  });
};

/**
 * Trie les patients
 */
export const sortPatients = (patients, sortBy, sortOrder = 'asc') => {
  const sorted = [...patients];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'nom':
        comparison = a.nom.localeCompare(b.nom);
        break;
      case 'prenom':
        comparison = a.prenom.localeCompare(b.prenom);
        break;
      case 'dateNaissance':
        comparison = new Date(a.dateNaissance) - new Date(b.dateNaissance);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      case 'statut':
        comparison = a.statut.localeCompare(b.statut);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
  
  return sorted;
};
