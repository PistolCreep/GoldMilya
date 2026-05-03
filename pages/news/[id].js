import Layout from '../../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { formatDate } from '../../components/NewsCard';

export default function NewsDetail(){
  const router = useRouter();
  const { id } = router.query;
  const [item,setItem]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch('/api/news/get?id=' + encodeURIComponent(id))
      .then(async r => {
        const data = await r.json().catch(()=>({}));
        if (!r.ok) throw new Error(data?.error || 'Новость не найдена');
        setItem(data.item);
        setError('');
      })
      .catch(err => {
        setItem(null);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const image = item?.image_url || '/images/news-maintenance.jpg';

  return (
    <Layout>
      <div className="container">
        {loading && <div className="empty-state">Загружаем новость...</div>}

        {!loading && error && (
          <section className="page-hero">
            <span className="section-kicker">Новости</span>
            <h1>Новость не найдена</h1>
            <p className="lead">Возможно, публикация была скрыта или удалена.</p>
            <Link className="btn primary" href="/news">Вернуться к новостям</Link>
          </section>
        )}

        {!loading && item && (
          <>
            <section className="page-hero">
              <span className="section-kicker">Новости</span>
              <p className="news-meta">{formatDate(item.created_at)}</p>
              <h1>{item.title}</h1>
              <p className="lead">{item.excerpt}</p>
            </section>

            <section className="section split">
              <div className="image-panel" style={{ backgroundImage:`linear-gradient(135deg, rgba(23,32,51,.18), rgba(184,137,43,.20)), url("${image}"), linear-gradient(135deg, #D8DEE8, #F5E8C9)` }} />
              <article className="card">
                <div className="news-content">{item.content}</div>
                {item.updated_at && <p className="small">Обновлено: {formatDate(item.updated_at)}</p>}
                <div className="hr"></div>
                <Link className="btn" href="/news">Все новости</Link>
              </article>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
