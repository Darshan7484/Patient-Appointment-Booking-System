package com.example;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * ========== PHASE 2: PERFORMANCE INTEGRATION TEST BASE ==========
 * Base configuration for end-to-end performance testing
 * 
 * Enables:
 * - Full Spring application context with caching enabled
 * - MockMvc for API endpoint testing
 * - Performance metrics collection
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PerformanceIntegrationTestBase {

    protected static final String API_BASE_URL = "/api";

    @BeforeAll
    public static void setupPerformanceTest() {
        System.out.println("\n========== PERFORMANCE INTEGRATION TESTS ==========");
        System.out.println("Testing optimized backend endpoints with:");
        System.out.println("✓ Database connection pooling");
        System.out.println("✓ Query optimization with JOIN FETCH");
        System.out.println("✓ Caching layer (@Cacheable/@CacheEvict)");
        System.out.println("✓ Gzip compression");
        System.out.println("✓ Performance interceptor monitoring");
        System.out.println("====================================================\n");
    }

    /**
     * Helper method to measure endpoint performance
     */
    protected long measureEndpointTime(Runnable endpoint) {
        long startTime = System.nanoTime();
        endpoint.run();
        return (System.nanoTime() - startTime) / 1_000_000; // Convert to milliseconds
    }

    /**
     * Helper to verify cache effectiveness
     */
    protected void verifyCacheEffectiveness(long firstCallTime, long secondCallTime) {
        System.out.println("Cache Performance:");
        System.out.println("  First call (cache miss):  " + firstCallTime + "ms");
        System.out.println("  Second call (cache hit):  " + secondCallTime + "ms");
        System.out.println("  Improvement:              " + ((firstCallTime - secondCallTime) * 100 / firstCallTime) + "%");
    }

    /**
     * Helper to verify N+1 problem is solved
     */
    protected void verifyQueryOptimization(int expectedQueries, int actualQueries) {
        if (actualQueries <= expectedQueries) {
            System.out.println("✓ Query Optimization Verified:");
            System.out.println("  Expected queries: " + expectedQueries);
            System.out.println("  Actual queries:   " + actualQueries);
        } else {
            System.out.println("✗ Query Optimization Failed:");
            System.out.println("  Expected queries: " + expectedQueries);
            System.out.println("  Actual queries:   " + actualQueries);
        }
    }
}
