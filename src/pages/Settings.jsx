import React, { useState, useEffect } from 'react';
import { CloudArrowDownIcon, CloudArrowUpIcon, TrashIcon, ExclamationTriangleIcon, PlusIcon, PencilIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { usePatientContext } from '../context/PatientContext';
import { exportData, importData, clearAllData } from '../utils/backup';
import { api } from '../services/api';

const ROLE_LABELS = { doctor: 'Médecin', secretary: 'Secrétaire', assistant: 'Assistante' };
const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
const isDoctor = currentUser.role === 'doctor';

const UserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    role: user?.role || 'assistant',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.nom || !form.prenom) {
      setError('Tous les champs sont requis');
      return;
    }

    if (!user && form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: form.username,
        email: form.email || undefined,
        nom: form.nom,
        prenom: form.prenom,
        role: form.role,
      };
      if (form.password) payload.password = form.password;

      if (user) {
        await api.updateUser(user.id, payload);
      } else {
        await api.createUser(payload);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-primary mb-4">
          {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none" placeholder="utilisateur@exemple.fr" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input type="text" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none">
              <option value="doctor">Médecin</option>
              <option value="secretary">Secrétaire</option>
              <option value="assistant">Assistante</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {user ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
            </label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
              minLength={user ? 0 : 6} />
          </div>
          {form.password && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none" />
            </div>
          )}
          {error && <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-sm">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-accent hover:bg-accent-hover text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Enregistrement...' : (user ? 'Mettre à jour' : 'Créer')}
            </button>
            <button type="button" onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Settings = () => {
  const { patients, consultations, appointments, setPatients, setConsultations, setAppointments } = usePatientContext();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch {}
  };

  useEffect(() => { if (isDoctor) loadUsers(); }, []);

  const handleDeleteUser = async (user) => {
    if (!confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) return;
    try {
      await api.deleteUser(user.id);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportAll = () => exportData(patients, consultations, appointments);

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImportError('');
    setImportSuccess('');
    try {
      const data = await importData(file);
      if (confirm(`Importer ${data.patients.length} patients, ${data.consultations.length} consultations et ${data.appointments.length} rendez-vous ? Les données existantes seront remplacées.`)) {
        setPatients(data.patients);
        setConsultations(data.consultations);
        setAppointments(data.appointments);
        setImportSuccess('Données importées avec succès !');
        setTimeout(() => setImportSuccess(''), 3000);
      }
    } catch (error) {
      setImportError(error.message || 'Erreur lors de l\'import');
    }
    event.target.value = '';
  };

  const handleClearAll = () => {
    if (confirm('ATTENTION: Cette action supprime TOUTES les données. Irréversible. Confirmer ?')) {
      clearAllData();
      setPatients([]);
      setConsultations([]);
      setAppointments([]);
      setShowClearConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Paramètres</h1>

      {isDoctor && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">Utilisateurs</h2>
            <button onClick={() => { setEditUser(null); setShowModal(true); }}
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors">
              <PlusIcon className="w-5 h-5" />
              Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {u.prenom?.charAt(0)}{u.nom?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{u.prenom} {u.nom}</p>
                    <p className="text-sm text-gray-500">{u.email || `@${u.username}`} — {ROLE_LABELS[u.role] || u.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditUser(u); setShowModal(true); }}
                    className="p-2 text-gray-500 hover:text-accent transition-colors">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  {u.id !== currentUser.id && (
                    <button onClick={() => handleDeleteUser(u)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isDoctor && (
        <AuditLogSection />
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">État des données</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Patients</p>
            <p className="text-2xl font-bold text-primary">{patients.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Consultations</p>
            <p className="text-2xl font-bold text-primary">{consultations.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Rendez-vous</p>
            <p className="text-2xl font-bold text-primary">{appointments.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Sauvegarde et Restauration</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <h3 className="font-semibold text-green-800">Exporter toutes les données</h3>
              <p className="text-sm text-green-600">Téléchargez un fichier JSON</p>
            </div>
            <button onClick={handleExportAll}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              <CloudArrowDownIcon className="w-5 h-5" />
              Exporter
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h3 className="font-semibold text-blue-800">Importer des données</h3>
              <p className="text-sm text-blue-600">Restaurez depuis un fichier JSON</p>
            </div>
            <div>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
              <label htmlFor="import-file"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
                <CloudArrowUpIcon className="w-5 h-5" />
                Importer
              </label>
            </div>
          </div>
          {importError && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{importError}</div>}
          {importSuccess && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">{importSuccess}</div>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
        <h2 className="text-lg font-semibold text-danger mb-4 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5" />
          Zone dangereuse
        </h2>
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
          <div>
            <h3 className="font-semibold text-red-800">Supprimer toutes les données</h3>
            <p className="text-sm text-red-600">Action irréversible</p>
          </div>
          {!showClearConfirm ? (
            <button onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              <TrashIcon className="w-5 h-5" />
              Supprimer tout
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleClearAll} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Confirmer</button>
              <button onClick={() => setShowClearConfirm(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">Annuler</button>
            </div>
          )}
        </div>
      </div>
      {showModal && <UserModal user={editUser} onClose={() => setShowModal(false)} onSave={loadUsers} />}
    </div>
  );
};

const AuditLogSection = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadLogs = async (p) => {
    try {
      const data = await api.getAuditLogs({ page: p, limit: 30 });
      setLogs(data.logs);
      setTotal(data.total);
    } catch {}
  };

  useEffect(() => { loadLogs(page); }, [page]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">Journal d'activité</h2>
        <ClipboardDocumentListIcon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.length === 0 && <p className="text-gray-500 text-center py-4">Aucune activité</p>}
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 p-2 text-sm hover:bg-gray-50 rounded">
            <div className="w-2 h-2 rounded-full mt-1.5 bg-accent flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-900">
                <span className="font-medium">{log.username}</span>
                <span className="text-gray-500"> a </span>
                <span className="text-gray-700">{log.action}</span>
                {log.entity_type && <span className="text-gray-500"> — {log.entity_type}{log.entity_id ? ` #${log.entity_id}` : ''}</span>}
              </p>
              <p className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString('fr-FR')}</p>
            </div>
          </div>
        ))}
      </div>
      {total > 30 && (
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-30">← Précédent</button>
          <span className="px-3 py-1 text-sm text-gray-500">Page {page} / {Math.ceil(total / 30)}</span>
          <button disabled={page >= Math.ceil(total / 30)} onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-30">Suivant →</button>
        </div>
      )}
    </div>
  );
};

export default Settings;
