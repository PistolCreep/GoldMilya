import { getDB } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';
import { initDb } from '../../../lib/initDb';

function normalize(row){
  return {
    ...row,
    is_published: Number(row.is_published) === 1,
    created_at: row.created_at ? String(row.created_at).slice(0,19).replace('T',' ') : null,
    updated_at: row.updated_at ? String(row.updated_at).slice(0,19).replace('T',' ') : null
  };
}

export default async function handler(req,res){
  await initDb();
  if (req.method !== 'GET') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });

  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error:'BAD_ID' });

  const db = await getDB();
  const row = await db.get('SELECT * FROM news WHERE id=?', id);
  if (!row) return res.status(404).json({ error:'NOT_FOUND' });

  if (Number(row.is_published) !== 1){
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') return res.status(404).json({ error:'NOT_FOUND' });
  }

  return res.status(200).json({ item: normalize(row) });
}
