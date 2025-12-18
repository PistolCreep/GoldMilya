import { getDb } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

export default function handler(req,res){
  const admin = requireAdmin(req,res); if (!admin) return;
  const db = getDb();

  const items = db.prepare('SELECT * FROM feedback ORDER BY id DESC')
    .all()
    .map(row=>({ ...row, created_at: String(row.created_at).slice(0,19).replace('T',' ') }));

  return res.status(200).json({ items });
}
