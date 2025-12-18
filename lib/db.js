import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db;

export function getDb(){
  if (db) return db;
  const dbPath = path.join(process.cwd(), 'db', 'database.sqlite');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  return db;
}
