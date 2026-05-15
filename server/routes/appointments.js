import { Router } from 'express';
import db from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const appointments = db.prepare(`
    SELECT a.*, p.nom || ' ' || p.prenom as patient_nom
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    ORDER BY a.date, a.heure
  `).all();
  res.json(appointments);
});

router.get('/month', (req, res) => {
  const { year, month } = req.query;
  const start = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`;
  const end = new Date(parseInt(year), parseInt(month) + 1, 0).toISOString().split('T')[0];

  const appointments = db.prepare(`
    SELECT a.*, p.nom || ' ' || p.prenom as patient_nom
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    WHERE a.date BETWEEN ? AND ?
    ORDER BY a.date, a.heure
  `).all(start, end);
  res.json(appointments);
});

router.get('/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const appointments = db.prepare(`
    SELECT a.*, p.nom || ' ' || p.prenom as patient_nom
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    WHERE a.date = ?
    ORDER BY a.heure
  `).all(today);
  res.json(appointments);
});

router.get('/upcoming', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const appointments = db.prepare(`
    SELECT a.*, p.nom || ' ' || p.prenom as patient_nom
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    WHERE a.date >= ?
    ORDER BY a.date, a.heure
    LIMIT 10
  `).all(today);
  res.json(appointments);
});

router.get('/:id', (req, res) => {
  const appointment = db.prepare(`
    SELECT a.*, p.nom || ' ' || p.prenom as patient_nom
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    WHERE a.id = ?
  `).get(req.params.id);
  if (!appointment) return res.status(404).json({ error: 'Rendez-vous non trouvé' });
  res.json(appointment);
});

router.post('/', requireRole('assistant'), (req, res) => {
  const { patient_id, date, heure, motif } = req.body;

  if (!patient_id || !date || !heure || !motif) {
    return res.status(400).json({ error: 'Le patient, la date, l\'heure et le motif sont requis' });
  }

  const patient = db.prepare('SELECT id FROM patients WHERE id = ?').get(patient_id);
  if (!patient) return res.status(404).json({ error: 'Patient non trouvé' });

  const result = db.prepare(`
    INSERT INTO appointments (patient_id, date, heure, motif)
    VALUES (?, ?, ?, ?)
  `).run(patient_id, date, heure, motif);

  const appointment = db.prepare(`
    SELECT a.*, p.nom || ' ' || p.prenom as patient_nom
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    WHERE a.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(appointment);
});

router.put('/:id', requireRole('secretary'), (req, res) => {
  const existing = db.prepare('SELECT id FROM appointments WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Rendez-vous non trouvé' });

  const { date, heure, motif, patient_id } = req.body;
  db.prepare('UPDATE appointments SET date = ?, heure = ?, motif = ?, patient_id = ? WHERE id = ?')
    .run(date, heure, motif, patient_id, req.params.id);

  const appointment = db.prepare(`
    SELECT a.*, p.nom || ' ' || p.prenom as patient_nom
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    WHERE a.id = ?
  `).get(req.params.id);
  res.json(appointment);
});

router.delete('/:id', requireRole('doctor'), (req, res) => {
  const existing = db.prepare('SELECT id FROM appointments WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Rendez-vous non trouvé' });

  db.prepare('DELETE FROM appointments WHERE id = ?').run(req.params.id);
  res.json({ message: 'Rendez-vous supprimé' });
});

export default router;
