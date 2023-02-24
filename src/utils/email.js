const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (email, link) => {
    try {
        const senderEmail = process.env.SENDER_EMAIL
        const senderPassword = process.env.SENDER_EMAIL_PASSWORD
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: senderEmail,
                pass: senderPassword,
            },
        });

        await transporter.sendMail({
            from: senderEmail,
            to: email,
            subject: 'Email Verification Link',
            html: `<p>Hello!</p><p>Please click on the verification link to confirm your email. If you did not initiate this registration, please disregard this message</p><a href=${link}>Verify Your Email</a>`
        })

    } catch (error) {
        throw new Error(error)
    }
})

module.exports = sendEmail
