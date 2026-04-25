import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { usePatientContext } from '../context/PatientContext';
import { formatDate } from '../utils/helpers';

const Consultations = () => {
  const { consultations, patients } = usePatientContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Trier les consultations par date décroissante
  const sortedConsultations = [...consultations].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Pagination
  const totalPages = Math.ceil(sortedConsultations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedConsultations = sortedConsultations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Consultations</h1>
            <p className="text-gray-600">Historique de toutes les consultations</p>
          </div>
          <Link
            to="/consultations/nouvelle"
            className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Nouvelle consultation</span>
          </Link>
        </div>
      </div>

      {/* Liste des consultations */}
      <div className="space-y-4">
        {displayedConsultations.length > 0 ? (
          displayedConsultations.map((consultation) => {
            const patient = patients.find((p) => p.id === consultation.patientId);
            return (
              <div
                key={consultation.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-primary text-lg">
                      {patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu'}
                    </h3>
                    <p className="text-sm text-gray-600">{formatDate(consultation.date)}</p>
                  </div>
                  <Link
                    to={`/patients/${consultation.patientId}`}
                    className="text-accent hover:text-accent-hover font-semibold text-sm"
                  >
                    Voir la fiche
                  </Link>
                </div>

                <div className="space-y-3">
                  <div>
                    <strong className="text-gray-700">Motif:</strong>
                    <p className="text-gray-600">{consultation.motif}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {consultation.diagnostic && (
                      <div>
                        <strong className="text-gray-700">Diagnostic:</strong>
                        <p className="text-gray-600">{consultation.diagnostic}</p>
                      </div>
                    )}
                    {consultation.traitement && (
                      <div>
                        <strong className="text-gray-700">Traitement:</strong>
                        <p className="text-gray-600">{consultation.traitement}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Aucune consultation enregistrée</p>
            <Link
              to="/consultations/nouvelle"
              className="text-accent hover:text-accent-hover font-semibold"
            >
              Ajouter la première consultation
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-accent text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default Consultations;
