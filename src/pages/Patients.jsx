import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { usePatientContext } from '../context/PatientContext';
import { getAge, formatDateShort } from '../utils/helpers';

const Patients = () => {
  const navigate = useNavigate();
  const { patients, deletePatient } = usePatientContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sexFilter, setSexFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrage
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.telephone.includes(searchTerm);

    const matchesSex = !sexFilter || patient.sexe === sexFilter;
    const matchesStatus = !statusFilter || patient.statut === statusFilter;

    return matchesSearch && matchesSex && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      deletePatient(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Patients</h1>
            <p className="text-gray-600">Gérez vos patients</p>
          </div>
          <Link
            to="/patients/nouveau"
            className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Ajouter un patient</span>
          </Link>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Filtre sexe */}
            <select
              value={sexFilter}
              onChange={(e) => {
                setSexFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Tous les sexes</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>

            {/* Filtre statut */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
          <p className="text-sm text-gray-600">
            {filteredPatients.length} patient(s) trouvé(s)
          </p>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {displayedPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr className="text-left text-sm font-semibold text-gray-700">
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Téléphone</th>
                  <th className="px-6 py-4">Lieu</th>
                  <th className="px-6 py-4">Âge</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-primary">
                      {patient.prenom} {patient.nom}
                    </td>
                    <td className="px-6 py-4">{patient.telephone}</td>
                    <td className="px-6 py-4 text-gray-600">{patient.lieu}</td>
                    <td className="px-6 py-4">{getAge(patient.dateNaissance)} ans</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          patient.statut === 'Actif'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {patient.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="text-accent hover:text-accent-hover font-semibold"
                        >
                          Voir
                        </Link>
                        <Link
                          to={`/patients/${patient.id}/modifier`}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="p-2 text-danger hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun patient trouvé</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
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

export default Patients;
