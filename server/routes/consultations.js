import { Router } from 'express';
import db from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const total = db.prepare('SELECT COUNT(*) as count FROM consultations').get();
  const consultations = db.prepare(`
    SELECT c.*, p.nom || ' ' || p.prenom as patient_nom
    FROM consultations c
    LEFT JOIN patients p ON c.patient_id = p.id
    ORDER BY c.date DESC
    LIMIT ? OFFSET ?
  `).all(parseInt(limit), offset);

  res.json({ consultations, total: total.count, page: parseInt(page), limit: parseInt(limit) });
});

router.get('/patient/:patientId', (req, res) => {
  const consultations = db.prepare(`
    SELECT * FROM consultations WHERE patient_id = ? ORDER BY date DESC
  `).all(req.params.patientId);
  res.json(consultations);
});

router.get('/:id', (req, res) => {
  const consultation = db.prepare(`
    SELECT c.*, p.nom || ' ' || p.prenom as patient_nom
    FROM consultations c
    LEFT JOIN patients p ON c.patient_id = p.id
    WHERE c.id = ?
  `).get(req.params.id);
  if (!consultation) return res.status(404).json({ error: 'Consultation non trouvée' });
  res.json(consultation);
});

router.post('/', requireRole('secretary'), (req, res) => {
  const { patient_id, date, motif, symptomes, diagnostic, traitement, examens, notes, prochain_rendez_vous } = req.body;

  if (!patient_id || !motif || !diagnostic) {
    return res.status(400).json({ error: 'Le patient, le motif et le diagnostic sont requis' });
  }

  const patient = db.prepare('SELECT id FROM patients WHERE id = ?').get(patient_id);
  if (!patient) return res.status(404).json({ error: 'Patient non trouvé' });

  const result = db.prepare(`
    INSERT INTO consultations (patient_id, date, motif, symptomes, diagnostic, traitement, examens, notes, prochain_rendez_vous)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(patient_id, date || new Date().toISOString(), motif, symptomes || '', diagnostic, traitement || '', examens || '', notes || '', prochain_rendez_vous || '');

  const consultation = db.prepare('SELECT * FROM consultations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(consultation);
});

router.put('/:id', requireRole('secretary'), (req, res) => {
  const existing = db.prepare('SELECT id FROM consultations WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Consultation non trouvée' });

  const { date, motif, symptomes, diagnostic, traitement, examens, notes, prochain_rendez_vous } = req.body;

  db.prepare(`
    UPDATE consultations SET date = ?, motif = ?, symptomes = ?, diagnostic = ?, traitement = ?, examens = ?, notes = ?, prochain_rendez_vous = ?
    WHERE id = ?
  `).run(date, motif, symptomes || '', diagnostic, traitement || '', examens || '', notes || '', prochain_rendez_vous || '', req.params.id);

  const consultation = db.prepare('SELECT * FROM consultations WHERE id = ?').get(req.params.id);
  res.json(consultation);
});

router.delete('/:id', requireRole('doctor'), (req, res) => {
  const existing = db.prepare('SELECT id FROM consultations WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Consultation non trouvée' });

  db.prepare('DELETE FROM consultations WHERE id = ?').run(req.params.id);
  res.json({ message: 'Consultation supprimée' });
});

export default router;
