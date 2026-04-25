import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { usePatientContext } from '../context/PatientContext';
import { formatDateForInput } from '../utils/helpers';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ConsultationForm = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { getPatient, addConsultation, patients } = usePatientContext();

  const [selectedPatientId, setSelectedPatientId] = useState(patientId || '');
  const [formData, setFormData] = useState({
    date: formatDateForInput(new Date()),
    motif: '',
    symptomes: '',
    diagnostic: '',
    traitement: '',
    examens: '',
    notes: '',
    prochainRendezVous: '',
  });

  const patient = getPatient(selectedPatientId);

  const handlePatientChange = (e) => {
    setSelectedPatientId(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedPatientId) {
      alert('Veuillez sélectionner un patient');
      return;
    }

    addConsultation({
      patientId: selectedPatientId,
      ...formData,
    });

    navigate(`/patients/${selectedPatientId}`);
  };

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.prenom} ${p.nom}`,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/consultations')}
          className="flex items-center text-accent hover:text-accent-hover font-semibold mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Retour aux consultations
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-primary mb-6">Nouvelle Consultation</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sélection du patient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient <span className="text-danger">*</span>
              </label>
              <select
                value={selectedPatientId}
                onChange={handlePatientChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Sélectionnez un patient</option>
                {patientOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {patient && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-primary">
                  {patient.prenom} {patient.nom}
                </p>
                <p className="text-sm text-gray-600">{patient.telephone}</p>
              </div>
            )}

            {/* Date de consultation */}
            <FormInput
              label="Date de consultation"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            {/* Motif */}
            <FormInput
              label="Motif de consultation"
              name="motif"
              value={formData.motif}
              onChange={handleChange}
              required
              placeholder="Ex: Visite de routine, migraine..."
            />

            {/* Symptômes */}
            <FormInput
              label="Symptômes"
              name="symptomes"
              type="textarea"
              value={formData.symptomes}
              onChange={handleChange}
              placeholder="Décrivez les symptômes présentés..."
            />

            {/* Diagnostic */}
            <FormInput
              label="Diagnostic"
              name="diagnostic"
              type="textarea"
              value={formData.diagnostic}
              onChange={handleChange}
              required
              placeholder="Diagnostic établi..."
            />

            {/* Traitement */}
            <FormInput
              label="Traitement / Ordonnance"
              name="traitement"
              type="textarea"
              value={formData.traitement}
              onChange={handleChange}
              placeholder="Médicaments, posologie, durée..."
            />

            {/* Examens */}
            <FormInput
              label="Examens demandés"
              name="examens"
              type="textarea"
              value={formData.examens}
              onChange={handleChange}
              placeholder="Ex: Bilan sanguin, radiographie..."
            />

            {/* Notes */}
            <FormInput
              label="Notes supplémentaires"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Observations additionnelles..."
            />

            {/* Prochain rendez-vous */}
            <FormInput
              label="Prochain rendez-vous (optionnel)"
              name="prochainRendezVous"
              type="date"
              value={formData.prochainRendezVous}
              onChange={handleChange}
            />

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Enregistrer la consultation
              </button>
              <button
                type="button"
                onClick={() => navigate('/consultations')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;
