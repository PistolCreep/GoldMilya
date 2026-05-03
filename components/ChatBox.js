import { useState } from 'react';

export default function ChatBox({ requestId, onSent }){
  const [text,setText]=useState('');
  const [error,setError]=useState('');

  async function send(e){
    e.preventDefault();
    setError('');
    if (!text.trim()) return;

    const r = await fetch('/api/requests/reply', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ requestId, message: text })
    });

    const data = await r.json().catch(()=>({}));
    if (!r.ok){
      setError(data?.error || 'Не удалось отправить сообщение');
      return;
    }

    setText('');
    onSent?.();
  }

  return (
    <form className="chat-form" onSubmit={send}>
      <input
        className="input"
        value={text}
        onChange={e=>setText(e.target.value)}
        placeholder="Написать сообщение..."
      />
      <button className="btn primary" type="submit">Отправить</button>
      {error && <span className="notice danger">{error}</span>}
    </form>
  );
}
