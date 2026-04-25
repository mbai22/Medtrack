import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { usePatientContext } from '../context/PatientContext';
import { formatDateForInput } from '../utils/helpers';
import { patientSchema } from '../validations/schemas';

const sexOptions = ['Homme', 'Femme'];
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientForm = ({ patient = null }) => {
  const navigate = useNavigate();
  const { addPatient, updatePatient } = usePatientContext();
  const isEditing = !!patient;

  const [formData, setFormData] = useState({
    nom: patient?.nom || '',
    prenom: patient?.prenom || '',
    dateNaissance: patient?.dateNaissance || '',
    sexe: patient?.sexe || '',
    telephone: patient?.telephone || '',
    telephoneSecondaire: patient?.telephoneSecondaire || '',
    lieu: patient?.lieu || '',
    profession: patient?.profession || '',
    groupeSanguin: patient?.groupeSanguin || '',
    allergies: patient?.allergies || '',
    antecedents: patient?.antecedents || '',
    statut: patient?.statut || 'Actif',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation avec Zod
    try {
      patientSchema.parse(formData);
      setErrors({});
      
      if (isEditing) {
        updatePatient(patient.id, formData);
        navigate(`/patients/${patient.id}`);
      } else {
        const newPatient = addPatient(formData);
        navigate(`/patients/${newPatient.id}`);
      }
    } catch (error) {
      if (error.errors) {
        const errorMap = {};
        error.errors.forEach((err) => {
          errorMap[err.path[0]] = err.message;
        });
        setErrors(errorMap);
      }
    }
  };

  const handleCancel = () => {
    navigate(isEditing ? `/patients/${patient.id}` : '/patients');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-primary mb-6">
          {isEditing ? 'Modifier le Patient' : 'Ajouter un Nouveau Patient'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              placeholder="Dupont"
              error={errors.nom}
            />
            <FormInput
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              placeholder="Alice"
              error={errors.prenom}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Date de naissance"
              name="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={handleChange}
              required
              error={errors.dateNaissance}
            />
            <FormInput
              label="Sexe"
              name="sexe"
              type="select"
              value={formData.sexe}
              onChange={handleChange}
              options={sexOptions}
              required
              error={errors.sexe}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Téléphone"
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              required
              placeholder="06 12 34 56 78"
              error={errors.telephone}
            />
            <FormInput
              label="Téléphone secondaire"
              name="telephoneSecondaire"
              type="tel"
              value={formData.telephoneSecondaire}
              onChange={handleChange}
              placeholder="06 98 76 54 32"
              error={errors.telephoneSecondaire}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Lieu d'habitation"
              name="lieu"
              value={formData.lieu}
              onChange={handleChange}
              required
              placeholder="Paris, 15e arrondissement"
              error={errors.lieu}
            />
            <FormInput
              label="Profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="Ingénieure informatique"
              error={errors.profession}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Groupe sanguin"
              name="groupeSanguin"
              type="select"
              value={formData.groupeSanguin}
              onChange={handleChange}
              options={bloodTypes}
              error={errors.groupeSanguin}
            />
            <FormInput
              label="Statut"
              name="statut"
              type="select"
              value={formData.statut}
              onChange={handleChange}
              options={['Actif', 'Inactif']}
              error={errors.statut}
            />
          </div>

          <FormInput
            label="Allergies connues"
            name="allergies"
            type="textarea"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Ex: Pénicilline, arachides"
          />

          <FormInput
            label="Antécédents médicaux"
            name="antecedents"
            type="textarea"
            value={formData.antecedents}
            onChange={handleChange}
            placeholder="Ex: Diabète, asthme..."
          />

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {isEditing ? 'Mettre à jour' : 'Ajouter le patient'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
