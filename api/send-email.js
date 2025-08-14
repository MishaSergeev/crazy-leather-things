import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { email, subject, html } = req.body;

    if (!email || !subject || !html) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
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
            html: html,
        });

        res.json({ id: info.messageId, accepted: info.accepted });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Error sending email' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));