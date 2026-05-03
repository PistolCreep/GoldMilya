import Layout from '../components/Layout';
import { useState } from 'react';

export default function Contacts(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [topic,setTopic]=useState('Общий вопрос');
  const [message,setMessage]=useState('');
  const [status,setStatus]=useState('');
  const [error,setError]=useState('');

  async function submit(e){
    e.preventDefault();
    setStatus('');
    setError('');

    const r = await fetch('/api/feedback/create', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, topic, message })
    });
    const data = await r.json().catch(()=>({}));

    if (!r.ok){
      setError(data?.error || 'Не удалось отправить сообщение');
      return;
    }

    setStatus('Сообщение отправлено. Управляющая компания свяжется с вами.');
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <Layout>
      <div className="container">
        <section className="page-hero">
          <span className="section-kicker">Контакты</span>
          <h1>Связаться с управляющей компанией</h1>
          <p className="lead">Напишите обращение через форму или используйте контактные данные для срочной связи.</p>
        </section>

        <section className="section grid">
          <div className="card half">
            <h2>ООО «Золотая миля»</h2>
            <div className="hr"></div>
            <p><b>Адрес:</b> Москва, ул. Пречистенка, д. 33/19, стр. 1</p>
            <p><b>Телефон:</b> +7 (926) 873-94-52</p>
            <p><b>Email:</b> info@zolotayamile.local</p>
            <p><b>Время приема:</b> будние дни, 09:00-18:00</p>
            <div className="map-card">
              <div>
                <p><b>Ориентир</b></p>
                <p>Центральный офис управляющей компании. Онлайн-заявки принимаются круглосуточно.</p>
              </div>
            </div>
          </div>

          <div className="card half">
            <h2>Обратная связь</h2>
            <p>Форма подходит для общих вопросов, предложений и обращений, не требующих заявки в личном кабинете.</p>
            <form className="form-stack" onSubmit={submit}>
              <div className="row two">
                <div>
                  <label className="label">Имя</label>
                  <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Необязательно" />
                </div>
              </div>
              <div>
                <label className="label">Тема</label>
                <select className="input" value={topic} onChange={e=>setTopic(e.target.value)}>
                  <option>Общий вопрос</option>
                  <option>Платные услуги</option>
                  <option>Качество работ</option>
                  <option>Документы</option>
                </select>
              </div>
              <div>
                <label className="label">Сообщение</label>
                <textarea className="input" value={message} onChange={e=>setMessage(e.target.value)} required />
              </div>
              <div className="form-actions">
                <button className="btn primary" type="submit">Отправить</button>
                {status && <span className="notice success">{status}</span>}
                {error && <span className="notice danger">{error}</span>}
              </div>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
}
