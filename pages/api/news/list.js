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

  const db = await getDB();
  const wantsAdmin = String(req.query.admin || '') === '1';

  if (wantsAdmin){
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') return res.status(403).json({ error:'FORBIDDEN' });

    const rows = await db.all('SELECT * FROM news ORDER BY id DESC');
    return res.status(200).json({ items: rows.map(normalize) });
  }

  const rows = await db.all('SELECT * FROM news WHERE is_published=1 ORDER BY id DESC');
  return res.status(200).json({ items: rows.map(normalize) });
}
