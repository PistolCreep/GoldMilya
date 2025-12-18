import { getDB } from '../../../lib/db';
import { requireUser } from '../../../lib/auth';

export default async function handler(req,res){
  const user = await requireUser(req,res); if (!user) return;
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error:'BAD_ID' });

  const db = await getDB();
  const reqRow = await db.get(`
    SELECT r.*, u.name as user_name, u.apartment as apartment
    FROM requests r
    JOIN users u ON u.id = r.user_id
    WHERE r.id=?
  `, id);

  if (!reqRow) return res.status(404).json({ error:'NOT_FOUND' });

  if (user.role !== 'admin' && reqRow.user_id !== user.id){
    return res.status(403).json({ error:'FORBIDDEN' });
  }

  const messages = (await db.all('SELECT * FROM messages WHERE request_id=? ORDER BY id ASC', id))
    .map(m=>({ ...m, created_at: String(m.created_at).slice(0,19).replace('T',' ') }));

  return res.status(200).json({
    ...reqRow,
    created_at: String(reqRow.created_at).slice(0,19).replace('T',' '),
    messages
  });
}
