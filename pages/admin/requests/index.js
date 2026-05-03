import Layout from '../../../components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StatusPill from '../../../components/StatusPill';

export default function AdminRequests(){
  const [items,setItems]=useState([]);
  const [error,setError]=useState('');

  async function load(){
    setError('');
    const meR = await fetch('/api/me');
    if (!meR.ok){ location.href='/login'; return; }
    const me = await meR.json();
    if (me.role !== 'admin'){ location.href='/cabinet'; return; }

    const r = await fetch('/api/requests/list?scope=all');
    const data = await r.json().catch(()=>({}));
    if (!r.ok){
      setError(data?.error || 'Не удалось загрузить заявки');
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
          <h1>Все заявки жителей</h1>
          <p className="lead">Открывайте обращения, отвечайте в чате и меняйте статус выполнения работ.</p>
          <div className="admin-nav">
            <Link className="btn primary" href="/admin/requests">Заявки</Link>
            <Link className="btn" href="/admin/news">Новости</Link>
            <Link className="btn" href="/admin/feedback">Обратная связь</Link>
          </div>
        </section>

        <section className="section card">
          {error && <p className="notice danger">{error}</p>}
          {!error && items.length === 0 ? (
            <div className="empty-state">Заявок пока нет.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>ID</th><th>Жилец</th><th>Квартира</th><th>Тема</th><th>Категория</th><th>Статус</th><th>Дата</th><th></th></tr>
                </thead>
                <tbody>
                  {items.map(it=>(
                    <tr key={it.id}>
                      <td>{it.id}</td>
                      <td>{it.user_name}</td>
                      <td>{it.apartment}</td>
                      <td><b>{it.title}</b></td>
                      <td>{it.category}</td>
                      <td><StatusPill status={it.status} /></td>
                      <td>{it.created_at}</td>
                      <td className="actions"><Link className="btn btn-sm" href={`/admin/requests/${it.id}`}>Открыть</Link></td>
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
