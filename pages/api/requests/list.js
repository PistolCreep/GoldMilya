import { getDB } from '../../../lib/db';
import { requireUser } from '../../../lib/auth';

export default async function handler(req,res){
  const user = await requireUser(req,res); if (!user) return;
  const db = await getDB();
  const scope = String(req.query.scope || 'mine');

  if (scope === 'all'){
    if (user.role !== 'admin') return res.status(403).json({ error:'FORBIDDEN' });

    const rows = await db.all(`
      SELECT r.*, u.name as user_name, u.apartment as apartment
      FROM requests r
      JOIN users u ON u.id = r.user_id
      ORDER BY r.id DESC
    `);
    const items = rows.map(row => ({
      ...row,
      created_at: String(row.created_at).slice(0,19).replace('T',' ')
    }));

    return res.status(200).json({ items });
  }

  const rows = await db.all('SELECT * FROM requests WHERE user_id=? ORDER BY id DESC', user.id);
  const items = rows.map(row => ({
    ...row,
    created_at: String(row.created_at).slice(0,19).replace('T',' ')
  }));

  return res.status(200).json({ items });
}
