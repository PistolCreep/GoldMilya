import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';

export default function News(){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/news/list')
      .then(async r => {
        const data = await r.json().catch(()=>({}));
        if (!r.ok) throw new Error(data?.error || 'Не удалось загрузить новости');
        setItems(data.items || []);
        setError('');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="container">
        <section className="page-hero">
          <span className="section-kicker">Новости</span>
          <h1>Объявления и новости дома</h1>
          <p className="lead">Плановые работы, собрания, профилактика оборудования и важные сообщения для жильцов.</p>
        </section>

        <section className="section">
          {loading && <div className="empty-state">Загружаем новости...</div>}
          {!loading && error && <div className="notice danger">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div className="empty-state">Новостей пока нет. Когда управляющая компания опубликует объявления, они появятся здесь.</div>
          )}
          {!loading && !error && items.length > 0 && (
            <div className="news-grid">
              {items.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
