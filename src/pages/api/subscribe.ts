import type { NextApiRequest, NextApiResponse } from 'next';

const MAILERLITE_GROUP_ID = '180387872171361369';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, company, score, personaName } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.error('MAILERLITE_API_KEY is not set');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        fields: {
          name: name || '',
          company: company || '',
          quiz_score: score != null ? String(score) : '',
          persona: personaName || '',
        },
        groups: [MAILERLITE_GROUP_ID],
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      console.error('MailerLite API error:', response.status, body);
      return res.status(response.status).json({ error: (body as { message?: string }).message ?? 'Subscription failed' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('MailerLite fetch error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
