import { useState } from 'react';

const categories = [
  'Сантехника',
  'Электрика',
  'Уборка',
  'Лифт',
  'Двор/территория',
  'Домофон',
  'Другое'
];

export default function RequestForm({ onCreated }){
  const [title,setTitle]=useState('');
  const [category,setCategory]=useState(categories[0]);
  const [description,setDescription]=useState('');
  const [error,setError]=useState('');
  const [ok,setOk]=useState('');

  async function submit(e){
    e.preventDefault();
    setError('');
    setOk('');

    const r = await fetch('/api/requests/create', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ title, category, description })
    });
    const data = await r.json().catch(()=>({}));

    if (!r.ok){
      setError(data?.error || 'Не удалось создать заявку');
      return;
    }

    setOk('Заявка создана');
    setTitle('');
    setDescription('');
    onCreated?.(data);
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <div className="row two">
        <div>
          <label className="label">Тема заявки</label>
          <input
            className="input"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            placeholder="Например: течет кран на кухне"
            required
          />
        </div>
        <div>
          <label className="label">Категория</label>
          <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
            {categories.map(item => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Описание</label>
        <textarea
          className="input"
          value={description}
          onChange={e=>setDescription(e.target.value)}
          placeholder="Опишите проблему, место и удобное время для связи"
          required
        />
      </div>

      <div className="form-actions">
        <button className="btn primary" type="submit">Создать заявку</button>
        {error && <span className="notice danger">{error}</span>}
        {ok && <span className="notice success">{ok}</span>}
      </div>
    </form>
  );
}
