import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon, UserGroupIcon, ClipboardDocumentListIcon, CalendarIcon,
  ChartBarIcon, CogIcon, Bars3Icon, XMarkIcon, CalendarDaysIcon,
  ArrowRightOnRectangleIcon, BellIcon, EnvelopeIcon, BellAlertIcon,
} from '@heroicons/react/24/outline';
import { getInitials } from '../utils/helpers';
import { api } from '../services/api';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [notifCount, setNotifCount] = useState(0);
  const [notifs, setNotifs] = useState([]);
  const [msgCount, setMsgCount] = useState(0);
  const notifRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
  const roleLabel = { doctor: 'Médecin', secretary: 'Secrétaire', assistant: 'Assistante' };

  useEffect(() => {
    const fetch = () => {
      api.getUnreadNotificationsCount().then(d => setNotifCount(d.count)).catch(() => {});
      api.getUnreadMessagesCount().then(d => setMsgCount(d.count)).catch(() => {});
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleNotifs = async () => {
    if (!showNotif) {
      try {
        const data = await api.getNotifications();
        setNotifs(data);
      } catch {}
    }
    setShowNotif(!showNotif);
  };

  const markRead = async (id) => {
    await api.markNotificationRead(id).catch(() => {});
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: 1 } : n));
    setNotifCount(c => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    await api.markAllNotificationsRead().catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, read: 1 })));
    setNotifCount(0);
  };

  const navItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: HomeIcon },
    { path: '/patients', label: 'Patients', icon: UserGroupIcon },
    { path: '/consultations', label: 'Consultations', icon: ClipboardDocumentListIcon },
    { path: '/rendez-vous', label: 'Rendez-vous', icon: CalendarIcon },
    { path: '/calendrier', label: 'Calendrier', icon: CalendarDaysIcon },
    { path: '/statistiques', label: 'Statistiques', icon: ChartBarIcon },
    { path: '/messages', label: 'Messages', icon: EnvelopeIcon, badge: msgCount },
    { path: '/parametres', label: 'Paramètres', icon: CogIcon },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('meditrack_token');
    localStorage.removeItem('current_user');
    navigate('/login');
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-primary shadow-lg z-40 px-4 py-3 flex items-center justify-between safe-area-top">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-3 rounded-xl hover:bg-primary-light transition-colors active:scale-95">
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
        <h1 className="text-white font-bold text-lg relative">
          MediTrack
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{notifCount}</span>
          )}
        </h1>
        <div className="w-12"></div>
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={() => setIsOpen(false)}></div>
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:h-screen lg:overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-700 pt-20 lg:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white font-bold text-2xl">MediTrack</h1>
                <p className="text-gray-400 text-sm">Gestion médicale</p>
              </div>
              <div className="relative" ref={notifRef}>
                <button onClick={toggleNotifs} className="relative">
                  <BellIcon className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{notifCount > 9 ? '9+' : notifCount}</span>
                  )}
                </button>
                {showNotif && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                      <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                      {notifCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-accent hover:text-accent-hover font-medium">
                          Tout marquer lu
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifs.length === 0 && (
                        <p className="text-center text-gray-400 py-8 text-sm">Aucune notification</p>
                      )}
                      {notifs.map(n => (
                        <div key={n.id} onClick={() => !n.read && markRead(n.id)}
                          className={`px-4 py-3 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'border-l-4 border-accent bg-accent/5' : ''}`}>
                          <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all active:scale-95 relative ${isActive(item.path) ? 'bg-accent text-white shadow-lg' : 'text-gray-300 hover:bg-primary-light'}`}>
                <item.icon className="w-6 h-6" />
                <span className="font-medium text-base">{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{item.badge}</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-700 pt-4 px-4 pb-6 space-y-2">
            <div className="flex items-center space-x-3 px-4 py-3 bg-primary-light rounded-xl">
              <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-semibold text-base flex-shrink-0">
                {currentUser.prenom ? getInitials(currentUser.nom || '', currentUser.prenom) : '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-base truncate text-white">
                  {currentUser.prenom ? `${currentUser.prenom} ${currentUser.nom}` : 'Utilisateur'}
                </p>
                <p className="text-sm text-gray-400 truncate capitalize">
                  {roleLabel[currentUser.role] || currentUser.role}
                </p>
              </div>
            </div>

            <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-primary-light transition-colors">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
