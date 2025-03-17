require('dotenv').config();
const nodemailer = require('nodemailer');
const debugServer = require('debug')('app:server')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, verificationCode) => {
    debugServer("vercode : ", verificationCode)
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verifikasi Email Login Node',
        html: `<p>Klik tautan berikut untuk memverifikasi email Anda: <a href="http://localhost:3000/auth/verify/${verificationCode}">Verifikasi Email</a></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        debugServer('Email verifikasi telah dikirim ke', email);
    } catch (error) {
        debugServer('Gagal mengirim email:', error);
    }
};

module.exports = { sendVerificationEmail };