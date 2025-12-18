import Layout from '../components/Layout';

const posts = [
  { date:'2025-12-10', title:'Плановые работы по отоплению', text:'Проверка узла учета и регулировка параметров отопления.' },
  { date:'2025-12-05', title:'Собрание жильцов', text:'Обсуждение бюджета на благоустройство и планы на следующий квартал.' },
  { date:'2025-11-28', title:'Профилактика лифтового оборудования', text:'Плановая диагностика и обслуживание.' },
];

export default function News(){
  return (
    <Layout>
      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <h1>Объявления и новости</h1>
          <p>Раздел для информирования жильцов о работах, отключениях, собраниях и новостях.</p>
        </div>
        {posts.map((p,i)=>(
          <div className="card" key={i}>
            <h2>{p.title}</h2>
            <p className="small">{p.date}</p>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
