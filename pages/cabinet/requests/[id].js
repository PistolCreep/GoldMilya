import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import StatusPill from '../../../components/StatusPill';
import ChatBox from '../../../components/ChatBox';

export default function RequestView(){
  const router = useRouter();
  const { id } = router.query;
  const [req,setReq]=useState(null);
  const [error,setError]=useState('');

  async function load(){
    if (!id) return;
    setError('');
    const meR = await fetch('/api/me');
    if (!meR.ok){ location.href='/login'; return; }
    const me = await meR.json();
    if (me.role === 'admin'){ location.href='/admin'; return; }

    const r = await fetch('/api/requests/get?id=' + encodeURIComponent(id));
    const data = await r.json().catch(()=>({}));
    if (!r.ok){ setError(data?.error || 'Ошибка'); return; }
    setReq(data);
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
              <p className="small">Создана: {req.created_at}</p>
              <div className="hr"></div>
              <p>{req.description}</p>
              <div className="hr"></div>
              <h2>Переписка</h2>
              <div className="chat">
                {(req.messages||[]).map(m=> (
                  <div key={m.id} className={'msg ' + (m.sender_role==='admin'?'admin':'user')}>
                    <div className="small">{m.sender_role==='admin'?'УК':'Жилец'} • {m.created_at}</div>
                    <div style={{marginTop:6}}>{m.message}</div>
                  </div>
                ))}
              </div>
              <ChatBox requestId={req.id} onSent={load} />
              <div className="small" style={{marginTop:8}}>Пишите сообщения по заявке — УК ответит здесь же.</div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
