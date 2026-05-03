import { getDB } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const admin = await requireAdmin(req,res);
  if (!admin) return;

  const id = Number(req.body?.id);
  if (!id) return res.status(400).json({ error:'BAD_ID' });

  const db = await getDB();
  const row = await db.get('SELECT id FROM news WHERE id=?', id);
  if (!row) return res.status(404).json({ error:'NOT_FOUND' });

  await db.run('DELETE FROM news WHERE id=?', id);
  return res.status(200).json({ ok:true });
}
