import { clearSession } from '../../../lib/auth';
export default function handler(req,res){ if(req.method!=='POST') return res.status(405).json({error:'METHOD_NOT_ALLOWED'}); clearSession(req,res); return res.status(200).json({ok:true}); }
