import Layout from '../components/Layout';
import { useState } from 'react';

export default function Contacts(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [topic,setTopic]=useState('Общий вопрос');
  const [message,setMessage]=useState('');
  const [status,setStatus]=useState('');

  async function submit(e){
    e.preventDefault();
    setStatus('');
    const r = await fetch('/api/feedback/create', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, topic, message }) });
    const data = await r.json().catch(()=>({}));
    if (!r.ok){ setStatus(data?.error || 'Ошибка'); return; }
    setStatus('Сообщение отправлено. УК свяжется с вами.');
    setName(''); setEmail(''); setMessage('');
  }

  return (
    <Layout>
      <div className="grid" style={{marginTop:16}}>
        <div className="card half">
          <h1>Контакты</h1>
          <p><b>Адрес:</b> г. (пример), ул. (пример), д. 1</p>
          <p><b>Телефон:</b> +7 (000) 000-00-00</p>
          <p><b>Email:</b> info@zolotayamile.local</p>
          <div className="hr"></div>
          <p className="small">Для диплома данные могут быть демонстрационными.</p>
        </div>
        <div className="card half">
          <h2>Обратная связь</h2>
          <form onSubmit={submit}>
            <div className="row two">
              <div>
                <label className="small">Имя</label>
                <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
              </div>
              <div>
                <label className="small">Email (необязательно)</label>
                <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
            </div>
            <div style={{marginTop:10}}>
              <label className="small">Тема</label>
              <select className="input" value={topic} onChange={e=>setTopic(e.target.value)}>
                <option>Общий вопрос</option><option>Платные услуги</option><option>Качество работ</option><option>Документы</option>
              </select>
            </div>
            <div style={{marginTop:10}}>
              <label className="small">Сообщение</label>
              <textarea value={message} onChange={e=>setMessage(e.target.value)} required />
            </div>
            <div style={{display:'flex', gap:10, alignItems:'center', marginTop:10}}>
              <button className="btn primary" type="submit">Отправить</button>
              {status && <span className="small">{status}</span>}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
