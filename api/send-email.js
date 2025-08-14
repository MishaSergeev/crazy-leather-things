import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, subject, html } = req.body;

  if (!email || !subject || !html) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject,
      html,
    });

    res.status(200).json({ id: info.messageId, accepted: info.accepted });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Error sending email' });
  }
}