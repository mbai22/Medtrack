import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(30, 64, 175, 0.8) 50%, rgba(16, 185, 129, 0.7) 100%)',
          }}
        ></div>
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              marginBottom: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <svg
              style={{ width: '48px', height: '48px', color: 'white' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(36px, 8vw, 64px)', fontWeight: 'bold', marginBottom: '12px', letterSpacing: '-0.025em' }}>
            MediTrack
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'clamp(16px, 4vw, 24px)', fontWeight: 300 }}>
            Gestion médicale simplifiée
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px', maxWidth: '800px', width: '100%' }}>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <svg
              style={{ width: '40px', height: '40px', color: 'white', margin: '0 auto 12px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>Rendez-vous</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>Gérez vos consultations</p>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <svg
              style={{ width: '40px', height: '40px', color: 'white', margin: '0 auto 12px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>Patients</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>Suivi personnalisé</p>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <svg
              style={{ width: '40px', height: '40px', color: 'white', margin: '0 auto 12px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>Statistiques</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>Analyse en temps réel</p>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          style={{
            backgroundColor: 'white',
            color: '#1e3a8a',
            padding: '14px 40px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '16px',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            width: '100%',
            maxWidth: '300px',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 35px 60px -15px rgba(0, 0, 0, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
          }}
        >
          <svg
            style={{ width: '20px', height: '20px', display: 'inline', verticalAlign: 'middle', marginRight: '8px' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Se connecter
        </button>

        {/* Doctor Info */}
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '32px', fontSize: '13px' }}>
          Dr. Bruno Hermann • Cardiologue
        </p>
      </div>

      {/* Animated Particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '256px',
            height: '256px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(64px)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '25%',
            width: '384px',
            height: '384px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '50%',
            filter: 'blur(64px)',
            animation: 'pulse 4s ease-in-out infinite 1s',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '192px',
            height: '192px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            filter: 'blur(64px)',
            animation: 'pulse 4s ease-in-out infinite 2s',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Landing;
