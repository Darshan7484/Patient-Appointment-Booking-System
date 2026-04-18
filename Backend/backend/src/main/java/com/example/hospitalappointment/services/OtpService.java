package com.example.hospitalappointment.services;

import com.example.hospitalappointment.models.Otp;
import com.example.hospitalappointment.model.User;
import com.example.hospitalappointment.repositories.OtpRepository;
import com.example.hospitalappointment.repository.UserRepository;
import com.example.hospitalappointment.utils.OtpUtil;
import com.example.hospitalappointment.utils.EmailTemplates;
import com.example.hospitalappointment.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * OTP Service
 * Handles OTP generation, validation, and management
 */
@Service
@Transactional
public class OtpService {
    
    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    
    @Autowired
    private OtpRepository otpRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired(required = false)
    private EmailService emailService;
    
    private static final int DEFAULT_EXPIRY_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;
    
    /**
     * Generate and send OTP to user
     * @param userId User ID
     * @param type OTP type (LOGIN, EMAIL_VERIFY, PASSWORD_RESET, MFA)
     * @return OTP code (for testing only)
     */
    public String generateAndSendOTP(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Invalidate previous OTPs of this type
        invalidatePreviousOTPs(userId, type);
        
        // Generate new OTP
        String otpCode = OtpUtil.generateNumericOTP();
        String hashedCode = OtpUtil.hashOTP(otpCode);
        
        // Save to database
        Otp otp = new Otp(userId, hashedCode, type, DEFAULT_EXPIRY_MINUTES);
        otpRepository.save(otp);
        
        // Send OTP via email
        sendOTPEmail(user, otpCode, type);
        
        // Return OTP (remove in production - only for testing/demo)
        return otpCode;
    }
    
    /**
     * Generate OTP with custom expiry
     * @param userId User ID
     * @param type OTP type
     * @param expiryMinutes Expiry time in minutes
     * @return OTP code
     */
    public String generateAndSendOTP(Long userId, String type, Integer expiryMinutes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        invalidatePreviousOTPs(userId, type);
        
        String otpCode = OtpUtil.generateNumericOTP();
        String hashedCode = OtpUtil.hashOTP(otpCode);
        
        Otp otp = new Otp(userId, hashedCode, type, expiryMinutes);
        otpRepository.save(otp);
        
        sendOTPEmail(user, otpCode, type);
        
        return otpCode;
    }
    
    /**
     * Verify OTP code
     * @param userId User ID
     * @param type OTP type
     * @param code OTP code to verify
     * @return true if valid, false otherwise
     */
    public boolean verifyOTP(Long userId, String type, String code) {
        Optional<Otp> otpOptional = otpRepository.findFirstByUserIdAndTypeOrderByCreatedAtDesc(userId, type);
        
        if (!otpOptional.isPresent()) {
            return false;
        }
        
        Otp otp = otpOptional.get();
        
        // Check if already used
        if (otp.getIsUsed()) {
            return false;
        }
        
        // Check if expired
        if (otp.isExpired()) {
            return false;
        }
        
        // Check if max attempts exceeded
        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            return false;
        }
        
        String hashedCode = OtpUtil.hashOTP(code);
        
        if (otp.getCode().equals(hashedCode)) {
            otp.markAsUsed();
            otpRepository.save(otp);
            return true;
        } else {
            otp.incrementAttempts();
            otpRepository.save(otp);
            return false;
        }
    }
    
    /**
     * Get OTP remaining time
     * @param userId User ID
     * @param type OTP type
     * @return Remaining seconds, -1 if not found
     */
    public long getOTPRemainingTime(Long userId, String type) {
        Optional<Otp> otpOptional = otpRepository.findFirstByUserIdAndTypeOrderByCreatedAtDesc(userId, type);
        
        if (!otpOptional.isPresent()) {
            return -1;
        }
        
        Otp otp = otpOptional.get();
        return otp.getRemainingSeconds();
    }
    
    /**
     * Check if OTP is valid (exists, not used, not expired)
     * @param userId User ID
     * @param type OTP type
     * @return true if valid OTP exists
     */
    public boolean hasValidOTP(Long userId, String type) {
        Optional<Otp> otpOptional = otpRepository.findFirstByUserIdAndTypeOrderByCreatedAtDesc(userId, type);
        return otpOptional.isPresent() && otpOptional.get().isValid();
    }
    
    /**
     * Resend OTP (within cooldown period)
     * @param userId User ID
     * @param type OTP type
     * @return OTP code
     */
    public String resendOTP(Long userId, String type) {
        // Check if OTP was recently sent (within 1 minute)
        LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);
        Optional<Otp> recentOTP = otpRepository.findFirstByUserIdAndTypeAndCreatedAtAfterOrderByCreatedAtDesc(
                userId, type, oneMinuteAgo);
        
        if (recentOTP.isPresent()) {
            throw new RuntimeException("Please wait 1 minute before requesting a new OTP");
        }
        
        return generateAndSendOTP(userId, type);
    }
    
    /**
     * Invalidate all previous OTPs of a type for user
     */
    private void invalidatePreviousOTPs(Long userId, String type) {
        var previousOTPs = otpRepository.findByUserIdAndTypeAndIsUsedFalse(userId, type);
        previousOTPs.forEach(otp -> {
            otp.setIsUsed(true);
            otpRepository.save(otp);
        });
    }
    
    /**
     * Send OTP via email
     */
    private void sendOTPEmail(User user, String otpCode, String type) {
        if (emailService == null) {
            logger.warn("EmailService not available. OTP email not sent for user: {}", user.getEmail());
            return;
        }
        
        String subject;
        String htmlContent;
        
        switch (type) {
            case "EMAIL_VERIFY":
                subject = "Verify Your Email - MediCare";
                htmlContent = EmailTemplates.getOTPEmailTemplate(
                    user.getName(),
                    otpCode,
                    "Email Verification",
                    DEFAULT_EXPIRY_MINUTES
                );
                break;
                
            case "PASSWORD_RESET":
                subject = "Password Reset OTP - MediCare";
                htmlContent = EmailTemplates.getOTPEmailTemplate(
                    user.getName(),
                    otpCode,
                    "Password Reset",
                    DEFAULT_EXPIRY_MINUTES
                );
                break;
                
            case "MFA":
                subject = "Login Verification OTP - MediCare";
                htmlContent = EmailTemplates.getOTPEmailTemplate(
                    user.getName(),
                    otpCode,
                    "Login Verification",
                    DEFAULT_EXPIRY_MINUTES
                );
                break;
                
            case "LOGIN":
            default:
                subject = "Login OTP - MediCare";
                htmlContent = EmailTemplates.getOTPEmailTemplate(
                    user.getName(),
                    otpCode,
                    "Login",
                    DEFAULT_EXPIRY_MINUTES
                );
                break;
        }
        
        try {
            emailService.sendEmail(user.getEmail(), subject, htmlContent);
            logger.info("OTP email sent successfully for type: {}", type);
        } catch (Exception e) {
            // Log error but don't fail OTP generation
            logger.error("Failed to send OTP email for type {}: {}", type, e.getMessage(), e);
        }
    }
    
    /**
     * Clean up expired OTPs (scheduled job)
     */
    @Transactional
    public void cleanupExpiredOTPs() {
        LocalDateTime thirtyMinutesAgo = LocalDateTime.now().minusMinutes(30);
        Long deletedCount = otpRepository.deleteByCreatedAtBefore(thirtyMinutesAgo);
        System.out.println("Cleaned up " + deletedCount + " expired OTPs");
    }
    
    /**
     * Get OTP attempt count
     */
    public int getOTPAttempts(Long userId, String type) {
        Optional<Otp> otpOptional = otpRepository.findFirstByUserIdAndTypeOrderByCreatedAtDesc(userId, type);
        return otpOptional.map(Otp::getAttempts).orElse(0);
    }
    
    /**
     * Get remaining attempts
     */
    public int getRemainingAttempts(Long userId, String type) {
        int attempts = getOTPAttempts(userId, type);
        return Math.max(0, MAX_ATTEMPTS - attempts);
    }
}
