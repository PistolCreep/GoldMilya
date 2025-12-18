import { getDb } from '../../../lib/db';
import { requireUser } from '../../../lib/auth';

export default function handler(req,res){
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const user = requireUser(req,res); if (!user) return;
  const { requestId, message } = req.body || {};
  const id = Number(requestId);
  if (!id || !message) return res.status(400).json({ error:'MISSING_FIELDS' });

  const db = getDb();
  const reqRow = db.prepare('SELECT * FROM requests WHERE id=?').get(id);
  if (!reqRow) return res.status(404).json({ error:'NOT_FOUND' });
  if (user.role !== 'admin' && reqRow.user_id !== user.id) return res.status(403).json({ error:'FORBIDDEN' });

  db.prepare('INSERT INTO messages(request_id,sender_role,message) VALUES (?,?,?)')
    .run(id, user.role === 'admin' ? 'admin' : 'user', String(message));

  return res.status(200).json({ ok:true });
}
