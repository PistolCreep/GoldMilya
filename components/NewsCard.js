import Link from 'next/link';

function formatDate(value){
  if (!value) return '';
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString('ru-RU', { day:'2-digit', month:'long', year:'numeric' });
}

export default function NewsCard({ item, compact = false }){
  const image = item?.image_url || '/images/news-maintenance.jpg';

  return (
    <article className="news-card">
      <div className="news-image" style={{ '--news-image': `url("${image}")` }} />
      <div className="news-body">
        <p className="news-meta">{formatDate(item?.created_at)}</p>
        <h3>{item?.title}</h3>
        <p>{item?.excerpt}</p>
        {!compact && (
          <Link className="btn btn-sm" href={`/news/${item.id}`}>Подробнее</Link>
        )}
      </div>
    </article>
  );
}

export { formatDate };
