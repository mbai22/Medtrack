import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserGroupIcon, ClipboardDocumentListIcon, CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import { usePatientContext } from '../context/PatientContext';
import { formatDate, formatDateShort } from '../utils/helpers';
import { api } from '../services/api';

const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'];

const Dashboard = () => {
  const { getStats, patients, getPatientConsultations, getUpcomingAppointments } = usePatientContext();
  const stats = getStats();
  const [monthlyData, setMonthlyData] = useState([]);
  const [topPatients, setTopPatients] = useState([]);
  const [appointmentStats, setAppointmentStats] = useState({ planifie: 0, termine: 0, annule: 0 });

  const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const consultations = await api.getConsultations({ limit: 1000 });
        const apps = await api.getAppointments();

        const months = {};
        for (const c of consultations.consultations) {
          const d = new Date(c.date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          months[key] = (months[key] || 0) + 1;
        }

        const sorted = Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-6);
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        setMonthlyData(sorted.map(([key, count]) => ({
          mois: monthNames[parseInt(key.split('-')[1]) - 1],
          consultations: count,
        })));

        const patientCount = {};
        for (const c of consultations.consultations) {
          const pid = c.patient_id;
          patientCount[pid] = (patientCount[pid] || 0) + 1;
        }
        const top = Object.entries(patientCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([id, count]) => {
            const p = patients.find(p => String(p.id) === String(id));
            return { nom: p ? `${p.prenom} ${p.nom}` : 'Inconnu', consultations: count };
          });
        setTopPatients(top);

        const statusCount = { planifie: 0, termine: 0, annule: 0 };
        for (const a of apps) statusCount[a.status || 'planifie']++;
        setAppointmentStats(statusCount);

        try {
          await api.createAuditLog({ action: 'view_dashboard', entity_type: 'dashboard' });
        } catch {}
      } catch {}
    };
    fetchData();
  }, [patients]);

  const upcomingAppointments = getUpcomingAppointments();
  const recentPatients = [...patients].sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)).slice(0, 10);

  const recentConsultations = [];
  for (const patient of patients.slice(0, 5)) {
    const consultations = getPatientConsultations(patient.id);
    recentConsultations.push(...consultations.map(c => ({
      ...c, patientName: `${patient.prenom} ${patient.nom}`, patientId: patient.id,
    })));
  }
  const latestConsultations = recentConsultations.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const pieData = [
    { name: 'Planifié', value: appointmentStats.planifie },
    { name: 'Terminé', value: appointmentStats.termine },
    { name: 'Annulé', value: appointmentStats.annule },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Tableau de Bord</h1>
        <p className="text-gray-600">Bienvenue{currentUser.prenom ? ` ${currentUser.prenom}` : ''}, voici un aperçu de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Patients" value={stats.totalPatients} icon={UserGroupIcon} color="blue" />
        <StatCard label="Consultations Aujourd'hui" value={stats.consultationsToday} icon={ClipboardDocumentListIcon} color="purple" />
        <StatCard label="Nouveaux Patients (Ce mois)" value={stats.newPatientsThisMonth} icon={PlusIcon} color="orange" />
        <StatCard label="Rendez-vous à Venir" value={stats.upcomingAppointments} icon={CalendarIcon} color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Consultations par mois</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="consultations" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Pas encore de données</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Statut des rendez-vous</h2>
          {pieData.length > 0 ? (
            <div className="flex items-center justify-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-gray-600">{d.name}</span>
                    <span className="font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucun rendez-vous</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">Patients les plus consultés</h2>
          </div>
          {topPatients.length > 0 ? (
            <div className="space-y-3">
              {topPatients.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${['bg-accent', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][i]}`}>{i + 1}</div>
                    <span className="font-medium text-gray-900">{p.nom}</span>
                  </div>
                  <span className="text-sm text-gray-500">{p.consultations} consultation{p.consultations > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Pas encore de données</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Rendez-vous à venir</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map((apt) => {
                const patient = patients.find(p => String(p.id) === String(apt.patientId || apt.patient_id));
                return (
                  <div key={apt.id} className="border-l-4 border-accent bg-gray-50 p-3 rounded">
                    <p className="font-semibold text-primary">{patient?.prenom} {patient?.nom}</p>
                    <p className="text-sm text-gray-600">{formatDateShort(apt.date)} à {apt.heure}</p>
                    <p className="text-sm text-gray-700">{apt.motif}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucun rendez-vous à venir</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Dernières Consultations</h2>
          {latestConsultations.length > 0 ? (
            <div className="space-y-3">
              {latestConsultations.slice(0, 5).map((consultation) => (
                <div key={consultation.id} className="border-l-4 border-purple-500 bg-gray-50 p-3 rounded">
                  <p className="font-semibold text-primary">{consultation.patientName}</p>
                  <p className="text-sm text-gray-600">{formatDate(consultation.date)}</p>
                  <p className="text-sm text-gray-700">{consultation.motif}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune consultation récente</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">Actions rapides</h2>
          </div>
          <div className="space-y-3">
            <Link to="/patients/nouveau" className="block w-full bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center">
              <PlusIcon className="w-5 h-5 inline mr-2" />Ajouter un Patient
            </Link>
            <Link to="/consultations" className="block w-full bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center">
              <ClipboardDocumentListIcon className="w-5 h-5 inline mr-2" />Nouvelle Consultation
            </Link>
            <Link to="/messages" className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center">
              <PlusIcon className="w-5 h-5 inline mr-2" />Messagerie
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">Patients Récents</h2>
          <Link to="/patients" className="text-accent hover:text-accent-hover font-semibold text-sm">Voir tous →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-gray-700 font-semibold">
              <tr><th className="px-4 py-2">Nom</th><th className="px-4 py-2">Téléphone</th><th className="px-4 py-2">Lieu</th><th className="px-4 py-2">Statut</th><th className="px-4 py-2">Action</th></tr>
            </thead>
            <tbody>
              {recentPatients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-primary">{patient.prenom} {patient.nom}</td>
                  <td className="px-4 py-3">{patient.telephone}</td>
                  <td className="px-4 py-3 text-gray-600">{patient.lieu}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${patient.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{patient.statut}</span>
                  </td>
                  <td className="px-4 py-3"><Link to={`/patients/${patient.id}`} className="text-accent hover:text-accent-hover font-semibold">Voir</Link></td>
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
