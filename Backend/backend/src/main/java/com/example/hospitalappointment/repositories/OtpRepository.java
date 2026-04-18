package com.example.hospitalappointment.repositories;

import com.example.hospitalappointment.models.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * OTP Repository
 * Database operations for OTP entities
 */
@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    
    /**
     * Find the most recent OTP for a user by type
     */
    Optional<Otp> findFirstByUserIdAndTypeOrderByCreatedAtDesc(Long userId, String type);
    
    /**
     * Find OTP by code
     */
    Optional<Otp> findByCode(String code);
    
    /**
     * Find all OTPs for a user
     */
    List<Otp> findByUserId(Long userId);
    
    /**
     * Find all unused OTPs for a user by type
     */
    List<Otp> findByUserIdAndTypeAndIsUsedFalse(Long userId, String type);
    
    /**
     * Find all unused OTPs for a user
     */
    List<Otp> findByUserIdAndIsUsedFalse(Long userId);
    
    /**
     * Find recent OTP for user (created within last X minutes)
     */
    Optional<Otp> findFirstByUserIdAndTypeAndCreatedAtAfterOrderByCreatedAtDesc(
            Long userId, 
            String type, 
            LocalDateTime createdAfter
    );
    
    /**
     * Delete expired OTPs
     */
    Long deleteByCreatedAtBefore(LocalDateTime createdBefore);
    
    /**
     * Delete used OTPs
     */
    Long deleteByIsUsedTrue();
    
    /**
     * Delete all OTPs for a user
     */
    Long deleteByUserId(Long userId);
    
    /**
     * Count unused OTPs for user by type
     */
    Long countByUserIdAndTypeAndIsUsedFalse(Long userId, String type);
    
    /**
     * Check if user has active OTP of given type
     */
   @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END " +
       "FROM Otp o WHERE o.userId = :userId AND o.type = :type " +
       "AND o.isUsed = false")
Boolean hasActiveOtp(@Param("userId") Long userId,
                     @Param("type") String type);
}
