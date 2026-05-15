import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { PatientProvider } from './context/PatientContext';
import { usePatientContext } from './context/PatientContext';
import Login from './pages/Login';
import NotificationProvider from './components/NotificationProvider';
import { api } from './services/api';

const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const PatientForm = lazy(() => import('./pages/PatientForm'));
const PatientDetail = lazy(() => import('./pages/PatientDetail'));
const ConsultationForm = lazy(() => import('./pages/ConsultationForm'));
const Consultations = lazy(() => import('./pages/Consultations'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Messages = lazy(() => import('./pages/Messages'));
const Settings = lazy(() => import('./pages/Settings'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { getPatient } = usePatientContext();

  const EditPatient = () => {
    const { id } = useParams();
    const patient = getPatient(id);

    if (!patient) {
      return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8 flex items-center justify-center">
          <p className="text-center text-gray-600">Patient non trouvé</p>
        </div>
      );
    }

    return <PatientForm patient={patient} />;
  };

  return (
    <NotificationProvider>
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 pt-16 lg:pt-0 overflow-y-auto">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/nouveau" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/patients/:id/modifier" element={<EditPatient />} />
            <Route path="/consultations" element={<Consultations />} />
            <Route path="/consultations/nouvelle" element={<ConsultationForm />} />
            <Route path="/consultations/nouvelle/:patientId" element={<ConsultationForm />} />
            <Route path="/rendez-vous" element={<Appointments />} />
            <Route path="/calendrier" element={<Calendar />} />
            <Route path="/statistiques" element={<Statistics />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/parametres" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
    </NotificationProvider>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('meditrack_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await api.checkSetup();
        setIsConfigured(data.configured);
        if (!data.configured) {
          localStorage.removeItem('meditrack_token');
          localStorage.removeItem('current_user');
          setIsAuthenticated(false);
        }
      } catch {
        setIsConfigured(false);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <PatientProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={handleLogin} isConfigured={isConfigured} />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AppContent />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <AppContent />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </PatientProvider>
  );
};

export default App;
