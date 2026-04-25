/**
 * Fonctions d'export et backup des données
 */

/**
 * Exporte toutes les données au format JSON
 */
export const exportData = (patients, consultations, appointments) => {
  const data = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    patients,
    consultations,
    appointments,
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const date = new Date().toISOString().split('T')[0];
  link.download = `meditrack_backup_${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Importe des données depuis un fichier JSON
 */
export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Validation basique de la structure
        if (!data.patients || !Array.isArray(data.patients)) {
          throw new Error('Format de fichier invalide: patients manquant');
        }
        
        if (!data.consultations || !Array.isArray(data.consultations)) {
          throw new Error('Format de fichier invalide: consultations manquant');
        }
        
        if (!data.appointments || !Array.isArray(data.appointments)) {
          throw new Error('Format de fichier invalide: appointments manquant');
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsText(file);
  });
};

/**
 * Sauvegarde les données dans localStorage
 */
export const saveToLocalStorage = (patients, consultations, appointments) => {
  localStorage.setItem('patients', JSON.stringify(patients));
  localStorage.setItem('consultations', JSON.stringify(consultations));
  localStorage.setItem('appointments', JSON.stringify(appointments));
};

/**
 * Charge les données depuis localStorage
 */
export const loadFromLocalStorage = () => {
  const patients = JSON.parse(localStorage.getItem('patients') || '[]');
  const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  
  return { patients, consultations, appointments };
};

/**
 * Efface toutes les données localStorage
 */
export const clearAllData = () => {
  localStorage.removeItem('patients');
  localStorage.removeItem('consultations');
  localStorage.removeItem('appointments');
};

/**
 * Exporte uniquement les patients
 */
export const exportPatients = (patients) => {
  const data = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    patients,
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const date = new Date().toISOString().split('T')[0];
  link.download = `meditrack_patients_${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporte uniquement les consultations
 */
export const exportConsultations = (consultations) => {
  const data = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    consultations,
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const date = new Date().toISOString().split('T')[0];
  link.download = `meditrack_consultations_${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
