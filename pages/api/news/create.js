import { getDB } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

function clean(value){
  return String(value || '').trim();
}

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const admin = await requireAdmin(req,res);
  if (!admin) return;

  const { title, excerpt, content, image_url, is_published } = req.body || {};
  const nextTitle = clean(title);
  const nextExcerpt = clean(excerpt);
  const nextContent = clean(content);
  const nextImage = clean(image_url);

  if (!nextTitle || !nextExcerpt || !nextContent){
    return res.status(400).json({ error:'MISSING_FIELDS' });
  }

  const db = await getDB();
  const info = await db.run(
    'INSERT INTO news(title,excerpt,content,image_url,is_published) VALUES (?,?,?,?,?)',
    nextTitle,
    nextExcerpt,
    nextContent,
    nextImage || null,
    is_published === false || Number(is_published) === 0 ? 0 : 1
  );

  return res.status(200).json({ ok:true, id: info.lastID });
}
