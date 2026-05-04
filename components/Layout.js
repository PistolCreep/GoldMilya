import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children }){
  const [me, setMe] = useState(null);

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.ok ? r.json() : null)
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  async function logout(){
    await fetch('/api/auth/logout', { method:'POST' });
    location.href = '/';
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container nav">
          <div className="brand">
            <Link href="/" aria-label="На главную">
              <span className="brand-text">Золотая миля</span>
            </Link>
          </div>

          <nav className="nav-links" aria-label="Основная навигация">
            <Link href="/about">О компании</Link>
            <Link href="/services">Услуги</Link>
            <Link href="/news">Новости</Link>
            <Link href="/contacts">Контакты</Link>
          </nav>

          <div className="nav-actions">
            {me?.id ? (
              <>
                {me.role === 'admin'
                  ? <Link className="btn btn-sm primary" href="/admin">Админка</Link>
                  : <Link className="btn btn-sm primary" href="/cabinet">ЛК</Link>}
                <button className="btn btn-sm" onClick={logout} type="button">Выйти</button>
              </>
            ) : (
              <>
                <Link className="btn btn-sm" href="/login">Вход</Link>
                <Link className="btn btn-sm primary" href="/register">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">ООО «Золотая миля»</div>
            <p>Управляющая компания для комфортного обслуживания дома, заявок жителей и прозрачной коммуникации.</p>
          </div>
          <div>
            <p><b>Контакты</b></p>
            <p>+7 (926) 873-94-52</p>
            <p>info@zolotayamile.local</p>
          </div>
          <div>
            <p><b>Адрес</b></p>
            <p>Москва, ул. Пречистенка, д. 33/19, стр. 1</p>
            <p>© {new Date().getFullYear()} ООО «Золотая миля»</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
