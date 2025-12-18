import Layout from '../components/Layout';

const services = [
  { title:'Сантехнические работы', desc:'Устранение протечек, замена смесителей, проверка стояков.' },
  { title:'Электрика', desc:'Проблемы с освещением, автоматами, розетками, общедомовыми щитками.' },
  { title:'Уборка и благоустройство', desc:'Подъезды, придомовая территория, вывоз мусора, сезонные работы.' },
  { title:'Лифт и общедомовое оборудование', desc:'Заявки по лифту, домофону, системам безопасности.' },
];

export default function Services(){
  return (
    <Layout>
      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <h1>Услуги</h1>
          <p>Ниже перечислены типовые услуги и направления работ УК.</p>
        </div>
        {services.map((s,i)=>(
          <div key={i} className="card third">
            <h2>{s.title}</h2>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
