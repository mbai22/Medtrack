/**
 * Système de notifications pour les rappels de rendez-vous
 */

/**
 * Demande la permission pour les notifications
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Ce navigateur ne supporte pas les notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Envoie une notification pour un rendez-vous
 */
export const sendAppointmentReminder = (patientName, date, time, motif) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Rappel de rendez-vous - MediTrack', {
      body: `${patientName} - ${date} à ${time}\nMotif: ${motif}`,
      icon: '/vite.svg',
      tag: 'appointment-reminder',
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
};

/**
 * Planifie des rappels pour les rendez-vous à venir
 */
export const scheduleAppointmentReminders = (appointments, patients) => {
  const now = new Date();
  const reminders = [];

  appointments.forEach((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const [hours, minutes] = appointment.heure.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const patient = patients.find((p) => p.id === appointment.patientId);
    if (!patient) return;

    const patientName = `${patient.prenom} ${patient.nom}`;
    const timeUntilAppointment = appointmentDate - now;

    // Rappel 1 jour avant (24 heures)
    const oneDayBefore = timeUntilAppointment - 24 * 60 * 60 * 1000;
    if (oneDayBefore > 0 && oneDayBefore < 60 * 60 * 1000) {
      setTimeout(() => {
        sendAppointmentReminder(
          patientName,
          appointmentDate.toLocaleDateString('fr-FR'),
          appointment.heure,
          appointment.motif
        );
      }, oneDayBefore);
      reminders.push({ type: '1 day', appointmentId: appointment.id });
    }

    // Rappel 1 heure avant
    const oneHourBefore = timeUntilAppointment - 60 * 60 * 1000;
    if (oneHourBefore > 0 && oneHourBefore < 60 * 60 * 1000) {
      setTimeout(() => {
        sendAppointmentReminder(
          patientName,
          appointmentDate.toLocaleDateString('fr-FR'),
          appointment.heure,
          appointment.motif
        );
      }, oneHourBefore);
      reminders.push({ type: '1 hour', appointmentId: appointment.id });
    }

    // Rappel 15 minutes avant
    const fifteenMinutesBefore = timeUntilAppointment - 15 * 60 * 1000;
    if (fifteenMinutesBefore > 0 && fifteenMinutesBefore < 15 * 60 * 1000) {
      setTimeout(() => {
        sendAppointmentReminder(
          patientName,
          appointmentDate.toLocaleDateString('fr-FR'),
          appointment.heure,
          appointment.motif
        );
      }, fifteenMinutesBefore);
      reminders.push({ type: '15 min', appointmentId: appointment.id });
    }
  });

  return reminders;
};

/**
 * Vérifie les rendez-vous du jour et envoie des notifications
 */
export const checkTodayAppointments = (appointments, patients) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === today.getTime();
  });

  if (todayAppointments.length > 0 && Notification.permission === 'granted') {
    const notification = new Notification('Rendez-vous aujourd\'hui - MediTrack', {
      body: `Vous avez ${todayAppointments.length} rendez-vous aujourd'hui`,
      icon: '/vite.svg',
      tag: 'daily-reminder',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  return todayAppointments;
};

/**
 * Hook React pour les notifications
 * Note: Ce hook doit être utilisé dans un composant React
 */
export const useNotifications = () => {
  const [permission, setPermission] = React.useState(Notification.permission);

  const requestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : Notification.permission);
    return granted;
  };

  return {
    permission,
    requestPermission,
    sendAppointmentReminder,
    scheduleAppointmentReminders,
    checkTodayAppointments,
  };
};
