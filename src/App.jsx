import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import ConsultationForm from './pages/ConsultationForm';
import Consultations from './pages/Consultations';
import Appointments from './pages/Appointments';
import { PatientProvider } from './context/PatientContext';
import { usePatientContext } from './context/PatientContext';

// Composant pour la modification d'un patient
const EditPatient = () => {
  const { id } = useParams();
  const { getPatient } = usePatientContext();
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

const AppContent = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 pt-16 lg:pt-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/nouveau" element={<PatientForm />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/patients/:id/modifier" element={<EditPatient />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/consultations/nouvelle" element={<ConsultationForm />} />
          <Route path="/consultations/nouvelle/:patientId" element={<ConsultationForm />} />
          <Route path="/rendez-vous" element={<Appointments />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <PatientProvider>
        <AppContent />
      </PatientProvider>
    </Router>
  );
}

export default App;
