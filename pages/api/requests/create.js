import { getDb } from '../../../lib/db';
import { requireUser } from '../../../lib/auth';

export default function handler(req,res){
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const user = requireUser(req,res); if (!user) return;
  const { title, category, description } = req.body || {};
  if (!title || !category || !description) return res.status(400).json({ error:'MISSING_FIELDS' });

  const db = getDb();
  const info = db.prepare('INSERT INTO requests(user_id,title,category,description,status) VALUES (?,?,?,?,?)')
    .run(user.id, String(title), String(category), String(description), 'new');

  db.prepare('INSERT INTO messages(request_id,sender_role,message) VALUES (?,?,?)')
    .run(info.lastInsertRowid, 'user', 'Заявка создана. Ожидайте ответа УК.');

  return res.status(200).json({ ok:true, id: info.lastInsertRowid });
}
