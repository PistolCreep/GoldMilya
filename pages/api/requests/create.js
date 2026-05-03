import { getDB } from '../../../lib/db';
import { requireUser } from '../../../lib/auth';

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const user = await requireUser(req,res);
  if (!user) return;

  const { title, category, description } = req.body || {};
  if (!title || !category || !description) return res.status(400).json({ error:'MISSING_FIELDS' });

  const db = await getDB();
  const info = await db.run(
    'INSERT INTO requests(user_id,title,category,description,status) VALUES (?,?,?,?,?)',
    user.id,
    String(title),
    String(category),
    String(description),
    'new'
  );

  await db.run(
    'INSERT INTO messages(request_id,sender_role,message) VALUES (?,?,?)',
    info.lastID,
    'user',
    'Заявка создана. Ожидайте ответа управляющей компании.'
  );

  return res.status(200).json({ ok:true, id: info.lastID });
}
