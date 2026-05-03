import { getDB } from './db';
import bcrypt from 'bcryptjs';

const seedNews = [
  {
    title: 'Плановые работы по отоплению',
    excerpt: 'В доме пройдет проверка узла учета и регулировка параметров отопления перед сезонной нагрузкой.',
    content: 'Уважаемые жители, управляющая компания проведет плановые работы по проверке узла учета, балансировке системы и контролю параметров отопления. На время работ возможны кратковременные изменения температуры теплоносителя. Дополнительная информация будет размещена в личном кабинете и на информационных стендах.',
    image_url: '/images/news-maintenance.jpg'
  },
  {
    title: 'Собрание жильцов',
    excerpt: 'Приглашаем собственников обсудить благоустройство двора, бюджет работ и приоритеты обслуживания.',
    content: 'Собрание жильцов посвящено вопросам благоустройства придомовой территории, плану сезонных работ, обслуживанию общедомового имущества и развитию цифровых сервисов для жителей. Предложения можно направить через форму обратной связи на сайте.',
    image_url: '/images/courtyard.jpg'
  },
  {
    title: 'Профилактика лифтового оборудования',
    excerpt: 'Специалисты выполнят диагностику лифтов и домофонной инфраструктуры по утвержденному графику.',
    content: 'В рамках профилактики будет проведена диагностика лифтового оборудования, проверка систем безопасности и осмотр домофонной инфраструктуры. Работы направлены на повышение надежности оборудования и снижение количества аварийных обращений.',
    image_url: '/images/entrance.jpg'
  }
];

export async function initDb(){
  const db = await getDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      apartment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER NOT NULL,
      sender_role TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      topic TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    );
  `);

  const admin = await db.get('SELECT id FROM users WHERE email=?', 'admin@zolotayamile.local');
  if (!admin){
    const hash = bcrypt.hashSync('admin123', 10);
    await db.run(
      'INSERT INTO users(role,name,email,password,apartment) VALUES (?,?,?,?,?)',
      'admin',
      'Администратор УК',
      'admin@zolotayamile.local',
      hash,
      'Не указана'
    );
  }

  const count = await db.get('SELECT COUNT(*) as total FROM news');
  if (!count?.total){
    for (const item of seedNews){
      await db.run(
        'INSERT INTO news(title,excerpt,content,image_url,is_published) VALUES (?,?,?,?,?)',
        item.title,
        item.excerpt,
        item.content,
        item.image_url,
        1
      );
    }
  }
}
