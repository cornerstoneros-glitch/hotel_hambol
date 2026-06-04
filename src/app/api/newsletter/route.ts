import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let email: string | undefined;

  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Corps de requête invalide.' },
      { status: 400 }
    );
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json(
      { success: false, error: 'Adresse email invalide.' },
      { status: 400 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  // Si Resend n'est pas configuré, on accepte quand même (mode dev / sans config)
  if (!resendApiKey || !audienceId) {
    console.log('[Newsletter] Inscription acceptée (Resend non configuré) :', email.trim());
    return NextResponse.json({ success: true });
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        unsubscribed: false,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[Newsletter API] Resend error:', res.status, errBody);
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'inscription." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Newsletter API] fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur de connexion au service email.' },
      { status: 500 }
    );
  }
}
