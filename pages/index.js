import Layout from '../components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';

const advantages = [
  { icon:'01', title:'Онлайн-заявки', text:'Жители отправляют обращения без звонков и повторных объяснений.' },
  { icon:'02', title:'Контроль статусов', text:'Каждая заявка проходит понятные этапы от регистрации до выполнения.' },
  { icon:'03', title:'Новости для жильцов', text:'Плановые работы, собрания и важные объявления собраны в одном разделе.' },
  { icon:'04', title:'Связь с УК', text:'Обратная связь и переписка по заявкам сохраняют историю решений.' }
];

const services = [
  { icon:'СН', title:'Сантехника', text:'Протечки, смесители, стояки, водоснабжение и аварийные ситуации.' },
  { icon:'ЭЛ', title:'Электрика', text:'Освещение, щитки, автоматы, розетки и общедомовые сети.' },
  { icon:'УБ', title:'Уборка', text:'Подъезды, дворовая территория, вывоз мусора и сезонные работы.' },
  { icon:'БЛ', title:'Благоустройство', text:'Озеленение, малые формы, покрытие дорожек и контроль двора.' },
  { icon:'ЛД', title:'Лифты и домофон', text:'Профилактика оборудования, заявки по сбоям и контроль подрядчиков.' },
  { icon:'ОД', title:'Общедомовое имущество', text:'Инженерные системы, помещения, фасад и плановые осмотры.' }
];

export default function Home(){
  const [news,setNews]=useState([]);

  useEffect(() => {
    fetch('/api/news/list')
      .then(r => r.ok ? r.json() : { items:[] })
      .then(data => setNews((data.items || []).slice(0, 3)))
      .catch(() => setNews([]));
  }, []);

  return (
    <Layout>
      <div className="container">
        <section className="hero">
          <div className="hero-content">
            <span className="section-kicker">Сервис для жителей</span>
            <h1>Управляющая компания «Золотая миля»</h1>
            <p>Современный сервис для жителей: заявки, новости, обратная связь и контроль обслуживания дома.</p>
            <div className="hero-actions">
              <Link className="btn primary" href="/cabinet">Оставить заявку</Link>
              <Link className="btn" href="/cabinet">Личный кабинет</Link>
              <Link className="btn dark" href="/contacts">Связаться с УК</Link>
            </div>
            <div className="hero-note">
              <span>Заявки онлайн</span>
              <span>Ответы УК в чате</span>
              <span>Новости дома</span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <span className="section-kicker">Преимущества</span>
              <h2>Быстрее решаем бытовые вопросы</h2>
            </div>
            <p className="lead">Сайт объединяет обращения, статусы, новости и коммуникацию с управляющей компанией.</p>
          </div>
          <div className="feature-grid">
            {advantages.map(item => (
              <div className="feature-card" key={item.title}>
                <div className="icon-badge">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <span className="section-kicker">Услуги</span>
              <h2>Основные направления обслуживания</h2>
            </div>
            <Link className="btn" href="/services">Все услуги</Link>
          </div>
          <div className="service-grid">
            {services.map(item => (
              <div className="service-card" key={item.title}>
                <div className="icon-badge">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section split">
          <div className="image-panel photo-courtyard" />
          <div className="card">
            <span className="section-kicker">О доме и обслуживании</span>
            <h2>Единая точка взаимодействия жильцов и УК</h2>
            <p>Сайт помогает централизовать обращения жителей, фиксировать ход работ и своевременно сообщать о плановых мероприятиях.</p>
            <div className="check-list">
              <div className="check-item">Заявки хранятся в личном кабинете и доступны жильцу в любое время.</div>
              <div className="check-item">Администратор видит все обращения, меняет статусы и отвечает в чате.</div>
              <div className="check-item">Новости публикуются из админ-панели и сразу появляются на сайте.</div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <span className="section-kicker">Новости</span>
              <h2>Последние объявления</h2>
            </div>
            <Link className="btn" href="/news">Перейти в новости</Link>
          </div>
          {news.length === 0 ? (
            <div className="empty-state">Новостей пока нет. Когда УК опубликует объявления, они появятся здесь.</div>
          ) : (
            <div className="news-grid">
              {news.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
          )}
        </section>

        <section className="section cta">
          <div>
            <h2>Возникла проблема или вопрос?</h2>
            <p>Создайте заявку в личном кабинете или отправьте сообщение через форму обратной связи.</p>
          </div>
          <div className="cta-actions">
            <Link className="btn primary" href="/cabinet">Создать заявку</Link>
            <Link className="btn" href="/contacts">Написать в УК</Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
