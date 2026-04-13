const nodemailer = require('nodemailer');

console.log('SMTP config:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail({ to, subject, text }) {
    const result = await resend.emails.send({
        from: 'group7knightrate@leandrovivares.com',
        to,
        subject,
        text
    });
    console.log('Email result:', result);
}

module.exports = { sendMail };
