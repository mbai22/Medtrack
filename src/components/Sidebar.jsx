import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { getInitials } from '../utils/helpers';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Tableau de bord', icon: HomeIcon },
    { path: '/patients', label: 'Patients', icon: UserGroupIcon },
    { path: '/consultations', label: 'Consultations', icon: ClipboardDocumentListIcon },
    { path: '/rendez-vous', label: 'Rendez-vous', icon: CalendarIcon },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Bouton hamburger mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-white lg:hidden shadow-lg"
        aria-label="Ouvrir le menu"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-primary text-white z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Menu principal"
      >
        <div className="flex flex-col h-full p-4 sm:p-6">
          {/* Logo/Titre */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-accent">MediTrack</h1>
            <p className="text-xs sm:text-sm text-gray-400">Gestion des Patients</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 sm:space-y-2" role="menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-accent text-primary font-semibold'
                      : 'hover:bg-primary-light'
                  }`}
                  role="menuitem"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profil du médecin */}
          <div className="border-t border-gray-700 pt-3 sm:pt-4">
            <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent text-primary flex items-center justify-center font-semibold text-xs sm:text-sm flex-shrink-0">
                {getInitials('Dupont', 'Jean')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs sm:text-sm truncate">Dr. Jean Dupont</p>
                <p className="text-xs text-gray-400 truncate">Médecin généraliste</p>
              </div>
            </div>
          </div>
        </div>
      </aside>


      {/* Espacement pour le contenu */}
      <div className="lg:ml-64" />
    </>
  );
};

export default Sidebar;
