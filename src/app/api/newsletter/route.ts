import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const data = payload as { name?: unknown; email?: unknown; company?: unknown };
  if (typeof data.company === 'string' && data.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  console.log('[newsletter] signup', { name, email });
  return NextResponse.json({ ok: true });
}
