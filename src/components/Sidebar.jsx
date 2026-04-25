import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { getInitials } from '../utils/helpers';
import { usePatientContext } from '../context/PatientContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentDoctor } = usePatientContext();

  const navItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: HomeIcon },
    { path: '/patients', label: 'Patients', icon: UserGroupIcon },
    { path: '/consultations', label: 'Consultations', icon: ClipboardDocumentListIcon },
    { path: '/rendez-vous', label: 'Rendez-vous', icon: CalendarIcon },
    { path: '/calendrier', label: 'Calendrier', icon: CalendarDaysIcon },
    { path: '/statistiques', label: 'Statistiques', icon: ChartBarIcon },
    { path: '/parametres', label: 'Paramètres', icon: CogIcon },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-primary shadow-lg z-40 px-4 py-3 flex items-center justify-between safe-area-top">
        <button
          onClick={toggleSidebar}
          className="text-white p-3 rounded-xl hover:bg-primary-light transition-colors active:scale-95"
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
        <h1 className="text-white font-bold text-lg">MediTrack</h1>
        <div className="w-12"></div>
      </div>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:h-screen lg:overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700 pt-20 lg:pt-6">
            <h1 className="text-white font-bold text-2xl">MediTrack</h1>
            <p className="text-gray-400 text-sm">Gestion médicale</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all active:scale-95 ${
                  isActive(item.path)
                    ? 'bg-accent text-white shadow-lg'
                    : 'text-gray-300 hover:bg-primary-light'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium text-base">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Profil du médecin */}
          <div className="border-t border-gray-700 pt-4 px-4 pb-6">
            <div className="flex items-center space-x-3 px-4 py-3 bg-primary-light rounded-xl">
              {currentDoctor?.avatar ? (
                <img
                  src={currentDoctor.avatar}
                  alt={`Dr. ${currentDoctor.prenom} ${currentDoctor.nom}`}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-semibold text-base flex-shrink-0">
                  {currentDoctor ? getInitials(currentDoctor.nom, currentDoctor.prenom) : 'DR'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-base truncate text-white">
                  {currentDoctor ? `Dr. ${currentDoctor.prenom} ${currentDoctor.nom}` : 'Dr. Dupont'}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {currentDoctor ? currentDoctor.specialite : 'Médecin généraliste'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
