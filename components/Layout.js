import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children }){
  const [me, setMe] = useState(null);
  useEffect(() => {
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(setMe).catch(()=>{});
  }, []);

  async function logout(){
    await fetch('/api/auth/logout', { method:'POST' });
    location.href = '/';
  }

  return (
    <div className="container">
      <div className="nav">
        <div className="brand">
          <Link href="/">ООО «Золотая миля»</Link>
          <span className="badge">УК / жилой дом</span>
        </div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap', justifyContent:'flex-end'}}>
          <Link href="/about">О компании</Link>
          <Link href="/services">Услуги</Link>
          <Link href="/news">Объявления</Link>
          <Link href="/contacts">Контакты</Link>
          {me?.id ? (
            <>
              {me.role === 'admin' ? <Link href="/admin">Админка</Link> : <Link href="/cabinet">ЛК</Link>}
              <button className="btn" onClick={logout}>Выйти</button>
            </>
          ) : (
            <>
              <Link href="/login">Вход</Link>
              <Link href="/register">Регистрация</Link>
            </>
          )}
        </div>
      </div>

      {children}

      <div className="footer">© {new Date().getFullYear()} ООО «Золотая миля». Дипломный проект. SQLite + ЛК + заявки.</div>
    </div>
  );
}
