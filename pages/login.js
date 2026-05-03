import Layout from '../components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');

  async function submit(e){
    e.preventDefault();
    setError('');

    const r = await fetch('/api/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await r.json().catch(()=>({}));

    if (!r.ok){
      setError(data?.error || 'Неверный email или пароль');
      return;
    }

    location.href = data.user?.role === 'admin' ? '/admin' : '/cabinet';
  }

  return (
    <Layout>
      <div className="container">
        <section className="auth-card grid">
          <div className="card half auth-side">
            <span className="section-kicker">Вход</span>
            <h1>Личный кабинет жителя</h1>
            <p>Войдите, чтобы создавать заявки, отслеживать статусы и переписываться с управляющей компанией.</p>
            <div className="hr"></div>
            <p className="small">Демо-админ: admin@zolotayamile.local / admin123</p>
          </div>
          <div className="card half">
            <h2>Введите данные</h2>
            <form className="form-stack" onSubmit={submit}>
              <div>
                <label className="label">Email</label>
                <input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
              </div>
              <div>
                <label className="label">Пароль</label>
                <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
              </div>
              <div className="form-actions">
                <button className="btn primary" type="submit">Войти</button>
                <Link className="btn" href="/register">Регистрация</Link>
                {error && <span className="notice danger">{error}</span>}
              </div>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
}
