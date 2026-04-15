import Layout from '../components/Layout';
import { useState } from 'react';

export default function Register(){
  const [name,setName]=useState('');
  const [apartment,setApartment]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');

  async function submit(e){
    e.preventDefault();
    setError('');
    const r = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, apartment, email, password }) });
    const data = await r.json().catch(()=>({}));
    if (!r.ok){ setError(data?.error || 'Ошибка'); return; }
    location.href = '/cabinet';
  }

  return (
    <Layout>
      <div className="grid" style={{marginTop:16}}>
        <div className="card half">
          <h1>Регистрация жильца</h1>
          <p>Создайте учётную запись для подачи заявок и переписки с УК.</p>
        </div>
        <div className="card half">
          <form onSubmit={submit}>
            <div className="row two">
              <div>
                <label className="small">ФИО</label>
                <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
              </div>
              <div>
                <label className="small">Квартира</label>
                <input className="input" value={apartment} onChange={e=>setApartment(e.target.value)} placeholder="Например: 45" required />
              </div>
            </div>
            <div style={{marginTop:10}}>
              <label className="small">Email</label>
              <input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
            </div>
            <div style={{marginTop:10}}>
              <label className="small">Пароль</label>
              <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
              <div className="small" style={{marginTop:6}}></div>
            </div>
            <div style={{display:'flex', gap:10, alignItems:'center', marginTop:12}}>
              <button className="btn primary" type="submit">Зарегистрироваться</button>
              {error && <span style={{color:'var(--danger)'}}>{error}</span>}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
