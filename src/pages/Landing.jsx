import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('meditrack_token');
    if (token) {
      (async () => {
        try {
          const res = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
          if (res.ok) navigate('/dashboard', { replace: true });
        } catch {}
      })();
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://i.pinimg.com/1200x/3c/81/e7/3c81e700f58ffa1512728dcb61971d46.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <nav className="relative z-20 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-white font-bold text-xl">MediTrack</span>
        </div>
        <button onClick={() => navigate('/login')}
          className="w-14 h-14 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-all active:scale-90">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
        style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className="max-w-3xl">
          <h1 className="text-white font-bold mb-4 tracking-tight"
            style={{ fontSize: 'clamp(40px, 10vw, 88px)', lineHeight: 1.1 }}>
            MediTrack
          </h1>
          <p className="text-white/80 text-xl lg:text-2xl font-light mb-10">
            Gestion médicale simplifiée
          </p>
          <button onClick={() => navigate('/login')}
            className="bg-white text-primary font-semibold px-10 py-3.5 rounded-full text-base shadow-2xl hover:scale-105 transition-transform">
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
