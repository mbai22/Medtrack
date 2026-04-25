import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  PlusIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import StatCard from '../components/StatCard';
import { usePatientContext } from '../context/PatientContext';
import { formatDate, formatDateShort } from '../utils/helpers';
import { requestNotificationPermission, checkTodayAppointments } from '../utils/notifications';

const Dashboard = () => {
  const { getStats, patients, getPatientConsultations, getUpcomingAppointments, appointments } = usePatientContext();
  const stats = getStats();

  // Demander la permission pour les notifications au chargement
  useEffect(() => {
    requestNotificationPermission();
    checkTodayAppointments(appointments, patients);
  }, [appointments, patients]);

  // Derniers patients
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  // Dernières consultations
  const recentConsultations = [];
  for (const patient of patients.slice(0, 5)) {
    const consultations = getPatientConsultations(patient.id);
    recentConsultations.push(
      ...consultations.map((c) => ({
        ...c,
        patientName: `${patient.prenom} ${patient.nom}`,
        patientId: patient.id,
      }))
    );
  }
  const latestConsultations = recentConsultations
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const upcomingAppointments = getUpcomingAppointments();

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Tableau de Bord
        </h1>
        <p className="text-gray-600">
          Bienvenue Dr. Dupont, voici un aperçu de votre activité
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Patients"
          value={stats.totalPatients}
          icon={UserGroupIcon}
          color="blue"
        />
        <StatCard
          label="Consultations Aujourd'hui"
          value={stats.consultationsToday}
          icon={ClipboardDocumentListIcon}
          color="purple"
        />
        <StatCard
          label="Nouveaux Patients (Ce mois)"
          value={stats.newPatientsThisMonth}
          icon={PlusIcon}
          color="orange"
        />
        <StatCard
          label="Rendez-vous à Venir"
          value={stats.upcomingAppointments}
          icon={CalendarIcon}
          color="accent"
        />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/patients/nouveau"
          className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Ajouter un Patient</span>
        </Link>
        <Link
          to="/consultations"
          className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center space-x-2"
        >
          <ClipboardDocumentListIcon className="w-5 h-5" />
          <span>Nouvelle Consultation</span>
        </Link>
      </div>

      {/* Grille du contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendez-vous à venir */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Rendez-vous à venir
          </h2>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map((apt) => {
                const patient = patients.find((p) => p.id === apt.patientId);
                return (
                  <div
                    key={apt.id}
                    className="border-l-4 border-accent bg-gray-50 p-3 rounded"
                  >
                    <p className="font-semibold text-primary">
                      {patient?.prenom} {patient?.nom}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDateShort(apt.date)} à {apt.heure}
                    </p>
                    <p className="text-sm text-gray-700">{apt.motif}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucun rendez-vous à venir
            </p>
          )}
        </div>

        {/* Dernières consultations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Dernières Consultations
          </h2>
          {latestConsultations.length > 0 ? (
            <div className="space-y-3">
              {latestConsultations.slice(0, 5).map((consultation) => (
                <div
                  key={consultation.id}
                  className="border-l-4 border-purple-500 bg-gray-50 p-3 rounded"
                >
                  <p className="font-semibold text-primary">
                    {consultation.patientName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(consultation.date)}
                  </p>
                  <p className="text-sm text-gray-700">{consultation.motif}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune consultation récente
            </p>
          )}
        </div>
      </div>

      {/* Patients récents */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">
            Patients Récents
          </h2>
          <Link
            to="/patients"
            className="text-accent hover:text-accent-hover font-semibold text-sm"
          >
            Voir tous →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Téléphone</th>
                <th className="px-4 py-2">Lieu</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-primary">
                    {patient.prenom} {patient.nom}
                  </td>
                  <td className="px-4 py-3">{patient.telephone}</td>
                  <td className="px-4 py-3 text-gray-600">{patient.lieu}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        patient.statut === 'Actif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {patient.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/patients/${patient.id}`}
                      className="text-accent hover:text-accent-hover font-semibold"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
