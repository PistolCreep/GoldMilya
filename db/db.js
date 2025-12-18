import fs from 'fs/promises';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let dbPromise;

export async function getDB(){
  if (!dbPromise){
    const dbPath = path.join(process.cwd(), 'db', 'database.sqlite');
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    dbPromise = open({ filename: dbPath, driver: sqlite3.Database });
    const db = await dbPromise;
    await db.exec('PRAGMA journal_mode = WAL;');
  }
  return dbPromise;
}
