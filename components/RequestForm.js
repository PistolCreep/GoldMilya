import { useState } from 'react';

export default function RequestForm({ onCreated }){
  const [title,setTitle]=useState('');
  const [category,setCategory]=useState('Сантехника');
  const [description,setDescription]=useState('');
  const [error,setError]=useState('');
  const [ok,setOk]=useState('');

  async function submit(e){
    e.preventDefault();
    setError(''); setOk('');
    const r = await fetch('/api/requests/create', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, category, description }) });
    const data = await r.json().catch(()=>({}));
    if (!r.ok){ setError(data?.error || 'Ошибка'); return; }
    setOk('Заявка создана');
    setTitle(''); setDescription('');
    onCreated?.(data);
  }

  return (
    <form onSubmit={submit}>
      <div className="row two">
        <div>
          <label className="small">Тема заявки</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Например: течёт кран на кухне" required />
        </div>
        <div>
          <label className="small">Категория</label>
          <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
            <option>Сантехника</option><option>Электрика</option><option>Уборка</option><option>Лифт</option><option>Двор/территория</option><option>Другое</option>
          </select>
        </div>
      </div>
      <div style={{marginTop:10}}>
        <label className="small">Описание</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Опишите проблему" required />
      </div>
      <div style={{display:'flex', gap:10, alignItems:'center', marginTop:10}}>
        <button className="btn primary" type="submit">Создать заявку</button>
        {error && <span style={{color:'var(--danger)'}}>{error}</span>}
        {ok && <span style={{color:'var(--ok)'}}>{ok}</span>}
      </div>
    </form>
  );
}
