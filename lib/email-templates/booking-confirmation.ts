interface BookingDetails {
  userName: string
  bookingId: string
  date: string
  membershipType: string
  events: Array<{
    name: string
    time: string
    price: number
  }>
  drinks: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  qrCode: string
}

export function getBookingConfirmationEmail(booking: BookingDetails) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background: linear-gradient(135deg, #4FB5E6, #FF9EAE);
            color: white;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .booking-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .event {
            border-left: 4px solid #4FB5E6;
            padding: 10px;
            margin: 10px 0;
            background: white;
          }
          .drink {
            border-left: 4px solid #FF9EAE;
            padding: 10px;
            margin: 10px 0;
            background: white;
          }
          .total {
            font-size: 1.2em;
            font-weight: bold;
            text-align: right;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .qr-code {
            text-align: center;
            margin: 30px 0;
          }
          .note {
            font-style: italic;
            color: #666;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Confirmation</h1>
          <p>The Water Bar Morning Party</p>
        </div>

        <p>Hello ${booking.userName},</p>
        
        <p>Thank you for booking your morning wellness experience! Here are your booking details:</p>

        <div class="booking-details">
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Package:</strong> ${booking.membershipType}</p>
          
          ${booking.events.length > 0 ? `
            <h3>Your Experiences:</h3>
            ${booking.events.map(event => `
              <div class="event">
                <p><strong>${event.name}</strong></p>
                <p>Time: ${event.time}</p>
                <p>Price: ${event.price} AED</p>
              </div>
            `).join('')}
          ` : ''}

          ${booking.drinks.length > 0 ? `
            <h3>Your Drinks:</h3>
            ${booking.drinks.map(drink => `
              <div class="drink">
                <p><strong>${drink.name}</strong> x${drink.quantity}</p>
                <p>Price: ${drink.price} AED</p>
              </div>
            `).join('')}
          ` : ''}
        </div>

        <div class="total">
          Total Amount: ${booking.totalAmount} AED
        </div>

        <div class="qr-code">
          <p><strong>Your Check-in QR Code:</strong></p>
          <img src="${booking.qrCode}" alt="Check-in QR Code" style="max-width: 200px;">
        </div>

        <div class="note">
          <p>Please arrive 15 minutes before your first scheduled experience.</p>
          <p>Don't forget to bring comfortable clothing and a positive attitude!</p>
          ${booking.membershipType === 'SUBSCRIBER' ? `
            <p>As a subscriber, you've received member pricing on experiences and drinks.</p>
          ` : ''}
        </div>

        <p style="text-align: center; margin-top: 40px;">
          Questions? Contact us at support@thewaterbar.com
        </p>
      </body>
    </html>
  `
}
