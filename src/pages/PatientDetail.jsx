import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PencilIcon, PlusIcon, TrashIcon, ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { usePatientContext } from '../context/PatientContext';
import { getAge, formatDate, formatDateShort } from '../utils/helpers';
import { generateOrdonnancePDF, generatePatientSummaryPDF } from '../utils/pdfGenerator';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPatient, getPatientConsultations, deletePatient } = usePatientContext();

  const patient = getPatient(id);
  const consultations = getPatientConsultations(id);

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Patient non trouvé</h1>
          <Link to="/patients" className="text-accent hover:text-accent-hover">
            Retour à la liste des patients
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      deletePatient(id);
      navigate('/patients');
    }
  };

  const handleExportOrdonnance = (consultation) => {
    generateOrdonnancePDF(patient, consultation);
  };

  const handleExportDossier = () => {
    generatePatientSummaryPDF(patient, consultations);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* En-tête */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center text-accent hover:text-accent-hover font-semibold mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Retour aux patients
        </button>
      </div>

      {/* Carte patient */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {patient.prenom} {patient.nom}
            </h1>
            <p className="text-gray-600">
              {getAge(patient.dateNaissance)} ans • {patient.sexe}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportDossier}
              className="p-3 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg transition-colors"
              title="Exporter le dossier patient"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
            </button>
            <Link
              to={`/patients/${id}/modifier`}
              className="p-3 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-3 bg-red-100 text-danger hover:bg-red-200 rounded-lg transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Informations de contact</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Téléphone:</strong> {patient.telephone}
              </p>
              {patient.telephoneSecondaire && (
                <p>
                  <strong>Tél. secondaire:</strong> {patient.telephoneSecondaire}
                </p>
              )}
              <p>
                <strong>Lieu:</strong> {patient.lieu}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Informations médicales</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Groupe sanguin:</strong> {patient.groupeSanguin || 'Non spécifié'}
              </p>
              <p>
                <strong>Profession:</strong> {patient.profession || 'Non spécifiée'}
              </p>
              <p>
                <strong>Statut:</strong>{' '}
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    patient.statut === 'Actif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {patient.statut}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Allergies et antécédents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Allergies connues</h3>
            <p className="text-sm text-gray-600">
              {patient.allergies || 'Aucune allergue connue'}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Antécédents médicaux</h3>
            <p className="text-sm text-gray-600">
              {patient.antecedents || 'Aucun antécédent notable'}
            </p>
          </div>
        </div>
      </div>

      {/* Consultations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Historique des consultations</h2>
          <Link
            to={`/consultations/nouvelle/${id}`}
            className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Ajouter une consultation</span>
          </Link>
        </div>

        {consultations.length > 0 ? (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-primary">{consultation.motif}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(consultation.date)}
                    </p>
                  </div>
                  {consultation.traitement && (
                    <button
                      onClick={() => handleExportOrdonnance(consultation)}
                      className="p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg transition-colors"
                      title="Exporter l'ordonnance"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {consultation.symptomes && (
                    <div>
                      <strong className="text-gray-700">Symptômes:</strong>
                      <p className="text-gray-600">{consultation.symptomes}</p>
                    </div>
                  )}
                  {consultation.diagnostic && (
                    <div>
                      <strong className="text-gray-700">Diagnostic:</strong>
                      <p className="text-gray-600">{consultation.diagnostic}</p>
                    </div>
                  )}
                  {consultation.traitement && (
                    <div className="md:col-span-2">
                      <strong className="text-gray-700">Traitement:</strong>
                      <p className="text-gray-600">{consultation.traitement}</p>
                    </div>
                  )}
                  {consultation.examens && (
                    <div>
                      <strong className="text-gray-700">Examens:</strong>
                      <p className="text-gray-600">{consultation.examens}</p>
                    </div>
                  )}
                  {consultation.notes && (
                    <div>
                      <strong className="text-gray-700">Notes:</strong>
                      <p className="text-gray-600">{consultation.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune consultation enregistrée</p>
            <Link
              to={`/consultations/nouvelle/${id}`}
              className="text-accent hover:text-accent-hover font-semibold"
            >
              Ajouter la première consultation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
