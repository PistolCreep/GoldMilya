import { getDb } from './db';
import { initDb } from './initDb';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import * as cookie from 'cookie';

const COOKIE_NAME = 'zm_session';

export function ensureInit(){ initDb(); }

export function setSession(res, userId){
  ensureInit();
  const db = getDb();
  const token = nanoid(40);
  db.prepare('INSERT INTO sessions(token,user_id) VALUES (?,?)').run(token, userId);
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60*60*24*7
  }));
}

export function clearSession(req, res){
  ensureInit();
  const db = getDb();
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (token){ db.prepare('DELETE FROM sessions WHERE token=?').run(token); }
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  }));
}

export function getUserFromRequest(req){
  ensureInit();
  const db = getDb();
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const sess = db.prepare('SELECT user_id FROM sessions WHERE token=?').get(token);
  if (!sess) return null;
  const user = db.prepare('SELECT id, role, name, email, apartment, created_at FROM users WHERE id=?').get(sess.user_id);
  return user || null;
}

export function requireUser(req, res){
  const user = getUserFromRequest(req);
  if (!user){ res.status(401).json({ error:'UNAUTHORIZED' }); return null; }
  return user;
}

export function requireAdmin(req, res){
  const user = requireUser(req,res);
  if (!user) return null;
  if (user.role !== 'admin'){ res.status(403).json({ error:'FORBIDDEN' }); return null; }
  return user;
}

export function verifyPassword(password, hash){ return bcrypt.compareSync(password, hash); }
export function hashPassword(password){ return bcrypt.hashSync(password, 10); }
