import { Router } from 'express';
import db from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const { search, sexe, statut, page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let conditions = [];
  let params = [];

  if (search) {
    conditions.push('(nom LIKE ? OR prenom LIKE ? OR telephone LIKE ?)');
    const q = `%${search}%`;
    params.push(q, q, q);
  }
  if (sexe) {
    conditions.push('sexe = ?');
    params.push(sexe);
  }
  if (statut) {
    conditions.push('statut = ?');
    params.push(statut);
  }

  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  const total = db.prepare(`SELECT COUNT(*) as count FROM patients ${where}`).get(...params);
  const patients = db.prepare(`SELECT * FROM patients ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, parseInt(limit), offset);

  res.json({ patients, total: total.count, page: parseInt(page), limit: parseInt(limit) });
});

router.get('/:id', (req, res) => {
  const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient non trouvé' });
  res.json(patient);
});

router.post('/', requireRole('secretary'), (req, res) => {
  const { nom, prenom, date_naissance, sexe, telephone, telephone_secondaire, lieu, profession, groupe_sanguin, allergies, antecedents, statut } = req.body;

  if (!nom || !prenom) {
    return res.status(400).json({ error: 'Le nom et le prénom sont requis' });
  }

  const result = db.prepare(`
    INSERT INTO patients (nom, prenom, date_naissance, sexe, telephone, telephone_secondaire, lieu, profession, groupe_sanguin, allergies, antecedents, statut)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(nom, prenom, date_naissance || null, sexe || null, telephone || null, telephone_secondaire || '', lieu || null, profession || '', groupe_sanguin || null, allergies || '', antecedents || '', statut || 'Actif');

  const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(patient);
});

router.put('/:id', requireRole('secretary'), (req, res) => {
  const existing = db.prepare('SELECT id FROM patients WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Patient non trouvé' });

  const { nom, prenom, date_naissance, sexe, telephone, telephone_secondaire, lieu, profession, groupe_sanguin, allergies, antecedents, statut } = req.body;

  db.prepare(`
    UPDATE patients SET nom = ?, prenom = ?, date_naissance = ?, sexe = ?, telephone = ?, telephone_secondaire = ?, lieu = ?, profession = ?, groupe_sanguin = ?, allergies = ?, antecedents = ?, statut = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(nom, prenom, date_naissance, sexe, telephone, telephone_secondaire || '', lieu, profession || '', groupe_sanguin, allergies || '', antecedents || '', statut || 'Actif', req.params.id);

  const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
  res.json(patient);
});

router.delete('/:id', requireRole('doctor'), (req, res) => {
  const existing = db.prepare('SELECT id FROM patients WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Patient non trouvé' });

  db.prepare('DELETE FROM consultations WHERE patient_id = ?').run(req.params.id);
  db.prepare('DELETE FROM appointments WHERE patient_id = ?').run(req.params.id);
  db.prepare('DELETE FROM patients WHERE id = ?').run(req.params.id);

  res.json({ message: 'Patient supprimé' });
});

export default router;
