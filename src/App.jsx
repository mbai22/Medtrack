import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { PatientProvider } from './context/PatientContext';
import { usePatientContext } from './context/PatientContext';
import Login from './pages/Login';
import { hasPassword } from './utils/security';

// Lazy loading des pages pour le code splitting
import Landing from './pages/Landing';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const PatientForm = lazy(() => import('./pages/PatientForm'));
const PatientDetail = lazy(() => import('./pages/PatientDetail'));
const ConsultationForm = lazy(() => import('./pages/ConsultationForm'));
const Consultations = lazy(() => import('./pages/Consultations'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Settings = lazy(() => import('./pages/Settings'));

// Composant de chargement
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

  // Composant pour la modification d'un patient
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
            <Route path="/parametres" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un mot de passe est configuré
    const passwordConfigured = hasPassword();
    if (!passwordConfigured) {
      setIsAuthenticated(false);
    } else {
      // Si un mot de passe est configuré, l'utilisateur doit se connecter
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSetup = () => {
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
        <Route path="/login" element={<Login onLogin={handleLogin} onSetup={handleSetup} />} />
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
