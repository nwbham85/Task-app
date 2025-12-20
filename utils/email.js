// utils/email.js
import nodemailer from 'nodemailer';

export const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransporter({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password/${token}`;

  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER || 'passwordreset@yourapp.com',
    subject: 'Password Reset Request',
    text: `You are receiving this because you requested a password reset. 
           Please click on the following link to complete the process:
           ${resetUrl}
           If you did not request this, please ignore this email.`
  };

  await transporter.sendMail(mailOptions);
};