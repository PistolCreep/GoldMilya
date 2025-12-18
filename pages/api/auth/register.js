import { getDB } from '../../../lib/db';
import { ensureInit, setSession, hashPassword } from '../../../lib/auth';

export default async function handler(req,res){
  await ensureInit();
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const { name, apartment, email, password } = req.body || {};
  if (!name || !apartment || !email || !password) return res.status(400).json({ error:'MISSING_FIELDS' });

  const db = await getDB();
  const exists = await db.get('SELECT id FROM users WHERE email=?', String(email).toLowerCase());
  if (exists) return res.status(409).json({ error:'EMAIL_EXISTS' });

  const hash = hashPassword(String(password));
  const info = await db.run('INSERT INTO users(role,name,email,password,apartment) VALUES (?,?,?,?,?)',
    'user', String(name), String(email).toLowerCase(), hash, String(apartment));

  await setSession(res, info.lastID);
  const user = await db.get('SELECT id, role, name, email, apartment, created_at FROM users WHERE id=?', info.lastID);
  return res.status(200).json({ ok:true, user });
}
