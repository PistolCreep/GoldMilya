import { getDb } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

export default function handler(req,res){
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const admin = requireAdmin(req,res); if (!admin) return;
  const { requestId, status } = req.body || {};
  const id = Number(requestId);
  const allowed = new Set(['new','in_progress','done']);
  if (!id || !allowed.has(status)) return res.status(400).json({ error:'BAD_INPUT' });

  const db = getDb();
  const row = db.prepare('SELECT * FROM requests WHERE id=?').get(id);
  if (!row) return res.status(404).json({ error:'NOT_FOUND' });

  db.prepare('UPDATE requests SET status=? WHERE id=?').run(status, id);
  db.prepare('INSERT INTO messages(request_id,sender_role,message) VALUES (?,?,?)')
    .run(id, 'admin', `Статус изменён на: ${status}`);

  return res.status(200).json({ ok:true });
}
