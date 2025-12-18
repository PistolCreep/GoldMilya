import { getDB } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

export default async function handler(req,res){
  const admin = await requireAdmin(req,res); if (!admin) return;
  const db = await getDB();

  const rows = await db.all('SELECT * FROM feedback ORDER BY id DESC');
  const items = rows.map(row=>({ ...row, created_at: String(row.created_at).slice(0,19).replace('T',' ') }));

  return res.status(200).json({ items });
}
