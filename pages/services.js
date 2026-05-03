import Layout from '../components/Layout';
import Link from 'next/link';
import ServiceCard from '../components/ServiceCard';
import { services } from '../lib/services';

export default function Services(){
  return (
    <Layout>
      <div className="container">
        <section className="page-hero">
          <span className="section-kicker">Услуги</span>
          <h1>Обслуживание дома без лишней бюрократии</h1>
          <p className="lead">Основные направления обслуживания. Для бытовых проблем и обращений используйте личный кабинет.</p>
          <div className="hero-actions">
            <Link className="btn primary" href="/cabinet">Создать заявку</Link>
            <Link className="btn" href="/contacts">Задать вопрос</Link>
          </div>
        </section>

        <section className="section services-showcase">
          <div className="section-head">
            <div>
              <span className="section-kicker">Услуги</span>
              <h2>Основные направления обслуживания</h2>
            </div>
          </div>
          <div className="service-grid rich-service-grid">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
