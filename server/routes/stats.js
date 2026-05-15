import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const totalPatients = db.prepare('SELECT COUNT(*) as count FROM patients').get().count;
  const consultationsToday = db.prepare("SELECT COUNT(*) as count FROM consultations WHERE date(created_at) = ?").get(today).count;
  const newPatientsThisMonth = db.prepare("SELECT COUNT(*) as count FROM patients WHERE date(created_at) >= ?").get(monthStart).count;
  const upcomingAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE date >= ?").get(today).count;

  const lastPatients = db.prepare('SELECT * FROM patients ORDER BY created_at DESC LIMIT 10').all();
  const todayAppts = db.prepare(`
    SELECT a.*, p.nom || ' ' || p.prenom as patient_nom
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    WHERE a.date = ? ORDER BY a.heure
  `).all(today);
  const recentConsultations = db.prepare(`
    SELECT c.*, p.nom || ' ' || p.prenom as patient_nom
    FROM consultations c
    LEFT JOIN patients p ON c.patient_id = p.id
    ORDER BY c.date DESC LIMIT 10
  `).all();

  res.json({
    totalPatients,
    consultationsToday,
    newPatientsThisMonth,
    upcomingAppointments,
    lastPatients,
    todayAppointments: todayAppts,
    recentConsultations,
  });
});

export default router;
