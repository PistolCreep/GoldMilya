import { getDB } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

const statusLabels = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена'
};

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const admin = await requireAdmin(req,res);
  if (!admin) return;

  const { requestId, status } = req.body || {};
  const id = Number(requestId);
  const allowed = new Set(['new','in_progress','done']);
  if (!id || !allowed.has(status)) return res.status(400).json({ error:'BAD_INPUT' });

  const db = await getDB();
  const row = await db.get('SELECT * FROM requests WHERE id=?', id);
  if (!row) return res.status(404).json({ error:'NOT_FOUND' });

  await db.run('UPDATE requests SET status=? WHERE id=?', status, id);
  await db.run(
    'INSERT INTO messages(request_id,sender_role,message) VALUES (?,?,?)',
    id,
    'admin',
    `Статус изменен на: ${statusLabels[status] || status}`
  );

  return res.status(200).json({ ok:true });
}
