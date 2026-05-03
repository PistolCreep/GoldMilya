export default function StatusPill({ status }){
  const map = {
    new: 'Новая',
    in_progress: 'В работе',
    done: 'Выполнена'
  };

  return <span className={'pill ' + (status || 'new')}>{map[status] || status}</span>;
}
