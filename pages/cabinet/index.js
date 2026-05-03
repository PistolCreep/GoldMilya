import Layout from '../../components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StatusPill from '../../components/StatusPill';
import RequestForm from '../../components/RequestForm';

export default function Cabinet(){
  const [me,setMe]=useState(null);
  const [items,setItems]=useState([]);
  const [error,setError]=useState('');

  async function load(){
    setError('');
    const meR = await fetch('/api/me');
    if (!meR.ok){ location.href='/login'; return; }
    const meData = await meR.json();
    if (meData.role === 'admin'){ location.href='/admin'; return; }
    setMe(meData);

    const r = await fetch('/api/requests/list');
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
          <span className="section-kicker">Личный кабинет</span>
          <h1>Заявки и переписка с УК</h1>
          {me && <p className="lead">{me.name}, квартира {me.apartment}. Здесь можно создать обращение и отслеживать его статус.</p>}
        </section>

        <section className="section grid">
          <div className="card one-third">
            <h2>Профиль</h2>
            {me ? (
              <>
                <p><b>{me.name}</b></p>
                <p>Квартира: <b>{me.apartment}</b></p>
                <p>Email: <b>{me.email}</b></p>
              </>
            ) : <p>Загружаем данные...</p>}
          </div>

          <div className="card two-third">
            <h2>Создать заявку</h2>
            <p>Опишите проблему, выберите категорию и отправьте обращение в управляющую компанию.</p>
            <RequestForm onCreated={load} />
          </div>
        </section>

        <section className="section card">
          <div className="section-head">
            <div>
              <span className="section-kicker">Мои обращения</span>
              <h2>История заявок</h2>
            </div>
          </div>
          {error && <p className="notice danger">{error}</p>}
          {!error && items.length === 0 ? (
            <div className="empty-state">Заявок пока нет. Создайте первое обращение через форму выше.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>ID</th><th>Тема</th><th>Категория</th><th>Статус</th><th>Дата</th><th></th></tr>
                </thead>
                <tbody>
                  {items.map(it=>(
                    <tr key={it.id}>
                      <td>{it.id}</td>
                      <td><b>{it.title}</b></td>
                      <td>{it.category}</td>
                      <td><StatusPill status={it.status} /></td>
                      <td>{it.created_at}</td>
                      <td className="actions"><Link className="btn btn-sm" href={`/cabinet/requests/${it.id}`}>Открыть</Link></td>
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
