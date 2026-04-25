/**
 * Système de suivi des modifications (audit trail)
 */

/**
 * Crée un enregistrement d'historique pour une modification
 */
export const createHistoryEntry = (entityType, entityId, action, changes, userId = null) => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    entityType, // 'patient', 'consultation', 'appointment'
    entityId,
    action, // 'create', 'update', 'delete'
    changes, // { fieldName: { oldValue, newValue } }
    userId,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Sauvegarde un historique dans localStorage
 */
export const saveHistory = (historyEntry) => {
  const history = JSON.parse(localStorage.getItem('changeHistory') || '[]');
  history.unshift(historyEntry);
  
  // Garder seulement les 1000 derniers enregistrements
  if (history.length > 1000) {
    history.pop();
  }
  
  localStorage.setItem('changeHistory', JSON.stringify(history));
  return historyEntry;
};

/**
 * Récupère l'historique pour une entité spécifique
 */
export const getEntityHistory = (entityType, entityId) => {
  const history = JSON.parse(localStorage.getItem('changeHistory') || '[]');
  return history.filter(
    (entry) => entry.entityType === entityType && entry.entityId === entityId
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Récupère tout l'historique
 */
export const getAllHistory = (limit = 100) => {
  const history = JSON.parse(localStorage.getItem('changeHistory') || '[]');
  return history.slice(0, limit).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Compare deux objets et retourne les différences
 */
export const getObjectChanges = (oldObj, newObj) => {
  const changes = {};
  const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);

  allKeys.forEach((key) => {
    const oldValue = oldObj?.[key];
    const newValue = newObj?.[key];

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes[key] = { oldValue, newValue };
    }
  });

  return changes;
};

/**
 * Formate un historique pour l'affichage
 */
export const formatHistoryEntry = (entry) => {
  const actionLabels = {
    create: 'Création',
    update: 'Modification',
    delete: 'Suppression',
  };

  const entityLabels = {
    patient: 'Patient',
    consultation: 'Consultation',
    appointment: 'Rendez-vous',
  };

  return {
    ...entry,
    actionLabel: actionLabels[entry.action] || entry.action,
    entityLabel: entityLabels[entry.entityType] || entry.entityType,
    formattedDate: new Date(entry.timestamp).toLocaleString('fr-FR'),
  };
};

/**
 * Efface l'historique
 */
export const clearHistory = () => {
  localStorage.removeItem('changeHistory');
};
