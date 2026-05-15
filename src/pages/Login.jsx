import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { api } from '../services/api';

const USERS = [
  { username: 'drsamuel', label: 'Dr. Samuel Hermann', role: 'doctor' },
  { username: 'secretaire', label: 'Aïssatou (Secrétaire)', role: 'secretary' },
  { username: 'assistante', label: 'Fatou (Assistante)', role: 'assistant' },
];

const Login = ({ onLogin, isConfigured }) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState('drsamuel');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConfigured) {
      navigate('/');
    }
  }, [isConfigured, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Veuillez entrer un mot de passe');
      return;
    }

    setLoading(true);

    try {
      const data = await api.login(selectedUser, password);
      localStorage.setItem('meditrack_token', data.token);
      localStorage.setItem('current_user', JSON.stringify(data.user));
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">MediTrack</h1>
          <p className="text-gray-600">Connectez-vous pour accéder à l'application</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Utilisateur
            </label>
            <div className="grid gap-2">
              {USERS.map((u) => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => setSelectedUser(u.username)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left ${
                    selectedUser === u.username
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    selectedUser === u.username ? 'bg-accent text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {u.label.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{u.label}</p>
                    <p className="text-xs text-gray-500 capitalize">{u.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
