import Resend from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { email, message } = req.body;

    if (!email || !message) {
      res.status(400).json({ error: 'Email and message required' });
      return;
    }

    await resend.emails.send({
      from: 'sergeev.mikhail.serg@gmail.com',
      to: email,
      subject: 'Сообщение с сайта',
      html: `<p>${message}</p>`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
