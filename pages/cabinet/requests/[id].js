import Layout from '../../../components/Layout';
import Link from 'next/link';
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
    if (!r.ok){
      setError(data?.error || 'Не удалось загрузить заявку');
      return;
    }
    setReq(data);
  }

  useEffect(()=>{ load(); },[id]);

  return (
    <Layout>
      <div className="container">
        <section className="page-hero">
          <span className="section-kicker">Личный кабинет</span>
          <h1>Заявка #{id}</h1>
          <p className="lead">Просмотр обращения, статуса и переписки с управляющей компанией.</p>
          <Link className="btn" href="/cabinet">Вернуться в ЛК</Link>
        </section>

        <section className="section grid">
          <div className="card one-third">
            <h2>Детали</h2>
            {error && <p className="notice danger">{error}</p>}
            {req ? (
              <>
                <p><b>{req.title}</b></p>
                <p>Категория: <b>{req.category}</b></p>
                <p>Статус: <StatusPill status={req.status} /></p>
                <p className="small">Создана: {req.created_at}</p>
                <div className="hr"></div>
                <p>{req.description}</p>
              </>
            ) : !error && <p>Загружаем заявку...</p>}
          </div>

          <div className="card two-third">
            <h2>Переписка</h2>
            {req && (
              <>
                {(req.messages || []).length === 0 ? (
                  <div className="empty-state">Сообщений по заявке пока нет.</div>
                ) : (
                  <div className="chat">
                    {(req.messages||[]).map(m=> (
                      <div key={m.id} className={'msg ' + (m.sender_role==='admin'?'admin':'user')}>
                        <div className="small">{m.sender_role==='admin'?'УК':'Жилец'} · {m.created_at}</div>
                        <div style={{marginTop:6}}>{m.message}</div>
                      </div>
                    ))}
                  </div>
                )}
                <ChatBox requestId={req.id} onSent={load} />
                <p className="small">Сообщения сохраняются в истории заявки.</p>
              </>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
