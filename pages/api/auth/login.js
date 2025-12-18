import { getDb } from '../../../lib/db';
import { ensureInit, setSession, verifyPassword } from '../../../lib/auth';

export default function handler(req,res){
  ensureInit();
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error:'MISSING_FIELDS' });

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email=?').get(String(email).toLowerCase());
  if (!user) return res.status(401).json({ error:'INVALID_CREDENTIALS' });
  if (!verifyPassword(String(password), user.password)) return res.status(401).json({ error:'INVALID_CREDENTIALS' });

  setSession(res, user.id);
  const safe = db.prepare('SELECT id, role, name, email, apartment, created_at FROM users WHERE id=?').get(user.id);
  return res.status(200).json({ ok:true, user: safe });
}
