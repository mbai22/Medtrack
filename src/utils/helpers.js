/**
 * Calcule l'âge basé sur la date de naissance
 */
export const getAge = (dateNaissance) => {
  const today = new Date();
  const birthDate = new Date(dateNaissance);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Formate une date au format français
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('fr-FR', options);
};

/**
 * Formate une date au format court (dd/mm/yyyy)
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Retourne les initiales d'une personne
 */
export const getInitials = (nom, prenom) => {
  const n = (nom || '').charAt(0).toUpperCase();
  const p = (prenom || '').charAt(0).toUpperCase();
  return n + p;
};

/**
 * Formate une date pour un input date HTML
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Retourne le jour de la semaine en français
 */
export const getDayOfWeek = (date) => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[new Date(date).getDay()];
};

/**
 * Formate une date avec heure
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return d.toLocaleDateString('fr-FR', options);
};
