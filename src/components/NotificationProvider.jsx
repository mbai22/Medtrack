import { useEffect } from 'react';
import { requestNotificationPermission, sendAppointmentReminder } from '../utils/notifications';
import { api } from '../services/api';

const NotificationProvider = ({ children }) => {
  useEffect(() => {
    requestNotificationPermission();
    const check = async () => {
      try {
        const apps = await api.getTodayAppointments();
        if (!apps?.length) return;
        const now = new Date();
        for (const apt of apps) {
          const [h, m] = apt.heure.split(':');
          const aptDate = new Date(apt.date);
          aptDate.setHours(+h, +m, 0, 0);
          const diff = aptDate - now;
          if (diff > 0 && diff < 15 * 60 * 1000) {
            sendAppointmentReminder(apt.patient_nom, apt.date, apt.heure, apt.motif || 'Consultation');
          }
        }
      } catch {}
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  return children;
};

export default NotificationProvider;
