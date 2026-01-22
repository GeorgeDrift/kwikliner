const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'password'
    },
    tls: {
        rejectUnauthorized: false
    }
});

const emailService = {
    sendWelcomeEmail: async (user) => {
        try {
            const mailOptions = {
                from: `"KwikLiner Support" <${process.env.SMTP_USER}>`,
                to: user.email,
                subject: 'Welcome to KwikLiner! 🚀',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #2563eb;">Welcome to KwikLiner, ${user.name}!</h2>
                        <p>We are thrilled to have you onboard as a <strong>${user.role}</strong>.</p>
                        <p>KwikLiner is Africa's premier logistics marketplace.</p>
                        <br>
                        <p>Best regards,<br>The KwikLiner Team</p>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }
    },

    sendVerificationEmail: async ({ name, email, token }) => {
        try {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const verificationLink = `${frontendUrl}/#/verify-email?token=${token}`;

            console.log('--- VERIFICATION LINK GENERATED ---');
            console.log(`User: ${name} (${email})`);
            console.log(`Link: ${verificationLink}`);
            console.log('------------------------------------');

            const mailOptions = {
                from: `"KwikLiner Support" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Verify your KwikLiner Account 🛡️',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #2563eb; text-align: center;">Verify Your Email</h2>
                        <p>Hi ${name},</p>
                        <p>Thank you for registering with KwikLiner. To get started, please verify your email address by clicking the button below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Verify Email Address</a>
                        </div>
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #666;">${verificationLink}</p>
                        <br>
                        <p>Best regards,<br>The KwikLiner Team</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
                        <p style="font-size: 11px; color: #999; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
                    </div>
                `
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Verification email sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending verification email:', error);
            return null;
        }
    }
};

module.exports = emailService;
