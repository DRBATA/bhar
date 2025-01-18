import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify your email',
    html: `
      <h1>Welcome to Morning Wellness!</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  })
}

interface DrinkOrder {
  package: 'BASIC' | 'PREMIUM'
  totalPrice: number
  drinks: number
  addOns?: {
    dayPass?: boolean
    iceBath?: boolean
  }
}

export async function sendDrinkConfirmation(email: string, order: DrinkOrder) {
  const addOns = []
  if (order.addOns?.dayPass) addOns.push('Morning Yacht Session')
  if (order.addOns?.iceBath) addOns.push('Ice Bath Experience')

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your Drink Order Confirmation',
    html: `
      <h1>Thanks for your order!</h1>
      
      <h2>Order Details:</h2>
      <ul>
        <li>${order.package} Package (${order.drinks} drinks)</li>
        ${addOns.map(addon => `<li>${addon}</li>`).join('')}
      </ul>

      <p>Total: ${order.totalPrice} AED</p>

      <h2>How to Redeem:</h2>
      <p>Simply show this email at our drinks station. Our staff will verify your order and help you choose your drinks.</p>

      ${order.addOns?.dayPass ? `
        <h2>Your Day Pass</h2>
        <p>Your pass includes a morning yacht session with:</p>
        <ul>
          <li>3-hour yacht experience (6am-9am)</li>
          <li>Daily wellness activity</li>
          <li>Premium location at Dubai Creek</li>
          <li>Stunning sunrise views</li>
        </ul>

        <div style="
          background-color: #f8f9fa;
          border-left: 4px solid #f43f5e;
          padding: 16px;
          margin: 16px 0;
        ">
          <p style="margin: 0; color: #666;">
            <strong>Flexible Booking:</strong> Your Day Pass is ready when you are! Book your preferred date anytime in the next 3 months.
          </p>
        </div>

        <h3 style="color: #f43f5e;">Ready to Schedule?</h3>
        <p>When you're ready to book your session:</p>
        <ol>
          <li>Click the button below</li>
          <li>Choose your preferred date</li>
          <li>Select your wellness activity</li>
          ${order.addOns?.iceBath ? '<li>Schedule your ice bath session</li>' : ''}
        </ol>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/booking?pass=day" style="
          display: inline-block;
          background-color: #f43f5e;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 16px 0;
        ">Book Your Session</a>
      ` : ''}

      ${order.addOns?.iceBath ? `
        <h3 style="color: #f43f5e;">Your Ice Bath Experience</h3>
        <ul>
          <li>20-minute rejuvenating session</li>
          <li>Schedule when booking your yacht session</li>
          <li>Pro tip: Best experienced after your wellness activity!</li>
        </ul>
      ` : ''}

      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />

      <p>Questions? Reply to this email or contact us at ${process.env.SUPPORT_EMAIL}</p>
      
      <p style="color: #666; font-size: 14px;">
        <em>Note: This email serves as your receipt. Please show it to our staff when redeeming your drinks.</em>
      </p>
    `,
  })
}
