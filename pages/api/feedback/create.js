import { getDb } from '../../../lib/db';
import { ensureInit } from '../../../lib/auth';

export default function handler(req,res){
  ensureInit();
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const { name, email, topic, message } = req.body || {};
  if (!name || !topic || !message) return res.status(400).json({ error:'MISSING_FIELDS' });

  const db = getDb();
  db.prepare('INSERT INTO feedback(name,email,topic,message) VALUES (?,?,?,?)')
    .run(String(name), email ? String(email) : null, String(topic), String(message));

  return res.status(200).json({ ok:true });
}
