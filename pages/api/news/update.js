import { getDB } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

function clean(value){
  return String(value || '').trim();
}

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  const admin = await requireAdmin(req,res);
  if (!admin) return;

  const { id, title, excerpt, content, image_url, is_published } = req.body || {};
  const newsId = Number(id);
  const nextTitle = clean(title);
  const nextExcerpt = clean(excerpt);
  const nextContent = clean(content);
  const nextImage = clean(image_url);

  if (!newsId) return res.status(400).json({ error:'BAD_ID' });
  if (!nextTitle || !nextExcerpt || !nextContent){
    return res.status(400).json({ error:'MISSING_FIELDS' });
  }

  const db = await getDB();
  const row = await db.get('SELECT id FROM news WHERE id=?', newsId);
  if (!row) return res.status(404).json({ error:'NOT_FOUND' });

  await db.run(
    `UPDATE news
     SET title=?, excerpt=?, content=?, image_url=?, is_published=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`,
    nextTitle,
    nextExcerpt,
    nextContent,
    nextImage || null,
    is_published === false || Number(is_published) === 0 ? 0 : 1,
    newsId
  );

  return res.status(200).json({ ok:true });
}
