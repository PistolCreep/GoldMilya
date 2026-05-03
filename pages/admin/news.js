import Layout from '../../components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatDate } from '../../components/NewsCard';

const emptyForm = {
  id:null,
  title:'',
  excerpt:'',
  content:'',
  image_url:'/images/news-maintenance.jpg',
  is_published:true
};

export default function AdminNews(){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState(emptyForm);
  const [showForm,setShowForm]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');

  async function checkAdmin(){
    const meR = await fetch('/api/me');
    if (!meR.ok){ location.href='/login'; return false; }
    const me = await meR.json();
    if (me.role !== 'admin'){ location.href='/cabinet'; return false; }
    return true;
  }

  async function load(){
    setError('');
    if (!await checkAdmin()) return;

    const r = await fetch('/api/news/list?admin=1');
    const data = await r.json().catch(()=>({}));
    if (!r.ok){
      setError(data?.error || 'Не удалось загрузить новости');
      return;
    }
    setItems(data.items || []);
  }

  useEffect(()=>{ load(); },[]);

  function updateField(field, value){
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function startCreate(){
    setForm(emptyForm);
    setNotice('');
    setError('');
    setShowForm(true);
    window.scrollTo({ top:0, behavior:'smooth' });
  }

  function startEdit(item){
    setForm({
      id:item.id,
      title:item.title || '',
      excerpt:item.excerpt || '',
      content:item.content || '',
      image_url:item.image_url || '',
      is_published:Boolean(item.is_published)
    });
    setNotice('');
    setError('');
    setShowForm(true);
    window.scrollTo({ top:0, behavior:'smooth' });
  }

  function cancelEdit(){
    setForm(emptyForm);
    setShowForm(false);
    setError('');
    setNotice('');
  }

  async function save(e){
    e.preventDefault();
    setError('');
    setNotice('');

    const endpoint = form.id ? '/api/news/update' : '/api/news/create';
    const r = await fetch(endpoint, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    });
    const data = await r.json().catch(()=>({}));

    if (!r.ok){
      setError(data?.error || 'Не удалось сохранить новость');
      return;
    }

    setNotice('Новость сохранена');
    setForm(emptyForm);
    setShowForm(false);
    await load();
  }

  async function togglePublish(item){
    setError('');
    setNotice('');
    const r = await fetch('/api/news/update', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...item, is_published: !item.is_published })
    });
    const data = await r.json().catch(()=>({}));
    if (!r.ok){
      setError(data?.error || 'Не удалось изменить публикацию');
      return;
    }
    setNotice(item.is_published ? 'Новость скрыта' : 'Новость опубликована');
    await load();
  }

  async function remove(item){
    if (!window.confirm(`Удалить новость «${item.title}»?`)) return;
    setError('');
    setNotice('');

    const r = await fetch('/api/news/delete', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id:item.id })
    });
    const data = await r.json().catch(()=>({}));
    if (!r.ok){
      setError(data?.error || 'Не удалось удалить новость');
      return;
    }
    setNotice('Новость удалена');
    await load();
  }

  const image = form.image_url || '/images/news-maintenance.jpg';

  return (
    <Layout>
      <div className="container">
        <section className="page-hero">
          <span className="section-kicker">Админ-панель</span>
          <h1>Новости</h1>
          <p className="lead">Создавайте публикации, скрывайте черновики и обновляйте объявления для жителей.</p>
          <div className="admin-nav">
            <Link className="btn" href="/admin/requests">Заявки</Link>
            <Link className="btn primary" href="/admin/news">Новости</Link>
            <Link className="btn" href="/admin/feedback">Обратная связь</Link>
          </div>
        </section>

        {(showForm || error || notice) && (
          <section className="section grid">
            <div className="card two-third">
              <div className="toolbar">
                <h2>{form.id ? 'Редактировать новость' : 'Добавить новость'}</h2>
                {showForm && <button className="btn" type="button" onClick={cancelEdit}>Отмена</button>}
              </div>

              {error && <p className="notice danger">{error}</p>}
              {notice && <p className="notice success">{notice}</p>}

              {showForm && (
                <form className="form-stack" onSubmit={save}>
                  <div>
                    <label className="label">Заголовок</label>
                    <input className="input" value={form.title} onChange={e=>updateField('title', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Краткое описание</label>
                    <textarea className="input" value={form.excerpt} onChange={e=>updateField('excerpt', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Полный текст</label>
                    <textarea className="input" value={form.content} onChange={e=>updateField('content', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">URL изображения</label>
                    <input className="input" value={form.image_url} onChange={e=>updateField('image_url', e.target.value)} placeholder="/images/news-maintenance.jpg" />
                    <p className="small">Можно использовать локальные файлы из public/images, например /images/courtyard.jpg.</p>
                  </div>
                  <label className="toggle-row">
                    <input type="checkbox" checked={form.is_published} onChange={e=>updateField('is_published', e.target.checked)} />
                    Опубликовано
                  </label>
                  <div className="form-actions">
                    <button className="btn primary" type="submit">Сохранить</button>
                    <button className="btn" type="button" onClick={cancelEdit}>Отмена</button>
                  </div>
                </form>
              )}
            </div>

            {showForm && (
              <div className="card one-third">
                <h2>Предпросмотр</h2>
                <div className="news-card" style={{display:'block'}}>
                  <div className="news-image" style={{ '--news-image': `url("${image}")` }} />
                  <div className="news-body">
                    <p className="news-meta">{form.is_published ? 'Опубликовано' : 'Скрыто'}</p>
                    <h3>{form.title || 'Заголовок новости'}</h3>
                    <p>{form.excerpt || 'Краткое описание будет видно в карточке новости.'}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="section card">
          <div className="toolbar">
            <div>
              <span className="section-kicker">Список</span>
              <h2>Все новости</h2>
            </div>
            <button className="btn primary" type="button" onClick={startCreate}>Добавить новость</button>
          </div>

          {items.length === 0 ? (
            <div className="empty-state">Новостей пока нет. Добавьте первую публикацию.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>ID</th><th>Заголовок</th><th>Дата</th><th>Статус</th><th>Изображение</th><th></th></tr>
                </thead>
                <tbody>
                  {items.map(item=>(
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        <b>{item.title}</b>
                        <p className="small">{item.excerpt}</p>
                      </td>
                      <td>{formatDate(item.created_at)}</td>
                      <td>{item.is_published ? <span className="pill done">Опубликовано</span> : <span className="pill hidden">Скрыто</span>}</td>
                      <td>{item.image_url || 'Не указано'}</td>
                      <td className="actions">
                        <div className="admin-actions">
                          <button className="btn btn-sm" type="button" onClick={()=>startEdit(item)}>Редактировать</button>
                          <button className="btn btn-sm" type="button" onClick={()=>togglePublish(item)}>{item.is_published ? 'Скрыть' : 'Опубликовать'}</button>
                          <button className="btn btn-sm danger" type="button" onClick={()=>remove(item)}>Удалить</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
