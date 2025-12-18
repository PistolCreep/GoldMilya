import { getDb } from '../../../lib/db';
import { ensureInit, setSession, hashPassword } from '../../../lib/auth';

export default function handler(req,res){
  ensureInit();
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const { name, apartment, email, password } = req.body || {};
  if (!name || !apartment || !email || !password) return res.status(400).json({ error:'MISSING_FIELDS' });

  const db = getDb();
  const exists = db.prepare('SELECT id FROM users WHERE email=?').get(String(email).toLowerCase());
  if (exists) return res.status(409).json({ error:'EMAIL_EXISTS' });

  const hash = hashPassword(String(password));
  const info = db.prepare('INSERT INTO users(role,name,email,password,apartment) VALUES (?,?,?,?,?)')
    .run('user', String(name), String(email).toLowerCase(), hash, String(apartment));

  setSession(res, info.lastInsertRowid);
  const user = db.prepare('SELECT id, role, name, email, apartment, created_at FROM users WHERE id=?').get(info.lastInsertRowid);
  return res.status(200).json({ ok:true, user });
}
