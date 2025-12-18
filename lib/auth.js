import { getDB } from './db';
import { initDb } from './initDb';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import * as cookie from 'cookie';

const COOKIE_NAME = 'zm_session';

export async function ensureInit(){ await initDb(); }

export async function setSession(res, userId){
  await ensureInit();
  const db = await getDB();
  const token = nanoid(40);
  await db.run('INSERT INTO sessions(token,user_id) VALUES (?,?)', token, userId);
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60*60*24*7
  }));
}

export async function clearSession(req, res){
  await ensureInit();
  const db = await getDB();
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (token){ await db.run('DELETE FROM sessions WHERE token=?', token); }
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  }));
}

export async function getUserFromRequest(req){
  await ensureInit();
  const db = await getDB();
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const sess = await db.get('SELECT user_id FROM sessions WHERE token=?', token);
  if (!sess) return null;
  const user = await db.get('SELECT id, role, name, email, apartment, created_at FROM users WHERE id=?', sess.user_id);
  return user || null;
}

export async function requireUser(req, res){
  const user = await getUserFromRequest(req);
  if (!user){ res.status(401).json({ error:'UNAUTHORIZED' }); return null; }
  return user;
}

export async function requireAdmin(req, res){
  const user = await requireUser(req,res);
  if (!user) return null;
  if (user.role !== 'admin'){ res.status(403).json({ error:'FORBIDDEN' }); return null; }
  return user;
}

export function verifyPassword(password, hash){ return bcrypt.compareSync(password, hash); }
export function hashPassword(password){ return bcrypt.hashSync(password, 10); }
