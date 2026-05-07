import { NextResponse } from 'next/server';

// TODO: integrate with a real newsletter provider (Mailchimp, Brevo, ConvertKit, etc.).
// For now this endpoint validates input shape and logs the signup.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const data = payload as { name?: unknown; email?: unknown };
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  // Stub: log only.
  console.log('[newsletter] signup', { name, email });
  return NextResponse.json({ ok: true });
}
