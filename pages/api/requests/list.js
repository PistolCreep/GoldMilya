import { getDb } from '../../../lib/db';
import { requireUser } from '../../../lib/auth';

export default function handler(req,res){
  const user = requireUser(req,res); if (!user) return;
  const db = getDb();
  const scope = String(req.query.scope || 'mine');

  if (scope === 'all'){
    if (user.role !== 'admin') return res.status(403).json({ error:'FORBIDDEN' });

    const items = db.prepare(`
      SELECT r.*, u.name as user_name, u.apartment as apartment
      FROM requests r
      JOIN users u ON u.id = r.user_id
      ORDER BY r.id DESC
    `).all().map(row => ({
      ...row,
      created_at: String(row.created_at).slice(0,19).replace('T',' ')
    }));

    return res.status(200).json({ items });
  }

  const items = db.prepare('SELECT * FROM requests WHERE user_id=? ORDER BY id DESC')
    .all(user.id)
    .map(row => ({
      ...row,
      created_at: String(row.created_at).slice(0,19).replace('T',' ')
    }));

  return res.status(200).json({ items });
}
