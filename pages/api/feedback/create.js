import { getDB } from '../../../lib/db';
import { ensureInit } from '../../../lib/auth';

export default async function handler(req,res){
  await ensureInit();
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const { name, email, topic, message } = req.body || {};
  if (!name || !topic || !message) return res.status(400).json({ error:'MISSING_FIELDS' });

  const db = await getDB();
  await db.run('INSERT INTO feedback(name,email,topic,message) VALUES (?,?,?,?)',
    String(name), email ? String(email) : null, String(topic), String(message));

  return res.status(200).json({ ok:true });
}
