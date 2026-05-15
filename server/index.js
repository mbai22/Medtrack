import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { initDb, default as db } from './db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import patientRoutes from './routes/patients.js';
import consultationRoutes from './routes/consultations.js';
import appointmentRoutes from './routes/appointments.js';
import statsRoutes from './routes/stats.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import auditRoutes from './routes/audit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Audit logging middleware for important actions
const auditLog = (action, entity_type, entity_id, details) => (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    if (res.statusCode < 400 && req.user) {
      try {
        db.prepare(
          'INSERT INTO audit_logs (user_id, username, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).run(req.user.id, req.user.username, action, entity_type || null, entity_id || null, details || null, req.ip);
        db.save();
      } catch {}
    }
    return originalJson(body);
  };
  next();
};

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

const seedData = () => {
  const patientCount = db.prepare('SELECT COUNT(*) as count FROM patients').get().count;
  if (patientCount === 0) {
    console.log('Seeding default data...');
    const insertPatient = db.prepare(`
      INSERT INTO patients (nom, prenom, date_naissance, sexe, telephone, lieu, profession, groupe_sanguin, allergies, antecedents, statut)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const patients = [
      ['Dupont', 'Jean', '1985-06-15', 'Homme', '0612345678', 'Paris', 'Ingénieur', 'A+', 'Aucune', 'Aucun', 'Actif'],
      ['Martin', 'Sophie', '1990-03-22', 'Femme', '0623456789', 'Lyon', 'Professeur', 'O+', 'Pénicilline', 'Asthme', 'Actif'],
      ['Bernard', 'Pierre', '1978-11-08', 'Homme', '0634567890', 'Marseille', 'Médecin', 'B+', 'Aucune', 'Hypertension', 'Actif'],
      ['Petit', 'Marie', '1995-07-30', 'Femme', '0645678901', 'Toulouse', 'Avocate', 'AB-', 'Arachides', 'Aucun', 'Actif'],
      ['Durand', 'Luc', '2000-01-14', 'Homme', '0656789012', 'Bordeaux', 'Étudiant', 'A-', 'Aucune', 'Aucun', 'Actif'],
      ['Leroy', 'Camille', '1982-09-05', 'Femme', '0667890123', 'Lille', 'Architecte', 'O-', 'Latex', 'Diabète', 'Actif'],
      ['Moreau', 'Antoine', '1970-12-25', 'Homme', '0678901234', 'Strasbourg', 'Commerçant', 'B-', 'Aucune', 'Cholestérol', 'Actif'],
      ['Simon', 'Emma', '2002-04-18', 'Femme', '0689012345', 'Nantes', 'Infirmière', 'AB+', 'Sulfamides', 'Aucun', 'Actif'],
    ];
    for (const p of patients) insertPatient.run(...p);

    const insertConsultation = db.prepare(
      'INSERT INTO consultations (patient_id, date, motif, symptomes, diagnostic, traitement) VALUES (?, ?, ?, ?, ?, ?)'
    );
    insertConsultation.run(1, '2026-05-10T09:00:00', 'Fièvre persistante', 'Fièvre à 38.5°C depuis 3 jours, toux sèche', 'Rhinite virale', 'Paracétamol 1g x3/jour, repos');
    insertConsultation.run(2, '2026-05-11T14:00:00', 'Douleurs abdominales', 'Douleurs épigastriques après repas', 'Gastrite légère', 'Oméprazole 20mg/jour');
    insertConsultation.run(3, '2026-05-12T10:00:00', 'Suivi hypertension', 'TA 135/85, bon contrôle', 'Hypertension stable', 'Maintenir traitement actuel');
    console.log('Default data seeded.');
  }

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const users = [
      { username: 'drsamuel', email: 'samuel.hermann@meditrack.fr', password: 'meditrack123', role: 'doctor', nom: 'Hermann', prenom: 'Samuel' },
      { username: 'secretaire', email: 'aissatou.diallo@meditrack.fr', password: 'secretaire123', role: 'secretary', nom: 'Diallo', prenom: 'Aïssatou' },
      { username: 'assistante', email: 'fatou.ndiaye@meditrack.fr', password: 'assistante123', role: 'assistant', nom: 'Ndiaye', prenom: 'Fatou' },
    ];
    for (const u of users) {
      const hashed = bcrypt.hashSync(u.password, 10);
      db.prepare('INSERT INTO users (username, email, password, role, nom, prenom) VALUES (?, ?, ?, ?, ?, ?)').run(u.username, u.email, hashed, u.role, u.nom, u.prenom);
    }
    console.log('Users created: Dr. Samuel Hermann, Aïssatou (secrétaire), Fatou (assistante)');
  }
  db.save();
};

// Auto-backup every 10 minutes
const BACKUP_DIR = path.join(__dirname, 'backups');
const startBackupScheduler = () => {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  setInterval(() => {
    try {
      const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const backupPath = path.join(BACKUP_DIR, `meditrack-backup-${date}.db`);
      const data = db.export();
      fs.writeFileSync(backupPath, Buffer.from(data));
      // Keep only last 20 backups
      const files = fs.readdirSync(BACKUP_DIR).sort().reverse();
      if (files.length > 20) {
        for (const f of files.slice(20)) fs.unlinkSync(path.join(BACKUP_DIR, f));
      }
      console.log(`Backup saved: ${backupPath}`);
    } catch (err) {
      console.error('Backup failed:', err.message);
    }
  }, 10 * 60 * 1000);
};

// Auto-create notifications for tomorrow's appointments
const checkTomorrowAppointments = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const appointments = db.prepare(`
    SELECT a.*, p.nom || ' ' || p.prenom as patient_nom FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id WHERE a.date = ?
  `).all(dateStr);

  for (const apt of appointments) {
    const existing = db.prepare(
      'SELECT id FROM notifications WHERE type = ? AND related_id = ? AND created_at >= datetime("now", "-1 day")'
    ).get('rdv_rappel', apt.id);
    if (!existing) {
      const users = db.prepare('SELECT id FROM users').all();
      for (const u of users) {
        db.prepare(
          'INSERT INTO notifications (user_id, type, message, related_id) VALUES (?, ?, ?, ?)'
        ).run(u.id, 'rdv_rappel', `Rappel: RDV demain avec ${apt.patient_nom} à ${apt.heure}`, apt.id);
      }
    }
  }
  if (appointments.length > 0) {
    db.save();
    console.log(`Rappels créés pour ${appointments.length} RDV demain`);
  }
};

const start = async () => {
  await initDb();
  seedData();

  startBackupScheduler();
  checkTomorrowAppointments();
  setInterval(checkTomorrowAppointments, 60 * 60 * 1000); // Check every hour

  app.listen(PORT, () => {
    console.log(`MediTrack API running on http://localhost:${PORT}`);
  });
};

start();
