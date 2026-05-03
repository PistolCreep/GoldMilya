import Layout from '../components/Layout';
import Link from 'next/link';

const services = [
  { icon:'СН', title:'Сантехнические работы', desc:'Устранение протечек, проверка стояков, обслуживание смесителей, водоснабжения и водоотведения.' },
  { icon:'ЭЛ', title:'Электрика', desc:'Освещение мест общего пользования, щитовые, автоматы, розетки и диагностика общедомовых сетей.' },
  { icon:'УБ', title:'Уборка', desc:'Регулярная уборка подъездов, лифтовых холлов, входных групп и придомовой территории.' },
  { icon:'БЛ', title:'Благоустройство', desc:'Озеленение, сезонные работы, малые архитектурные формы, дорожки и контроль дворового пространства.' },
  { icon:'ЛД', title:'Лифты и домофон', desc:'Профилактика лифтового оборудования, заявки по сбоям, домофон и системы доступа.' },
  { icon:'ОД', title:'Общедомовое имущество', desc:'Осмотры фасада, кровли, подвалов, инженерных помещений и контроль состояния оборудования.' }
];

export default function Services(){
  return (
    <Layout>
      <div className="container">
        <section className="page-hero">
          <span className="section-kicker">Услуги</span>
          <h1>Обслуживание дома без лишней бюрократии</h1>
          <p className="lead">Типовые направления работ управляющей компании. Для бытовых проблем и обращений используйте личный кабинет.</p>
          <div className="hero-actions">
            <Link className="btn primary" href="/cabinet">Создать заявку</Link>
            <Link className="btn" href="/contacts">Задать вопрос</Link>
          </div>
        </section>

        <section className="section">
          <div className="service-grid">
            {services.map(item => (
              <div key={item.title} className="service-card">
                <div className="icon-badge">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
