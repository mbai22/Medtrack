import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const isAdminOrDoctor = (req, res, next) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé au médecin' });
  }
  next();
};

router.get('/', isAdminOrDoctor, (req, res) => {
  const users = db.prepare('SELECT id, username, email, role, nom, prenom, created_at FROM users ORDER BY role, nom').all();
  res.json(users);
});

router.get('/contacts', (req, res) => {
  const users = db.prepare('SELECT id, role, nom, prenom FROM users WHERE id != ? ORDER BY role, nom').all(req.user.id);
  res.json(users);
});

router.get('/:id', (req, res) => {
  const user = db.prepare('SELECT id, username, email, role, nom, prenom, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  if (req.user.id !== user.id && req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès interdit' });
  }
  res.json(user);
});

router.post('/', isAdminOrDoctor, (req, res) => {
  const { username, email, password, role, nom, prenom } = req.body;

  if (!username || !password || !nom || !prenom) {
    return res.status(400).json({ error: 'Nom d\'utilisateur, mot de passe, nom et prénom requis' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
  }

  if (email) {
    const emailExists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (emailExists) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
  }

  if (!['doctor', 'secretary', 'assistant'].includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (username, email, password, role, nom, prenom) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(username.toLowerCase().trim(), email?.toLowerCase().trim() || null, hashed, role, nom, prenom);

  db.save();

  const user = db.prepare('SELECT id, username, email, role, nom, prenom, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(user);
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès interdit' });
  }

  const { nom, prenom, email, password, role } = req.body;

  if (role && req.user.role === 'doctor' && !['doctor', 'secretary', 'assistant'].includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }

  if (email && email.toLowerCase().trim() !== existing.email) {
    const emailExists = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email.toLowerCase().trim(), req.params.id);
    if (emailExists) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
  }

  let sql = 'UPDATE users SET nom = ?, prenom = ?, email = ?';
  let params = [nom || existing.nom, prenom || existing.prenom, email ? email.toLowerCase().trim() : existing.email];

  if (password) {
    sql += ', password = ?';
    params.push(bcrypt.hashSync(password, 10));
  }

  if (role && (req.user.role === 'doctor' || req.user.role === 'admin')) {
    sql += ', role = ?';
    params.push(role);
  }

  sql += ' WHERE id = ?';
  params.push(req.params.id);

  db.prepare(sql).run(...params);
  db.save();

  const user = db.prepare('SELECT id, username, email, role, nom, prenom, created_at FROM users WHERE id = ?').get(req.params.id);
  res.json(user);
});

router.delete('/:id', isAdminOrDoctor, (req, res) => {
  const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  if (parseInt(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'Vous ne pouvez pas vous supprimer vous-même' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  db.save();
  res.json({ message: 'Utilisateur supprimé' });
});

export default router;
