import nodemailer from 'nodemailer'

// Configure email transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@thewaterbar.com',
      to,
      subject,
      html,
    })
    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
