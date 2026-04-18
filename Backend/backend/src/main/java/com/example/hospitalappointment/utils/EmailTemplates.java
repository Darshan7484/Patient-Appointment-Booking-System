package com.example.hospitalappointment.utils;

/**
 * Email Template Utility
 * Generates professional HTML emails for system notifications
 */
public class EmailTemplates {

    /**
     * Email Verification Template
     */
    public static String getEmailVerificationTemplate(String userName, String verificationLink, int expiryHours) {
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "  <meta charset=\"UTF-8\">\n" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "  <title>Verify Your Email</title>\n" +
                "  <style>\n" +
                "    * { margin: 0; padding: 0; box-sizing: border-box; }\n" +
                "    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }\n" +
                "    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }\n" +
                "    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }\n" +
                "    .header h1 { font-size: 28px; margin-bottom: 5px; }\n" +
                "    .content { padding: 40px; }\n" +
                "    .content h2 { color: #333; font-size: 22px; margin-bottom: 15px; }\n" +
                "    .content p { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }\n" +
                "    .btn-container { text-align: center; margin: 30px 0; }\n" +
                "    .btn { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }\n" +
                "    .info-box { background: #f9f9f9; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }\n" +
                "    .code { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; text-align: center; word-break: break-all; }\n" +
                "    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999; }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"container\">\n" +
                "    <div class=\"header\">\n" +
                "      <h1>🏥 MediCare</h1>\n" +
                "      <p>Email Verification</p>\n" +
                "    </div>\n" +
                "    <div class=\"content\">\n" +
                "      <h2>Welcome, " + userName + "!</h2>\n" +
                "      <p>Thank you for registering with MediCare Hospital Appointment System. To complete your registration and activate your account, please verify your email address.</p>\n" +
                "      \n" +
                "      <div class=\"btn-container\">\n" +
                "        <a href=\"" + verificationLink + "\" class=\"btn\">Verify Email Address</a>\n" +
                "      </div>\n" +
                "\n" +
                "      <p style=\"text-align: center; font-size: 14px; color: #999;\">Or copy this link:</p>\n" +
                "      <div class=\"code\">" + verificationLink + "</div>\n" +
                "\n" +
                "      <div class=\"info-box\">\n" +
                "        <p><strong>⏰ Note:</strong> This verification link will expire in " + expiryHours + " hours.</p>\n" +
                "      </div>\n" +
                "\n" +
                "      <p>If you did not create this account, please ignore this email.</p>\n" +
                "    </div>\n" +
                "    <div class=\"footer\">\n" +
                "      <p>&copy; 2026 MediCare Hospital. All rights reserved.</p>\n" +
                "      <p>Questions? Contact support@medicare.hospital</p>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>";
    }

    /**
     * Appointment Confirmation Template
     */
    public static String getAppointmentConfirmationTemplate(
            String patientName,
            String doctorName,
            String appointmentDate,
            String appointmentTime,
            String location) {
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "  <meta charset=\"UTF-8\">\n" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "  <title>Appointment Confirmation</title>\n" +
                "  <style>\n" +
                "    * { margin: 0; padding: 0; box-sizing: border-box; }\n" +
                "    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }\n" +
                "    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }\n" +
                "    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px 20px; text-align: center; }\n" +
                "    .header h1 { font-size: 28px; margin-bottom: 5px; }\n" +
                "    .content { padding: 40px; }\n" +
                "    .details { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; }\n" +
                "    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }\n" +
                "    .detail-label { color: #666; font-weight: 600; }\n" +
                "    .detail-value { color: #333; text-align: right; }\n" +
                "    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999; }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"container\">\n" +
                "    <div class=\"header\">\n" +
                "      <h1>✓ Appointment Confirmed</h1>\n" +
                "      <p>Your appointment has been successfully booked</p>\n" +
                "    </div>\n" +
                "    <div class=\"content\">\n" +
                "      <h2>Hello " + patientName + ",</h2>\n" +
                "      <p>Your appointment has been confirmed. Here are the details:</p>\n" +
                "      \n" +
                "      <div class=\"details\">\n" +
                "        <div class=\"detail-row\">\n" +
                "          <span class=\"detail-label\">👨‍⚕️ Doctor</span>\n" +
                "          <span class=\"detail-value\">Dr. " + doctorName + "</span>\n" +
                "        </div>\n" +
                "        <div class=\"detail-row\">\n" +
                "          <span class=\"detail-label\">📅 Date</span>\n" +
                "          <span class=\"detail-value\">" + appointmentDate + "</span>\n" +
                "        </div>\n" +
                "        <div class=\"detail-row\">\n" +
                "          <span class=\"detail-label\">🕐 Time</span>\n" +
                "          <span class=\"detail-value\">" + appointmentTime + "</span>\n" +
                "        </div>\n" +
                "        <div class=\"detail-row\">\n" +
                "          <span class=\"detail-label\">📍 Location</span>\n" +
                "          <span class=\"detail-value\">" + location + "</span>\n" +
                "        </div>\n" +
                "      </div>\n" +
                "\n" +
                "      <p style=\"margin-top: 20px; color: #666;\">Please arrive 10-15 minutes early. If you need to reschedule, contact us at least 24 hours before.</p>\n" +
                "    </div>\n" +
                "    <div class=\"footer\">\n" +
                "      <p>&copy; 2026 MediCare Hospital. All rights reserved.</p>\n" +
                "      <p>Questions? Contact support@medicare.hospital</p>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>";
    }

    /**
     * Appointment Reminder Template
     */
    public static String getAppointmentReminderTemplate(
            String patientName,
            String doctorName,
            String appointmentDate,
            String appointmentTime,
            int hoursUntil) {
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "  <meta charset=\"UTF-8\">\n" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "  <title>Appointment Reminder</title>\n" +
                "  <style>\n" +
                "    * { margin: 0; padding: 0; box-sizing: border-box; }\n" +
                "    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }\n" +
                "    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }\n" +
                "    .header { background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); color: white; padding: 40px 20px; text-align: center; }\n" +
                "    .content { padding: 40px; }\n" +
                "    .countdown { background: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0; border-radius: 4px; }\n" +
                "    .details { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; }\n" +
                "    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999; }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"container\">\n" +
                "    <div class=\"header\">\n" +
                "      <h1>⏰ Appointment Reminder</h1>\n" +
                "      <p>Your appointment is coming up soon</p>\n" +
                "    </div>\n" +
                "    <div class=\"content\">\n" +
                "      <h2>Hi " + patientName + ",</h2>\n" +
                "      \n" +
                "      <div class=\"countdown\">\n" +
                "        <p>Your appointment is in approximately " + hoursUntil + " hours!</p>\n" +
                "      </div>\n" +
                "\n" +
                "      <h3 style=\"color: #333; margin-top: 20px; margin-bottom: 15px;\">Appointment Details:</h3>\n" +
                "      <div class=\"details\">\n" +
                "        <p><strong>👨‍⚕️ Doctor:</strong> Dr. " + doctorName + "</p>\n" +
                "        <p><strong>📅 Date:</strong> " + appointmentDate + "</p>\n" +
                "        <p><strong>🕐 Time:</strong> " + appointmentTime + "</p>\n" +
                "      </div>\n" +
                "\n" +
                "      <p style=\"margin-top: 20px; color: #666;\">Please arrive 10-15 minutes early with your ID and insurance card.</p>\n" +
                "    </div>\n" +
                "    <div class=\"footer\">\n" +
                "      <p>&copy; 2026 MediCare Hospital. All rights reserved.</p>\n" +
                "      <p>Questions? Contact support@medicare.hospital</p>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>";
    }

    /**
     * Password Reset Template
     */
    public static String getPasswordResetTemplate(String userName, String resetLink, int expiryMinutes) {
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "  <meta charset=\"UTF-8\">\n" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "  <title>Reset Your Password</title>\n" +
                "  <style>\n" +
                "    * { margin: 0; padding: 0; box-sizing: border-box; }\n" +
                "    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }\n" +
                "    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }\n" +
                "    .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 40px 20px; text-align: center; }\n" +
                "    .content { padding: 40px; }\n" +
                "    .btn-container { text-align: center; margin: 30px 0; }\n" +
                "    .btn { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }\n" +
                "    .warning { background: #ffe5e5; border-left: 4px solid #ff6b6b; padding: 15px; margin: 20px 0; border-radius: 4px; }\n" +
                "    .code { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; text-align: center; word-break: break-all; }\n" +
                "    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999; }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"container\">\n" +
                "    <div class=\"header\">\n" +
                "      <h1>🔐 Password Reset Request</h1>\n" +
                "      <p>We received a request to reset your password</p>\n" +
                "    </div>\n" +
                "    <div class=\"content\">\n" +
                "      <h2>Hi " + userName + ",</h2>\n" +
                "      <p>We received a request to reset your password. Click the button below to create a new password:</p>\n" +
                "      \n" +
                "      <div class=\"btn-container\">\n" +
                "        <a href=\"" + resetLink + "\" class=\"btn\">Reset Password</a>\n" +
                "      </div>\n" +
                "\n" +
                "      <p style=\"text-align: center; font-size: 14px; color: #999;\">Or copy this link:</p>\n" +
                "      <div class=\"code\">" + resetLink + "</div>\n" +
                "\n" +
                "      <div class=\"warning\">\n" +
                "        <p><strong>⚠️ Security Notice:</strong> This link will expire in " + expiryMinutes + " minutes.</p>\n" +
                "      </div>\n" +
                "\n" +
                "      <p><strong>If you did not request this:</strong> Please ignore this email. Your account is safe.</p>\n" +
                "    </div>\n" +
                "    <div class=\"footer\">\n" +
                "      <p>&copy; 2026 MediCare Hospital. All rights reserved.</p>\n" +
                "      <p>Questions? Contact support@medicare.hospital</p>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>";
    }

    /**
     * OTP Email Template
     */
    public static String getOTPEmailTemplate(String userName, String otpCode, String purpose, int expiryMinutes) {
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "  <meta charset=\"UTF-8\">\n" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "  <title>" + purpose + " OTP</title>\n" +
                "  <style>\n" +
                "    * { margin: 0; padding: 0; box-sizing: border-box; }\n" +
                "    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }\n" +
                "    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }\n" +
                "    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }\n" +
                "    .header h1 { font-size: 28px; margin-bottom: 5px; }\n" +
                "    .content { padding: 40px; }\n" +
                "    .content h2 { color: #333; font-size: 22px; margin-bottom: 15px; }\n" +
                "    .content p { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }\n" +
                "    .otp-box { background: linear-gradient(135deg, #f0f4ff 0%, #f9f9ff 100%); border: 2px solid #667eea; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }\n" +
                "    .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #667eea; font-family: monospace; }\n" +
                "    .otp-label { font-size: 12px; color: #999; margin-top: 10px; text-transform: uppercase; }\n" +
                "    .info-box { background: #f9f9f9; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }\n" +
                "    .info-box p { margin: 0; font-size: 14px; color: #666; }\n" +
                "    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }\n" +
                "    .warning p { margin: 0; font-size: 14px; color: #856404; }\n" +
                "    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999; }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"container\">\n" +
                "    <div class=\"header\">\n" +
                "      <h1>🔐 " + purpose + "</h1>\n" +
                "      <p>Your One-Time Password</p>\n" +
                "    </div>\n" +
                "    <div class=\"content\">\n" +
                "      <h2>Hi " + userName + ",</h2>\n" +
                "      <p>Your One-Time Password (OTP) for " + purpose + " is:</p>\n" +
                "      \n" +
                "      <div class=\"otp-box\">\n" +
                "        <div class=\"otp-code\">" + otpCode.substring(0, 3) + " " + otpCode.substring(3) + "</div>\n" +
                "        <div class=\"otp-label\">One-Time Password</div>\n" +
                "      </div>\n" +
                "\n" +
                "      <div class=\"info-box\">\n" +
                "        <p><strong>ℹ️ This OTP is valid for " + expiryMinutes + " minutes only.</strong></p>\n" +
                "        <p style=\"margin-top: 8px;\">Do not share this code with anyone.</p>\n" +
                "      </div>\n" +
                "\n" +
                "      <div class=\"warning\">\n" +
                "        <p><strong>⚠️ Security Notice:</strong> If you did not request this OTP, please ignore this email. Your account is safe.</p>\n" +
                "      </div>\n" +
                "\n" +
                "      <p style=\"font-size: 14px; color: #666; margin-top: 30px;\">Received by mistake? <a href=\"mailto:support@medicare.hospital\" style=\"color: #667eea; text-decoration: none;\">Contact us</a></p>\n" +
                "    </div>\n" +
                "    <div class=\"footer\">\n" +
                "      <p>&copy; 2026 MediCare Hospital. All rights reserved.</p>\n" +
                "      <p>Questions? Contact support@medicare.hospital</p>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>";
    }
}
