package com.example.hospitalappointment.service;

import com.example.hospitalappointment.model.EmailVerificationToken;
import com.example.hospitalappointment.model.PasswordResetToken;
import com.example.hospitalappointment.model.User;
import com.example.hospitalappointment.repository.EmailVerificationTokenRepository;
import com.example.hospitalappointment.repository.PasswordResetTokenRepository;
import com.example.hospitalappointment.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthenticationService {

    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthenticationService(EmailVerificationTokenRepository emailVerificationTokenRepository,
                               PasswordResetTokenRepository passwordResetTokenRepository,
                               UserRepository userRepository,
                               PasswordEncoder passwordEncoder,
                               EmailService emailService) {
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    /**
     * Generate and send email verification token
     */
    public String generateEmailVerificationToken(User user) {
        // Delete any existing tokens for this user
        emailVerificationTokenRepository.deleteByUser(user);
        
        // Generate new token
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = new EmailVerificationToken(token, user);
        emailVerificationTokenRepository.save(verificationToken);
        
        // Send email
        String verificationLink = "http://localhost:3000/verify-email?token=" + token;
        String subject = "Email Verification - Hospital Appointment System";
        String message = "Please click the link below to verify your email:\n" + verificationLink + 
                        "\n\nThis link will expire in 24 hours.";
        emailService.sendEmail(user.getEmail(), subject, message);
        
        return token;
    }

    /**
     * Verify email with token
     */
    public boolean verifyEmail(String token) {
        Optional<EmailVerificationToken> optionalToken = emailVerificationTokenRepository.findByToken(token);
        
        if (optionalToken.isEmpty()) {
            return false;
        }
        
        EmailVerificationToken verificationToken = optionalToken.get();
        
        if (verificationToken.isExpired()) {
            emailVerificationTokenRepository.delete(verificationToken);
            return false;
        }
        
        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        emailVerificationTokenRepository.delete(verificationToken);
        
        return true;
    }

    /**
     * Generate and send password reset token
     */
    public String generatePasswordResetToken(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        
        if (optionalUser.isEmpty()) {
            return null;
        }
        
        User user = optionalUser.get();
        
        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);
        
        // Generate new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(resetToken);
        
        // Send email
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        String subject = "Password Reset - Hospital Appointment System";
        String message = "Please click the link below to reset your password:\n" + resetLink + 
                        "\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.";
        emailService.sendEmail(user.getEmail(), subject, message);
        
        return token;
    }

    /**
     * Reset password with token
     */
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> optionalToken = passwordResetTokenRepository.findByToken(token);
        
        if (optionalToken.isEmpty()) {
            return false;
        }
        
        PasswordResetToken resetToken = optionalToken.get();
        
        if (!resetToken.isValid()) {
            if (resetToken.isExpired()) {
                passwordResetTokenRepository.delete(resetToken);
            }
            return false;
        }
        
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
        
        // Send confirmation email
        String subject = "Password Reset Successful - Hospital Appointment System";
        String message = "Your password has been successfully reset. If you did not make this change, please contact support immediately.";
        emailService.sendEmail(user.getEmail(), subject, message);
        
        return true;
    }

    /**
     * Check if email is verified
     */
    public boolean isEmailVerified(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        return optionalUser.map(User::getEmailVerified).orElse(false);
    }

    /**
     * Resend verification email
     */
    public boolean resendVerificationEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        
        if (optionalUser.isEmpty()) {
            return false;
        }
        
        User user = optionalUser.get();
        
        if (user.getEmailVerified()) {
            return false; // Already verified
        }
        
        generateEmailVerificationToken(user);
        return true;
    }
}
