import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const messages = db.prepare(`
    SELECT m.*, u1.prenom || ' ' || u1.nom as sender_nom, u2.prenom || ' ' || u2.nom as receiver_nom
    FROM messages m
    LEFT JOIN users u1 ON m.sender_id = u1.id
    LEFT JOIN users u2 ON m.receiver_id = u2.id
    WHERE m.sender_id = ? OR m.receiver_id = ?
    ORDER BY m.created_at DESC
  `).all(req.user.id, req.user.id);
  res.json(messages);
});

router.get('/unread-count', (req, res) => {
  const count = db.prepare('SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND read = 0').get(req.user.id);
  res.json(count);
});

router.post('/', (req, res) => {
  const { receiver_id, subject, content } = req.body;
  if (!receiver_id || !subject || !content) {
    return res.status(400).json({ error: 'Destinataire, sujet et contenu requis' });
  }

  const result = db.prepare(
    'INSERT INTO messages (sender_id, receiver_id, subject, content) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, receiver_id, subject, content);

  db.prepare(
    'INSERT INTO notifications (user_id, type, message, related_id) VALUES (?, ?, ?, ?)'
  ).run(receiver_id, 'message', `Nouveau message: ${subject}`, result.lastInsertRowid);

  db.save();

  const message = db.prepare(`
    SELECT m.*, u1.prenom || ' ' || u1.nom as sender_nom, u2.prenom || ' ' || u2.nom as receiver_nom
    FROM messages m
    LEFT JOIN users u1 ON m.sender_id = u1.id
    LEFT JOIN users u2 ON m.receiver_id = u2.id
    WHERE m.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(message);
});

router.put('/:id/read', (req, res) => {
  db.prepare('UPDATE messages SET read = 1 WHERE id = ? AND receiver_id = ?').run(req.params.id, req.user.id);
  db.prepare('UPDATE notifications SET read = 1 WHERE related_id = ? AND user_id = ? AND type = ?').run(req.params.id, req.user.id, 'message');
  db.save();
  res.json({ success: true });
});

router.put('/read-all/:senderId', (req, res) => {
  const { senderId } = req.params;
  db.prepare('UPDATE messages SET read = 1 WHERE sender_id = ? AND receiver_id = ? AND read = 0').run(senderId, req.user.id);
  db.prepare(`UPDATE notifications SET read = 1 WHERE related_id IN (SELECT id FROM messages WHERE sender_id = ? AND receiver_id = ?) AND user_id = ? AND type = ?`).run(senderId, req.user.id, req.user.id, 'message');
  db.save();
  res.json({ success: true });
});

export default router;
