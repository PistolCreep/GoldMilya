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
    if (!r.ok){ setError(data?.error || 'Ошибка'); return; }
    setItems(data.items || []);
  }

  useEffect(()=>{ load(); },[]);

  return (
    <Layout>
      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <h1>Все заявки</h1>
          {error && <p style={{color:'var(--danger)'}}>{error}</p>}
          <table className="table">
            <thead><tr><th>ID</th><th>Жилец</th><th>Квартира</th><th>Тема</th><th>Категория</th><th>Статус</th><th>Дата</th><th></th></tr></thead>
            <tbody>
              {items.map(it=>(
                <tr key={it.id}>
                  <td>{it.id}</td><td>{it.user_name}</td><td>{it.apartment}</td><td>{it.title}</td><td>{it.category}</td>
                  <td><StatusPill status={it.status} /></td>
                  <td>{it.created_at}</td>
                  <td><Link className="btn" href={`/admin/requests/${it.id}`}>Открыть</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
