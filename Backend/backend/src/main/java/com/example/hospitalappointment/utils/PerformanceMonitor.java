package com.example.hospitalappointment.utils;

import org.springframework.stereotype.Component;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;

/**
 * Performance Monitoring Utility
 * Tracks query execution time, cache hits, and system metrics
 */
@Component
public class PerformanceMonitor {
    
    private static final ThreadLocal<Long> startTimeHolder = new ThreadLocal<>();
    private static final Map<String, Long> executionTimes = new ConcurrentHashMap<>();
    private static final Map<String, Integer> cacheHits = new ConcurrentHashMap<>();
    private static final Map<String, Integer> cacheMisses = new ConcurrentHashMap<>();
    
    /**
     * Start timing a method
     */
    public static void startTimer() {
        startTimeHolder.set(System.nanoTime());
    }
    
    /**
     * Stop timing and record execution time
     * @param operation Operation name
     * @return Execution time in milliseconds
     */
    public static long stopTimer(String operation) {
        long endTime = System.nanoTime();
        Long startTimeObj = startTimeHolder.get();
        
        if (startTimeObj == null) {
            return 0;
        }
        long startTime = startTimeObj;
        
        long executionTime = (endTime - startTime) / 1_000_000; // Convert to ms
        
        // Record execution time
        executionTimes.put(operation, executionTime);
        
        // Log slow queries (> 100ms)
        if (executionTime > 100) {
            System.out.println("⚠️ SLOW QUERY: " + operation + " took " + executionTime + "ms");
        }
        
        startTimeHolder.remove();
        return executionTime;
    }
    
    /**
     * Record cache hit
     */
    public static void recordCacheHit(String cacheKey) {
        cacheHits.merge(cacheKey, 1, Integer::sum);
    }
    
    /**
     * Record cache miss
     */
    public static void recordCacheMiss(String cacheKey) {
        cacheMisses.merge(cacheKey, 1, Integer::sum);
    }
    
    /**
     * Get cache hit ratio
     */
    public static double getCacheHitRatio(String cacheKey) {
        int hits = cacheHits.getOrDefault(cacheKey, 0);
        int misses = cacheMisses.getOrDefault(cacheKey, 0);
        int total = hits + misses;
        
        return total == 0 ? 0 : (double) hits / total * 100;
    }
    
    /**
     * Get execution time statistics
     */
    public static Map<String, Object> getPerformanceStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("timestamp", LocalDateTime.now());
        stats.put("execution_times", executionTimes);
        stats.put("cache_hits", cacheHits);
        stats.put("cache_misses", cacheMisses);
        
        // Calculate averages
        double avgExecutionTime = executionTimes.values().stream()
                .mapToLong(Long::longValue)
                .average()
                .orElse(0);
        
        stats.put("avg_execution_time_ms", avgExecutionTime);
        
        return stats;
    }
    
    /**
     * Reset statistics
     */
    public static void resetStats() {
        executionTimes.clear();
        cacheHits.clear();
        cacheMisses.clear();
    }
}
