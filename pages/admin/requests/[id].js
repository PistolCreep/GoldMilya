import Layout from '../../../components/Layout';
import Link from 'next/link';
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
  const [saving,setSaving]=useState('');

  async function load(){
    if (!id) return;
    setError('');
    const meR = await fetch('/api/me');
    if (!meR.ok){ location.href='/login'; return; }
    const me = await meR.json();
    if (me.role !== 'admin'){ location.href='/cabinet'; return; }

    const r = await fetch('/api/requests/get?id=' + encodeURIComponent(id));
    const data = await r.json().catch(()=>({}));
    if (!r.ok){
      setError(data?.error || 'Не удалось загрузить заявку');
      return;
    }
    setReq(data);
    setStatus(data.status);
  }

  async function updateStatus(){
    setSaving('');
    const r = await fetch('/api/requests/status', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ requestId: Number(id), status })
    });
    const data = await r.json().catch(()=>({}));
    if (!r.ok){
      setSaving(data?.error || 'Не удалось сохранить статус');
      return;
    }
    setSaving('Статус сохранен');
    load();
  }

  useEffect(()=>{ load(); },[id]);

  return (
    <Layout>
      <div className="container">
        <section className="page-hero">
          <span className="section-kicker">Админ-панель</span>
          <h1>Заявка #{id}</h1>
          <p className="lead">Карточка обращения, изменение статуса и переписка с жильцом.</p>
          <Link className="btn" href="/admin/requests">К списку заявок</Link>
        </section>

        <section className="section grid">
          <div className="card one-third">
            <h2>Детали</h2>
            {error && <p className="notice danger">{error}</p>}
            {req ? (
              <>
                <p><b>{req.title}</b></p>
                <p>Категория: <b>{req.category}</b></p>
                <p>Жилец: <b>{req.user_name}</b></p>
                <p>Квартира: <b>{req.apartment}</b></p>
                <p>Статус: <StatusPill status={req.status} /></p>
                <p className="small">Создана: {req.created_at}</p>
                <div className="hr"></div>
                <p>{req.description}</p>
              </>
            ) : !error && <p>Загружаем заявку...</p>}
          </div>

          <div className="card two-third">
            <h2>Статус и переписка</h2>
            {req && (
              <>
                <div className="row two">
                  <div>
                    <label className="label">Статус заявки</label>
                    <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
                      <option value="new">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="done">Выполнена</option>
                    </select>
                  </div>
                  <div className="form-actions" style={{alignItems:'end'}}>
                    <button className="btn primary" onClick={updateStatus} type="button">Сохранить статус</button>
                    {saving && <span className={saving.includes('сохранен') ? 'notice success' : 'notice danger'}>{saving}</span>}
                  </div>
                </div>
                <div className="hr"></div>
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
              </>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
