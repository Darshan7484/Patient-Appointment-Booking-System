package com.example.hospitalappointment.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * OTP (One-Time Password) Entity
 * Stores temporary OTP codes for authentication
 */
@Entity
@Table(name = "otps", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_user_type", columnList = "user_id, type")
})
public class Otp {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String code;  // Hashed OTP
    
    @Column(nullable = false)
    private String type;  // LOGIN, EMAIL_VERIFY, PASSWORD_RESET, MFA
    
    @Column(nullable = false)
    private Boolean isUsed = false;
    
    @Column(nullable = false)
    private Integer expiryMinutes = 10;  // Default 10 minutes
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer attempts = 0;  // Track failed attempts
    
    private String metadata;  // JSON data for additional info
    
    // Constructors
    public Otp() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Otp(Long userId, String code, String type) {
        this();
        this.userId = userId;
        this.code = code;
        this.type = type;
    }
    
    public Otp(Long userId, String code, String type, Integer expiryMinutes) {
        this(userId, code, type);
        this.expiryMinutes = expiryMinutes;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Boolean getIsUsed() {
        return isUsed;
    }
    
    public void setIsUsed(Boolean isUsed) {
        this.isUsed = isUsed;
    }
    
    public Integer getExpiryMinutes() {
        return expiryMinutes;
    }
    
    public void setExpiryMinutes(Integer expiryMinutes) {
        this.expiryMinutes = expiryMinutes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Integer getAttempts() {
        return attempts;
    }
    
    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }
    
    public String getMetadata() {
        return metadata;
    }
    
    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }
    
    // Helper methods
    public boolean isExpired() {
        LocalDateTime expiryTime = createdAt.plusMinutes(expiryMinutes);
        return LocalDateTime.now().isAfter(expiryTime);
    }
    
    public long getRemainingSeconds() {
        LocalDateTime expiryTime = createdAt.plusMinutes(expiryMinutes);
        long remaining = java.time.temporal.ChronoUnit.SECONDS.between(LocalDateTime.now(), expiryTime);
        return Math.max(0, remaining);
    }
    
    public boolean isValid() {
        return !isExpired() && !isUsed && attempts < 5;
    }
    
    public void incrementAttempts() {
        this.attempts++;
    }
    
    public void markAsUsed() {
        this.isUsed = true;
    }
}
