import React, { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { usePatientContext } from '../context/PatientContext';
import { getInitials } from '../utils/helpers';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configuration du localizer pour date-fns
const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format: (date, formatStr) => format(date, formatStr, { locale: fr }),
  parse: (str, formatStr) => parse(str, formatStr, new Date(), { locale: fr }),
  startOfWeek: (date) => startOfWeek(date, { locale: fr }),
  getDay: (date) => getDay(date),
  locales,
});

const CalendarPage = () => {
  const { appointments, patients } = usePatientContext();
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  // Convertir les rendez-vous en format calendar
  const events = appointments.map((apt) => {
    const patient = patients.find((p) => p.id === apt.patientId);
    const [hours, minutes] = apt.heure.split(':');
    const startDate = new Date(apt.date);
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // Durée par défaut 1h

    return {
      id: apt.id,
      title: patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu',
      start: startDate,
      end: endDate,
      resource: apt,
    };
  });

  const handleSelectEvent = useCallback((event) => {
    const apt = event.resource;
    const patient = patients.find((p) => p.id === apt.patientId);
    if (patient) {
      window.location.href = `/patients/${patient.id}`;
    }
  }, [patients]);

  const handleSelectSlot = useCallback(({ start, end }) => {
    // Rediriger vers la création de rendez-vous avec pré-remplissage
    const dateStr = format(start, 'yyyy-MM-dd');
    const timeStr = format(start, 'HH:mm');
    window.location.href = `/rendez-vous?date=${dateStr}&time=${timeStr}`;
  }, []);

  const eventStyleGetter = (event) => {
    const patient = patients.find((p) => p.id === event.resource.patientId);
    const initials = patient ? getInitials(patient.nom, patient.prenom) : '??';
    
    return {
      style: {
        backgroundColor: '#10B981',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
      className: 'custom-calendar-event',
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 pt-20 lg:pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-xl lg:text-2xl font-bold text-blue-900">Calendrier des rendez-vous</h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setView(Views.MONTH)}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-xl transition-colors active:scale-95 ${
                  view === Views.MONTH
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Mois
              </button>
              <button
                onClick={() => setView(Views.WEEK)}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-xl transition-colors active:scale-95 ${
                  view === Views.WEEK
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setView(Views.DAY)}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-xl transition-colors active:scale-95 ${
                  view === Views.DAY
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Jour
              </button>
            </div>
          </div>

          <div style={{ height: '500px', minHeight: '400px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              date={date}
              onNavigate={setDate}
              onView={setView}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable={true}
              eventPropGetter={eventStyleGetter}
              messages={{
                today: "Aujourd'hui",
                previous: 'Précédent',
                next: 'Suivant',
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                agenda: 'Agenda',
                date: 'Date',
                time: 'Heure',
                event: 'Rendez-vous',
                noEventsInRange: 'Aucun rendez-vous',
              }}
              formats={{
                dayHeaderFormat: (date) => format(date, 'EEE dd', { locale: fr }),
                weekdayFormat: (date) => format(date, 'EEE', { locale: fr }),
                monthHeaderFormat: (date) => format(date, 'MMMM yyyy', { locale: fr }),
              }}
              components={{
                toolbar: (props) => (
                  <div className="rbc-toolbar flex flex-col sm:flex-row gap-2 mb-4">
                    <span className="rbc-toolbar-label font-semibold text-lg">{props.label}</span>
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={() => props.onNavigate('TODAY')}
                        className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                      >
                        Aujourd'hui
                      </button>
                      <button
                        onClick={() => props.onNavigate('PREV')}
                        className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={() => props.onNavigate('NEXT')}
                        className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
