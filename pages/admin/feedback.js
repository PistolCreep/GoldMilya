import Layout from '../../components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Feedback(){
  const [items,setItems]=useState([]);
  const [error,setError]=useState('');

  async function load(){
    setError('');
    const meR = await fetch('/api/me');
    if (!meR.ok){ location.href='/login'; return; }
    const me = await meR.json();
    if (me.role !== 'admin'){ location.href='/cabinet'; return; }

    const r = await fetch('/api/feedback/list');
    const data = await r.json().catch(()=>({}));
    if (!r.ok){
      setError(data?.error || 'Не удалось загрузить сообщения');
      return;
    }
    setItems(data.items || []);
  }

  useEffect(()=>{ load(); },[]);

  return (
    <Layout>
      <div className="container">
        <section className="page-hero">
          <span className="section-kicker">Админ-панель</span>
          <h1>Обратная связь</h1>
          <p className="lead">Сообщения, отправленные через публичную форму контактов.</p>
          <div className="admin-nav">
            <Link className="btn" href="/admin/requests">Заявки</Link>
            <Link className="btn" href="/admin/news">Новости</Link>
            <Link className="btn primary" href="/admin/feedback">Обратная связь</Link>
          </div>
        </section>

        <section className="section card">
          {error && <p className="notice danger">{error}</p>}
          {!error && items.length === 0 ? (
            <div className="empty-state">Сообщений пока нет.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>ID</th><th>Имя</th><th>Email</th><th>Тема</th><th>Сообщение</th><th>Дата</th></tr>
                </thead>
                <tbody>
                  {items.map(it=>(
                    <tr key={it.id}>
                      <td>{it.id}</td>
                      <td>{it.name}</td>
                      <td>{it.email || 'Не указан'}</td>
                      <td>{it.topic}</td>
                      <td>{it.message}</td>
                      <td>{it.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
