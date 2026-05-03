import Layout from '../../components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const sections = [
  { title:'Заявки', text:'Просмотр обращений жителей, смена статусов и переписка по каждой заявке.', href:'/admin/requests', label:'Открыть заявки' },
  { title:'Новости', text:'Создание, редактирование, публикация и скрытие новостей на публичном сайте.', href:'/admin/news', label:'Управлять новостями' },
  { title:'Обратная связь', text:'Сообщения из публичной формы контактов и общие вопросы жителей.', href:'/admin/feedback', label:'Смотреть сообщения' }
];

export default function AdminHome(){
  const [me,setMe]=useState(null);

  useEffect(()=>{
    fetch('/api/me').then(async r=>{
      if (!r.ok){ location.href='/login'; return; }
      const u = await r.json();
      if (u.role !== 'admin'){ location.href='/cabinet'; return; }
      setMe(u);
    });
  },[]);

  return (
    <Layout>
      <div className="container">
        <section className="page-hero">
          <span className="section-kicker">Админ-панель</span>
          <h1>Управление сайтом УК</h1>
          {me && <p className="lead">{me.name}, роль: {me.role}. Основные разделы администрирования собраны ниже.</p>}
        </section>

        <section className="section admin-grid">
          {sections.map(item => (
            <div className="admin-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link className="btn primary" href={item.href}>{item.label}</Link>
            </div>
          ))}
        </section>
      </div>
    </Layout>
  );
}
