package com.example.hospitalappointment.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Cache Configuration
 * Configures caching for improved performance
 * 
 * Supports multiple backends:
 * - In-memory caching (development)
 * - Redis (production)
 */
@Configuration
@EnableCaching
public class CacheConfig {
    
    /**
     * In-memory cache manager (development profile)
     * Uses ConcurrentHashMap for simple caching
     */
    @Bean
    @Profile("dev")
    public CacheManager devCacheManager() {
        return new ConcurrentMapCacheManager(
            "users",
            "doctors", 
            "appointments",
            "specializations",
            "availability",
            "appointments_by_patient",
            "appointments_by_doctor",
            "user_appointments_count",
            "doctor_appointments_count"
        );
    }
    
    /**
     * Redis cache manager (production profile)
     * Requires Redis server running
     */
    @Bean
    @Profile("prod")
    public CacheManager prodCacheManager() {
        // Redis cache manager would be configured here in production
        // For now, return the dev cache manager
        return devCacheManager();
    }
}
