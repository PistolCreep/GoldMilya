import { getDB } from '../../../lib/db';
import { ensureInit, setSession, verifyPassword } from '../../../lib/auth';

export default async function handler(req,res){
  await ensureInit();
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error:'MISSING_FIELDS' });

  const db = await getDB();
  const user = await db.get('SELECT * FROM users WHERE email=?', String(email).toLowerCase());
  if (!user) return res.status(401).json({ error:'INVALID_CREDENTIALS' });
  if (!verifyPassword(String(password), user.password)) return res.status(401).json({ error:'INVALID_CREDENTIALS' });

  await setSession(res, user.id);
  const safe = await db.get('SELECT id, role, name, email, apartment, created_at FROM users WHERE id=?', user.id);
  return res.status(200).json({ ok:true, user: safe });
}
