import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home(){
  return (
    <Layout>
      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <h1>Управляющая компания «Золотая миля»</h1>
          <p>Информационный сайт для управления и обслуживания жилого дома: заявки, личный кабинет жильца, админка УК и двусторонняя переписка по обращениям.</p>
          <div style={{display:'flex', gap:10, flexWrap:'wrap', marginTop:12}}>
            <Link className="btn primary" href="/cabinet">Перейти в ЛК</Link>
            <Link className="btn" href="/contacts">Обратная связь</Link>
            <Link className="btn" href="/services">Услуги</Link>
          </div>
        </div>
        <div className="card half">
          <h2>Что умеет сайт</h2>
          <p>• Подача заявок</p>
          <p>• Статусы: новая → в работе → выполнена</p>
          <p>• Чат по каждой заявке (жилец ↔ УК)</p>
          <p>• Админ-панель для обработки заявок</p>
        </div>
        <div className="card half">
          <h2>Данные для демонстрации</h2>
          <p className="small">Админ: admin@zolotayamile.local / admin123</p>
          <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <Link href="/login" className="btn primary">Войти</Link>
            <Link href="/register" className="btn">Регистрация жильца</Link>
            <Link href="/admin" className="btn">В админку</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
