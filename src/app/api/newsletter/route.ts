import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Adresse email invalide.' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (resendApiKey && audienceId) {
      // Add contact to Resend audience
      const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('[Newsletter API] Resend error:', err);
        return NextResponse.json(
          { success: false, error: 'Erreur lors de l\'inscription.' },
          { status: 500 }
        );
      }
    } else {
      // Log in development when Resend is not configured
      console.log('[Newsletter] New subscriber (Resend not configured):', email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Newsletter API]', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur.' },
      { status: 500 }
    );
  }
}
