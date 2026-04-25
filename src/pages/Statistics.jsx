import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePatientContext } from '../context/PatientContext';
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Statistics = () => {
  const { patients, consultations, appointments } = usePatientContext();

  // Données mensuelles des consultations (6 derniers mois)
  const getMonthlyConsultations = () => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthConsultations = consultations.filter((c) => {
        const cDate = new Date(c.date);
        return cDate >= monthStart && cDate <= monthEnd;
      });

      return {
        month: format(month, 'MMM yyyy', { locale: fr }),
        consultations: monthConsultations.length,
        patients: patients.filter((p) => {
          const pDate = new Date(p.createdAt);
          return pDate >= monthStart && pDate <= monthEnd;
        }).length,
      };
    });
  };

  // Répartition par sexe
  const getSexDistribution = () => {
    const hommes = patients.filter((p) => p.sexe === 'Homme').length;
    const femmes = patients.filter((p) => p.sexe === 'Femme').length;
    return [
      { name: 'Hommes', value: hommes },
      { name: 'Femmes', value: femmes },
    ];
  };

  // Répartition par groupe sanguin
  const getBloodTypeDistribution = () => {
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return bloodTypes.map((type) => ({
      name: type,
      value: patients.filter((p) => p.groupeSanguin === type).length,
    })).filter((item) => item.value > 0);
  };

  // Répartition par statut
  const getStatusDistribution = () => {
    const actifs = patients.filter((p) => p.statut === 'Actif').length;
    const inactifs = patients.filter((p) => p.statut === 'Inactif').length;
    return [
      { name: 'Actifs', value: actifs },
      { name: 'Inactifs', value: inactifs },
    ];
  };

  // Top 5 des diagnostics les plus fréquents
  const getTopDiagnoses = () => {
    const diagnosisCount = {};
    consultations.forEach((c) => {
      if (c.diagnostic) {
        const key = c.diagnostic.toLowerCase();
        diagnosisCount[key] = (diagnosisCount[key] || 0) + 1;
      }
    });

    return Object.entries(diagnosisCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Statistiques générales
  const getGeneralStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      totalPatients: patients.length,
      totalConsultations: consultations.length,
      totalAppointments: appointments.length,
      patientsThisMonth: patients.filter((p) => new Date(p.createdAt) >= thisMonth).length,
      consultationsThisMonth: consultations.filter((c) => new Date(c.date) >= thisMonth).length,
      activePatients: patients.filter((p) => p.statut === 'Actif').length,
    };
  };

  const monthlyData = getMonthlyConsultations();
  const sexData = getSexDistribution();
  const bloodTypeData = getBloodTypeDistribution();
  const statusData = getStatusDistribution();
  const topDiagnoses = getTopDiagnoses();
  const generalStats = getGeneralStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Statistiques Avancées</h1>

      {/* Cartes statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Patients</h3>
          <p className="text-3xl font-bold text-primary">{generalStats.totalPatients}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Consultations</h3>
          <p className="text-3xl font-bold text-primary">{generalStats.totalConsultations}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Patients Actifs</h3>
          <p className="text-3xl font-bold text-accent">{generalStats.activePatients}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Nouveaux Patients (ce mois)</h3>
          <p className="text-3xl font-bold text-blue-600">{generalStats.patientsThisMonth}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Consultations (ce mois)</h3>
          <p className="text-3xl font-bold text-purple-600">{generalStats.consultationsThisMonth}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Rendez-vous</h3>
          <p className="text-3xl font-bold text-orange-600">{generalStats.totalAppointments}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Évolution mensuelle */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Évolution Mensuelle</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="consultations" stroke="#10B981" name="Consultations" />
              <Line type="monotone" dataKey="patients" stroke="#3B82F6" name="Nouveaux Patients" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par sexe */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Répartition par Sexe</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sexData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sexData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par groupe sanguin */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Groupes Sanguins</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bloodTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par statut */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Statut des Patients</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#9CA3AF'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top diagnostics */}
      {topDiagnoses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Diagnostics les Plus Fréquents</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDiagnoses} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={200} />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Statistics;
