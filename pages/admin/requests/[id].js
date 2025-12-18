import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import StatusPill from '../../../components/StatusPill';
import ChatBox from '../../../components/ChatBox';

export default function AdminRequestView(){
  const router = useRouter();
  const { id } = router.query;
  const [req,setReq]=useState(null);
  const [error,setError]=useState('');
  const [status,setStatus]=useState('new');

  async function load(){
    if (!id) return;
    setError('');
    const meR = await fetch('/api/me');
    if (!meR.ok){ location.href='/login'; return; }
    const me = await meR.json();
    if (me.role !== 'admin'){ location.href='/cabinet'; return; }

    const r = await fetch('/api/requests/get?id=' + encodeURIComponent(id));
    const data = await r.json().catch(()=>({}));
    if (!r.ok){ setError(data?.error || 'Ошибка'); return; }
    setReq(data);
    setStatus(data.status);
  }

  async function updateStatus(){
    const r = await fetch('/api/requests/status', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ requestId: Number(id), status }) });
    const data = await r.json().catch(()=>({}));
    if (!r.ok){ alert(data?.error || 'Ошибка'); return; }
    load();
  }

  useEffect(()=>{ load(); },[id]);

  return (
    <Layout>
      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <h1>Заявка #{id}</h1>
          {error && <p style={{color:'var(--danger)'}}>{error}</p>}
          {req && (
            <>
              <p><b>{req.title}</b> • {req.category} • <StatusPill status={req.status} /></p>
              <p className="small">Жилец: {req.user_name} • квартира {req.apartment} • создана: {req.created_at}</p>
              <div className="hr"></div>
              <p>{req.description}</p>
              <div className="hr"></div>
              <h2>Статус</h2>
              <div style={{display:'flex', gap:10, flexWrap:'wrap', alignItems:'center'}}>
                <select className="input" style={{maxWidth:260}} value={status} onChange={e=>setStatus(e.target.value)}>
                  <option value="new">Новая</option><option value="in_progress">В работе</option><option value="done">Выполнена</option>
                </select>
                <button className="btn primary" onClick={updateStatus}>Сохранить статус</button>
              </div>
              <div className="hr"></div>
              <h2>Переписка (УК ↔ Жилец)</h2>
              <div className="chat">
                {(req.messages||[]).map(m=> (
                  <div key={m.id} className={'msg ' + (m.sender_role==='admin'?'admin':'user')}>
                    <div className="small">{m.sender_role==='admin'?'УК':'Жилец'} • {m.created_at}</div>
                    <div style={{marginTop:6}}>{m.message}</div>
                  </div>
                ))}
              </div>
              <ChatBox requestId={req.id} onSent={load} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
