import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return res.status(400).json({ error: 'Email ou nom d\'utilisateur et mot de passe requis' });
  }

  let user;
  if (email) {
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  } else {
    user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.toLowerCase().trim());
  }

  if (!user) {
    return res.status(401).json({ error: 'Email/Utilisateur ou mot de passe incorrect' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Email/Utilisateur ou mot de passe incorrect' });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role, nom: user.nom, prenom: user.prenom }
  });
});

router.get('/check', (req, res) => {
  const user = db.prepare('SELECT id FROM users LIMIT 1').get();
  res.json({ configured: !!user });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, username, email, role, nom, prenom FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  res.json(user);
});

export default router;
