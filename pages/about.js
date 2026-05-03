import Layout from '../components/Layout';

const values = [
  { title:'Оперативность', text:'Обращения жителей фиксируются сразу и не теряются между звонками, чатами и бумажными журналами.' },
  { title:'Прозрачность', text:'Статусы заявок и история переписки помогают видеть, на каком этапе находится работа.' },
  { title:'Плановое обслуживание', text:'Профилактические работы и новости публикуются заранее, чтобы жители были в курсе изменений.' }
];

export default function About(){
  return (
    <Layout>
      <div className="container">
        <section className="page-hero">
          <span className="section-kicker">О компании</span>
          <h1>ООО «Золотая миля»</h1>
          <p className="lead">Управляющая компания, которая обслуживает многоквартирный дом, инженерные системы и придомовую территорию с акцентом на удобный цифровой сервис для жителей.</p>
        </section>

        <section className="section split">
          <div className="card">
            <h2>Наша задача</h2>
            <p>Мы обеспечиваем комфортное проживание, координируем подрядчиков, контролируем выполнение заявок и информируем жителей о плановых работах.</p>
            <p>Сайт помогает сделать взаимодействие с УК понятным: житель создает заявку, получает ответы в чате и видит статус обращения.</p>
          </div>
          <div className="image-panel photo-entrance" />
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <span className="section-kicker">Принципы</span>
              <h2>Как устроена работа с жителями</h2>
            </div>
          </div>
          <div className="feature-grid">
            {values.map((item, index) => (
              <div className="feature-card" key={item.title}>
                <div className="icon-badge">{String(index + 1).padStart(2, '0')}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
