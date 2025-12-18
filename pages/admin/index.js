import Layout from '../../components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <h1>Админка УК</h1>
          {me && <p><b>{me.name}</b> • роль: <b>{me.role}</b></p>}
          <div className="hr"></div>
          <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <Link href="/admin/requests" className="btn primary">Заявки</Link>
            <Link href="/admin/feedback" className="btn">Обратная связь</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
