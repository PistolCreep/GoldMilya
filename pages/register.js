import Layout from '../components/Layout';
import Link from 'next/link';
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

    const r = await fetch('/api/auth/register', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, apartment, email, password })
    });
    const data = await r.json().catch(()=>({}));

    if (!r.ok){
      setError(data?.error || 'Не удалось зарегистрироваться');
      return;
    }

    location.href = '/cabinet';
  }

  return (
    <Layout>
      <div className="container">
        <section className="auth-card grid">
          <div className="card half auth-side">
            <span className="section-kicker">Регистрация</span>
            <h1>Создайте учетную запись</h1>
            <p>После регистрации вы сможете отправлять заявки, получать ответы УК и хранить историю обращений.</p>
          </div>
          <div className="card half">
            <h2>Данные жителя</h2>
            <form className="form-stack" onSubmit={submit}>
              <div className="row two">
                <div>
                  <label className="label">ФИО</label>
                  <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
                </div>
                <div>
                  <label className="label">Квартира</label>
                  <input className="input" value={apartment} onChange={e=>setApartment(e.target.value)} placeholder="Например: 45" required />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
              </div>
              <div>
                <label className="label">Пароль</label>
                <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
              </div>
              <div className="form-actions">
                <button className="btn primary" type="submit">Зарегистрироваться</button>
                <Link className="btn" href="/login">Уже есть аккаунт</Link>
                {error && <span className="notice danger">{error}</span>}
              </div>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
}
