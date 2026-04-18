package com.example.hospitalappointment.utils;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.security.SecureRandom;
import java.util.Random;

/**
 * OTP (One-Time Password) Utility
 * Generates and validates OTP codes with expiry
 */
public class OtpUtil {
    
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String NUMERIC_CHARS = "0123456789";
    private static final String ALPHANUMERIC_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    /**
     * Generate a numeric OTP (6 digits)
     * @return 6-digit OTP code
     */
    public static String generateNumericOTP() {
        return generateOTP(6, NUMERIC_CHARS);
    }
    
    /**
     * Generate an alphanumeric OTP (8 characters)
     * @return 8-character OTP code
     */
    public static String generateAlphanumericOTP() {
        return generateOTP(8, ALPHANUMERIC_CHARS);
    }
    
    /**
     * Generate custom OTP
     * @param length Length of OTP
     * @param characters Characters to use
     * @return Generated OTP
     */
    public static String generateOTP(int length, String characters) {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = RANDOM.nextInt(characters.length());
            otp.append(characters.charAt(randomIndex));
        }
        return otp.toString();
    }
    
    /**
     * Validate OTP hasn't expired
     * @param createdAt OTP creation time
     * @param expiryMinutes Expiry duration in minutes
     * @return true if not expired, false otherwise
     */
    public static boolean isOTPValid(LocalDateTime createdAt, int expiryMinutes) {
        LocalDateTime expiryTime = createdAt.plusMinutes(expiryMinutes);
        return LocalDateTime.now().isBefore(expiryTime);
    }
    
    /**
     * Get remaining time until OTP expires
     * @param createdAt OTP creation time
     * @param expiryMinutes Expiry duration in minutes
     * @return Remaining seconds, 0 if expired
     */
    public static long getRemainingSeconds(LocalDateTime createdAt, int expiryMinutes) {
        LocalDateTime expiryTime = createdAt.plusMinutes(expiryMinutes);
        long remaining = ChronoUnit.SECONDS.between(LocalDateTime.now(), expiryTime);
        return Math.max(0, remaining);
    }
    
    /**
     * Hash OTP for secure storage
     * @param otp OTP to hash
     * @return Hashed OTP
     */
    public static String hashOTP(String otp) {
        return Integer.toHexString(otp.hashCode());
    }
    
    /**
     * Format OTP for display (e.g., "123 456")
     * @param otp OTP code
     * @return Formatted OTP
     */
    public static String formatOTP(String otp) {
        if (otp.length() == 6) {
            return otp.substring(0, 3) + " " + otp.substring(3);
        }
        return otp;
    }
}
