// Email Template Service
// Generates professional HTML email templates for all notifications

export const emailTemplates = {
  // ========================================
  // VERIFICATION EMAIL
  // ========================================
  emailVerification: (userName, verificationLink, expiryHours = 24) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .header p { font-size: 14px; opacity: 0.9; }
    .content { padding: 40px; }
    .content h2 { color: #333; font-size: 22px; margin-bottom: 15px; }
    .content p { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }
    .btn:hover { opacity: 0.9; }
    .info-box { background: #f9f9f9; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .info-box p { margin: 0; font-size: 14px; color: #666; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
    .code { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; text-align: center; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏥 MediCare</h1>
      <p>Email Verification</p>
    </div>
    <div class="content">
      <h2>Welcome, ${userName}!</h2>
      <p>Thank you for registering with MediCare Hospital Appointment System. To complete your registration and activate your account, please verify your email address.</p>
      
      <div class="btn-container">
        <a href="${verificationLink}" class="btn">Verify Email Address</a>
      </div>

      <p style="text-align: center; font-size: 14px; color: #999;">Or copy this link:</p>
      <div class="code">${verificationLink}</div>

      <div class="info-box">
        <p><strong>⏰ Note:</strong> This verification link will expire in ${expiryHours} hours. If it expires, you can request a new verification email from the login page.</p>
      </div>

      <p>If you did not create this account, please ignore this email. Your email will not be verified unless you click the verification link above.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MediCare Hospital. All rights reserved.</p>
      <p>Questions? Contact support@medicare.hospital</p>
    </div>
  </div>
</body>
</html>
  `,

  // ========================================
  // APPOINTMENT CONFIRMATION EMAIL
  // ========================================
  appointmentConfirmation: (
    patientName,
    doctorName,
    appointmentDate,
    appointmentTime,
    location = 'Main Hospital'
  ) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px 20px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .content { padding: 40px; }
    .content h2 { color: #333; font-size: 22px; margin-bottom: 15px; }
    .details { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #666; font-weight: 600; }
    .detail-value { color: #333; text-align: right; }
    .icon { font-size: 24px; margin-right: 10px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
    .reminder { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .reminder p { margin: 0; font-size: 14px; color: #856404; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Appointment Confirmed</h1>
      <p>Your appointment has been successfully booked</p>
    </div>
    <div class="content">
      <h2>Hello ${patientName},</h2>
      <p>Your appointment has been confirmed. Here are the details:</p>
      
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">👨‍⚕️ Doctor</span>
          <span class="detail-value">Dr. ${doctorName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">📅 Date</span>
          <span class="detail-value">${appointmentDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">🕐 Time</span>
          <span class="detail-value">${appointmentTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">📍 Location</span>
          <span class="detail-value">${location}</span>
        </div>
      </div>

      <div class="reminder">
        <p><strong>⏰ Reminder:</strong> Please arrive 10-15 minutes early to complete any necessary paperwork.</p>
      </div>

      <h3 style="color: #333; margin-top: 30px; margin-bottom: 15px;">What to bring:</h3>
      <ul style="color: #666; line-height: 1.8; margin-left: 20px;">
        <li>Valid ID or Insurance Card</li>
        <li>Medical History documents (if any)</li>
        <li>List of current medications</li>
        <li>Any recent test results</li>
      </ul>

      <p style="margin-top: 20px; color: #666;">If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MediCare Hospital. All rights reserved.</p>
      <p>Questions? Contact support@medicare.hospital</p>
    </div>
  </div>
</body>
</html>
  `,

  // ========================================
  // APPOINTMENT REMINDER EMAIL
  // ========================================
  appointmentReminder: (
    patientName,
    doctorName,
    appointmentDate,
    appointmentTime,
    hoursUntil
  ) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Reminder</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); color: white; padding: 40px 20px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .content { padding: 40px; }
    .content h2 { color: #333; font-size: 22px; margin-bottom: 15px; }
    .countdown { background: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .countdown p { margin: 0; color: #003d99; font-size: 16px; font-weight: 600; }
    .details { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .detail-row { padding: 10px 0; }
    .detail-label { color: #666; font-weight: 600; }
    .detail-value { color: #333; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Appointment Reminder</h1>
      <p>Your appointment is coming up soon</p>
    </div>
    <div class="content">
      <h2>Hi ${patientName},</h2>
      
      <div class="countdown">
        <p>Your appointment is in approximately ${hoursUntil} hours!</p>
      </div>

      <h3 style="color: #333; margin-top: 20px; margin-bottom: 15px;">Appointment Details:</h3>
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">👨‍⚕️ Doctor:</span>
          <span class="detail-value">Dr. ${doctorName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">📅 Date:</span>
          <span class="detail-value">${appointmentDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">🕐 Time:</span>
          <span class="detail-value">${appointmentTime}</span>
        </div>
      </div>

      <p style="margin-top: 20px; color: #666;">Please remember to:</p>
      <ul style="color: #666; margin-left: 20px; line-height: 1.8;">
        <li>Arrive 10-15 minutes early</li>
        <li>Bring your ID and insurance card</li>
        <li>Have your medical history ready</li>
        <li>Bring a list of current medications</li>
      </ul>

      <p style="margin-top: 20px; color: #666;">If you need to reschedule or cancel, please let us know as soon as possible.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MediCare Hospital. All rights reserved.</p>
      <p>Questions? Contact support@medicare.hospital</p>
    </div>
  </div>
</body>
</html>
  `,

  // ========================================
  // PASSWORD RESET EMAIL
  // ========================================
  passwordReset: (userName, resetLink, expiryMinutes = 30) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 40px 20px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .content { padding: 40px; }
    .content h2 { color: #333; font-size: 22px; margin-bottom: 15px; }
    .content p { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }
    .warning { background: #ffe5e5; border-left: 4px solid #ff6b6b; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .warning p { margin: 0; font-size: 14px; color: #8b0000; }
    .code { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; text-align: center; word-break: break-all; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Password Reset Request</h1>
      <p>We received a request to reset your password</p>
    </div>
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <div class="btn-container">
        <a href="${resetLink}" class="btn">Reset Password</a>
      </div>

      <p style="text-align: center; font-size: 14px; color: #999;">Or copy this link:</p>
      <div class="code">${resetLink}</div>

      <div class="warning">
        <p><strong>⚠️ Security Notice:</strong> This link will expire in ${expiryMinutes} minutes. This link can only be used once.</p>
      </div>

      <p><strong>If you did not request a password reset:</strong> Please ignore this email. Your account is safe. If you believe someone is trying to access your account, please contact our support team immediately.</p>

      <p style="margin-top: 30px; color: #999; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MediCare Hospital. All rights reserved.</p>
      <p>Questions? Contact support@medicare.hospital</p>
    </div>
  </div>
</body>
</html>
  `,

  // ========================================
  // GENERIC NOTIFICATION EMAIL
  // ========================================
  genericNotification: (title, message, actionLink, actionText) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .content { padding: 40px; }
    .content p { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      ${message}
      ${actionLink ? `
        <div class="btn-container">
          <a href="${actionLink}" class="btn">${actionText || 'View Now'}</a>
        </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MediCare Hospital. All rights reserved.</p>
      <p>Questions? Contact support@medicare.hospital</p>
    </div>
  </div>
</body>
</html>
  `
};

export default emailTemplates;
