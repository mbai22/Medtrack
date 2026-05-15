import { Router } from 'express';
import db from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', requireRole('doctor'), (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const total = db.prepare('SELECT COUNT(*) as count FROM audit_logs').get();
  const logs = db.prepare(
    'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(parseInt(limit), offset);

  res.json({ logs, total: total.count, page: parseInt(page), limit: parseInt(limit) });
});

router.post('/', (req, res) => {
  const { action, entity_type, entity_id, details } = req.body;
  if (!action) return res.status(400).json({ error: 'Action requise' });

  db.prepare(
    'INSERT INTO audit_logs (user_id, username, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, req.user.username, action, entity_type || null, entity_id || null, details || null, req.ip);
  db.save();

  res.status(201).json({ success: true });
});

export default router;
