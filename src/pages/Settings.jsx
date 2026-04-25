import React, { useState } from 'react';
import { CloudArrowDownIcon, CloudArrowUpIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { usePatientContext } from '../context/PatientContext';
import { exportData, importData, clearAllData } from '../utils/backup';

const Settings = () => {
  const { patients, consultations, appointments, setPatients, setConsultations, setAppointments } = usePatientContext();
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExportAll = () => {
    exportData(patients, consultations, appointments);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportError('');
    setImportSuccess('');

    try {
      const data = await importData(file);
      
      // Confirmation avant import
      if (confirm(`Vous êtes sur le point d'importer ${data.patients.length} patients, ${data.consultations.length} consultations et ${data.appointments.length} rendez-vous. Les données existantes seront remplacées. Continuer ?`)) {
        setPatients(data.patients);
        setConsultations(data.consultations);
        setAppointments(data.appointments);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('patients', JSON.stringify(data.patients));
        localStorage.setItem('consultations', JSON.stringify(data.consultations));
        localStorage.setItem('appointments', JSON.stringify(data.appointments));
        
        setImportSuccess('Données importées avec succès !');
        setTimeout(() => setImportSuccess(''), 3000);
      }
    } catch (error) {
      setImportError(error.message || 'Erreur lors de l\'import des données');
    }
    
    // Reset input
    event.target.value = '';
  };

  const handleClearAll = () => {
    if (confirm('ATTENTION: Cette action va supprimer TOUTES les données (patients, consultations, rendez-vous). Cette action est irréversible. Êtes-vous sûr ?')) {
      clearAllData();
      setPatients([]);
      setConsultations([]);
      setAppointments([]);
      setShowClearConfirm(false);
      alert('Toutes les données ont été supprimées.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Paramètres</h1>

      {/* Statistiques de stockage */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">État des données</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Patients</p>
            <p className="text-2xl font-bold text-primary">{patients.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Consultations</p>
            <p className="text-2xl font-bold text-primary">{consultations.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Rendez-vous</p>
            <p className="text-2xl font-bold text-primary">{appointments.length}</p>
          </div>
        </div>
      </div>

      {/* Export / Import */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Sauvegarde et Restauration</h2>
        
        <div className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <h3 className="font-semibold text-green-800">Exporter toutes les données</h3>
              <p className="text-sm text-green-600">Téléchargez un fichier JSON contenant toutes vos données</p>
            </div>
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <CloudArrowDownIcon className="w-5 h-5" />
              Exporter
            </button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h3 className="font-semibold text-blue-800">Importer des données</h3>
              <p className="text-sm text-blue-600">Restaurez vos données depuis un fichier JSON</p>
            </div>
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <CloudArrowUpIcon className="w-5 h-5" />
                Importer
              </label>
            </div>
          </div>

          {/* Messages d'erreur/succès */}
          {importError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {importError}
            </div>
          )}
          {importSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {importSuccess}
            </div>
          )}
        </div>
      </div>

      {/* Zone dangereuse */}
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
        <h2 className="text-lg font-semibold text-danger mb-4 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5" />
          Zone dangereuse
        </h2>
        
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
          <div>
            <h3 className="font-semibold text-red-800">Supprimer toutes les données</h3>
            <p className="text-sm text-red-600">Cette action est irréversible</p>
          </div>
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
              Supprimer tout
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Confirmer
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info localStorage */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Toutes les données sont stockées localement dans votre navigateur (localStorage). 
          Si vous effacez les données du navigateur, vous perdrez toutes vos informations. 
          Pensez à faire des sauvegardes régulières.
        </p>
      </div>
    </div>
  );
};

export default Settings;
