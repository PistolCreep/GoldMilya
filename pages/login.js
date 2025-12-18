import Layout from '../components/Layout';
import { useState } from 'react';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');

  async function submit(e){
    e.preventDefault();
    setError('');
    const r = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    const data = await r.json().catch(()=>({}));
    if (!r.ok){ setError(data?.error || 'Ошибка'); return; }
    location.href = data.user?.role === 'admin' ? '/admin' : '/cabinet';
  }

  return (
    <Layout>
      <div className="grid" style={{marginTop:16}}>
        <div className="card half">
          <h1>Вход</h1>
          <p>Войдите в личный кабинет жильца или в админку УК.</p>
          <div className="hr"></div>
          <p className="small">Админ: admin@zolotayamile.local / admin123</p>
        </div>
        <div className="card half">
          <form onSubmit={submit}>
            <div>
              <label className="small">Email</label>
              <input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
            </div>
            <div style={{marginTop:10}}>
              <label className="small">Пароль</label>
              <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
            </div>
            <div style={{display:'flex', gap:10, alignItems:'center', marginTop:12}}>
              <button className="btn primary" type="submit">Войти</button>
              {error && <span style={{color:'var(--danger)'}}>{error}</span>}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
