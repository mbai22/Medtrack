import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { usePatientContext } from '../context/PatientContext';
import { formatDateShort } from '../utils/helpers';

const Appointments = () => {
  const { getMonthAppointments, appointments, patients, addAppointment } = usePatientContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    date: formatDateShort(new Date()),
    heure: '10:00',
    motif: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Obtenir les rendez-vous du mois
  const monthAppointments = getMonthAppointments(year, month);

  // Générer les jours du calendrier
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAppointmentsForDay = (day) => {
    if (!day) return [];
    const date = new Date(year, month, day);
    return monthAppointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === day &&
        aptDate.getMonth() === month &&
        aptDate.getFullYear() === year
      );
    });
  };

  const handleAddAppointment = () => {
    if (!newAppointment.patientId || !newAppointment.motif) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const dateStr = newAppointment.date.split('/').reverse().join('-');
    addAppointment({
      patientId: newAppointment.patientId,
      date: new Date(dateStr).toISOString(),
      heure: newAppointment.heure,
      motif: newAppointment.motif,
    });

    setNewAppointment({
      patientId: '',
      date: formatDateShort(new Date()),
      heure: '10:00',
      motif: '',
    });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Rendez-vous</h1>
            <p className="text-gray-600">Gestion du calendrier</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Ajouter un rendez-vous</span>
          </button>
        </div>

        {/* Contrôles d'affichage */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'calendar'
                ? 'bg-accent text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Calendrier
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'list'
                ? 'bg-accent text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Liste
          </button>
        </div>
      </div>

      {/* Vue Calendrier */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Navigation du mois */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold text-primary capitalize">{monthName}</h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-700 py-2 text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Jours du calendrier */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-24 rounded-lg border p-2 ${
                  day
                    ? 'bg-white border-gray-200 hover:border-accent cursor-pointer'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                {day && (
                  <div>
                    <p className="font-semibold text-primary mb-1">{day}</p>
                    <div className="space-y-1">
                      {getAppointmentsForDay(day).map((apt) => {
                        const patient = patients.find((p) => p.id === apt.patientId);
                        return (
                          <div
                            key={apt.id}
                            className="bg-accent text-white text-xs p-1 rounded truncate"
                            title={patient ? `${patient.prenom} ${patient.nom}` : 'Patient'}
                          >
                            {apt.heure}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vue Liste */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((apt) => {
                const patient = patients.find((p) => p.id === apt.patientId);
                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary text-lg">
                          {patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu'}
                        </h3>
                        <p className="text-gray-600">
                          {formatDateShort(apt.date)} à {apt.heure}
                        </p>
                        <p className="text-gray-700 mt-2">{apt.motif}</p>
                      </div>
                      <Link
                        to={`/patients/${apt.patientId}`}
                        className="text-accent hover:text-accent-hover font-semibold ml-4"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">Aucun rendez-vous</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Ajouter un rendez-vous */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Ajouter un rendez-vous</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient *
                  </label>
                  <select
                    value={newAppointment.patientId}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        patientId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Sélectionnez un patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.prenom} {p.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={
                      newAppointment.date.split('/').reverse().join('-')
                    }
                    onChange={(e) => {
                      const [year, month, day] = e.target.value.split('-');
                      setNewAppointment({
                        ...newAppointment,
                        date: `${day}/${month}/${year}`,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure *
                  </label>
                  <input
                    type="time"
                    value={newAppointment.heure}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        heure: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motif *
                  </label>
                  <input
                    type="text"
                    value={newAppointment.motif}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        motif: e.target.value,
                      })
                    }
                    placeholder="Ex: Visite de contrôle"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAddAppointment}
                  className="flex-1 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
