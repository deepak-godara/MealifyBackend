const nodemailer = require('nodemailer');

const sendEmail = async ({ toemail, Status, Hname, Uname, OrderId }) => {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: 'mealifyapp@gmail.com',
            pass: "ktet zfgq kpqu dyji" 
        }
    });

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f6f6f6;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 10px 0;
          }
          .content {
            text-align: left;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Status Update for ${Status}</h1>
          </div>
          <div class="content">
            <p>Hello ${Uname},</p>
            <p>Your current order status is: <strong>${Status}</strong>.</p>
            <p>Best regards,</p>
            <p><strong>Mealify</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Mealify. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: 'mealifyapp@gmail.com',
    to: toemail,
    subject: `Status Update for ${OrderId}`,
    html: htmlTemplate,
  };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log('Error sending email: ' + error);
    }
};

module.exports = { sendEmail };
