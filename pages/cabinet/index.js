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
    if (!r.ok){ setError(data?.error || 'Ошибка'); return; }
    setItems(data.items || []);
  }

  useEffect(()=>{ load(); },[]);

  return (
    <Layout>
      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <h1>Личный кабинет</h1>
          {me && <p><b>{me.name}</b> • квартира <b>{me.apartment}</b> • роль: <b>{me.role}</b></p>}
          <div className="hr"></div>
          <h2>Создать заявку</h2>
          <RequestForm onCreated={load} />
        </div>
        <div className="card">
          <h2>Мои заявки</h2>
          {error && <p style={{color:'var(--danger)'}}>{error}</p>}
          {items.length === 0 ? <p>Пока нет заявок.</p> : (
            <table className="table">
              <thead><tr><th>ID</th><th>Тема</th><th>Категория</th><th>Статус</th><th>Дата</th><th></th></tr></thead>
              <tbody>
                {items.map(it=>(
                  <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>{it.title}</td>
                    <td>{it.category}</td>
                    <td><StatusPill status={it.status} /></td>
                    <td>{it.created_at}</td>
                    <td><Link className="btn" href={`/cabinet/requests/${it.id}`}>Открыть</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
