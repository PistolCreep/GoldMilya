import Layout from '../../components/Layout';
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
    if (!r.ok){ setError(data?.error || 'Ошибка'); return; }
    setItems(data.items || []);
  }

  useEffect(()=>{ load(); },[]);

  return (
    <Layout>
      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <h1>Обратная связь</h1>
          {error && <p style={{color:'var(--danger)'}}>{error}</p>}
          {items.length === 0 ? <p>Сообщений пока нет.</p> : (
            <table className="table">
              <thead><tr><th>ID</th><th>Имя</th><th>Email</th><th>Тема</th><th>Сообщение</th><th>Дата</th></tr></thead>
              <tbody>
                {items.map(it=>(
                  <tr key={it.id}>
                    <td>{it.id}</td><td>{it.name}</td><td>{it.email||'—'}</td><td>{it.topic}</td><td>{it.message}</td><td>{it.created_at}</td>
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
