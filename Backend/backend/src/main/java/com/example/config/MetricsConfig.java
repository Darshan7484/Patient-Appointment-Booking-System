package com.example.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Timer;
import org.springframework.context.annotation.Configuration;

/**
 * ========== PHASE 2: PERFORMANCE MONITORING METRICS ==========
 * Custom Metrics Configuration for Application Performance Tracking
 * 
 * Enables real-time monitoring of:
 * - Cache hit/miss rates
 * - API endpoint performance
 * - Database query performance
 * - Business metrics (appointments created, etc.)
 */
@Configuration
public class MetricsConfig {

    // Cache Metrics
    private Counter cacheHitCounter;
    private Counter cacheMissCounter;
    private Timer cacheLookupTimer;

    // API Metrics
    private Counter appointmentCreatedCounter;
    private Counter appointmentCancelledCounter;
    private Timer appointmentFetchTimer;

    // Database Metrics
    private Counter userAuthAttempts;
    private Timer userQueryTimer;

    public MetricsConfig(MeterRegistry meterRegistry) {
        // ===== CACHE METRICS =====
        this.cacheHitCounter = Counter.builder("cache.hits")
                .description("Total number of cache hits")
                .register(meterRegistry);

        this.cacheMissCounter = Counter.builder("cache.misses")
                .description("Total number of cache misses")
                .register(meterRegistry);

        this.cacheLookupTimer = Timer.builder("cache.lookup.time")
                .description("Time taken to lookup in cache")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(meterRegistry);

        // ===== BUSINESS METRICS =====
        this.appointmentCreatedCounter = Counter.builder("appointments.created")
                .description("Total appointments created")
                .register(meterRegistry);

        this.appointmentCancelledCounter = Counter.builder("appointments.cancelled")
                .description("Total appointments cancelled")
                .register(meterRegistry);

        this.appointmentFetchTimer = Timer.builder("appointments.fetch.time")
                .description("Time to fetch appointments (optimized with JOIN FETCH)")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(meterRegistry);

        // ===== SECURITY METRICS =====
        this.userAuthAttempts = Counter.builder("auth.attempts")
                .description("Total authentication attempts")
                .register(meterRegistry);

        this.userQueryTimer = Timer.builder("user.query.time")
                .description("User query execution time (with caching)")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(meterRegistry);
    }

    // ===== GETTER METHODS FOR USE IN OTHER CLASSES =====
    public Counter getCacheHitCounter() { return cacheHitCounter; }
    public Counter getCacheMissCounter() { return cacheMissCounter; }
    public Timer getCacheLookupTimer() { return cacheLookupTimer; }

    public Counter getAppointmentCreatedCounter() { return appointmentCreatedCounter; }
    public Counter getAppointmentCancelledCounter() { return appointmentCancelledCounter; }
    public Timer getAppointmentFetchTimer() { return appointmentFetchTimer; }

    public Counter getUserAuthAttempts() { return userAuthAttempts; }
    public Timer getUserQueryTimer() { return userQueryTimer; }
}
