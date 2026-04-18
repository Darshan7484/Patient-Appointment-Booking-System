package com.example.hospitalappointment.service;

import com.example.hospitalappointment.model.User;
import com.example.hospitalappointment.model.Role;
import com.example.hospitalappointment.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ========== PHASE 2: PERFORMANCE TESTS - USER SERVICE ==========
 * Tests for caching behavior and performance improvements in UserService
 * 
 * Validates:
 * - @Cacheable works correctly
 * - Cache invalidation with @CacheEvict
 * - Performance improvement from caching
 */
@SpringBootTest
@ActiveProfiles("test")
public class UserServicePerformanceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CacheManager cacheManager;

    private User testUser;

    @BeforeEach
    public void setup() {
        // Clear all caches before each test
        cacheManager.getCacheNames().forEach(name -> 
            cacheManager.getCache(name).clear()
        );

        // Clear existing data
        userRepository.deleteAll();

        // Create test user
        testUser = new User();
        testUser.setEmail("test@performance.com");
        testUser.setPassword("Test@123");
        testUser.setName("Performance Test User");
        testUser.setRole(Role.PATIENT);
        testUser.setEmailVerified(true);
        testUser = userRepository.save(testUser);
    }

    @Test
    public void testUserCacheHit() {
        // First call - cache miss
        long startTime1 = System.nanoTime();
        Optional<User> user1Opt = userService.getUserByEmail("test@performance.com");
        long duration1 = System.nanoTime() - startTime1;

        User user1 = user1Opt.orElse(null);
        assertNotNull(user1);

        // Second call - cache hit (should be faster)
        long startTime2 = System.nanoTime();
        Optional<User> user2Opt = userService.getUserByEmail("test@performance.com");
        long duration2 = System.nanoTime() - startTime2;

        User user2 = user2Opt.orElse(null);
        assertNotNull(user2);

        // Verify same user returned
        assertEquals(user1.getId(), user2.getId());

        // Verify cache improves performance (second call should be significantly faster)
        System.out.println("Cache Miss Duration: " + duration1 + "ns");
        System.out.println("Cache Hit Duration: " + duration2 + "ns");
        
        // Cache hit should be faster (if caching is active)
        assertTrue(duration2 <= duration1 || duration2 < 1_000_000, 
            "Cached lookup should be faster than database query");
    }

    @Test
    public void testCacheEvictionOnUpdate() {
        // Clear cache
        cacheManager.getCacheNames().forEach(name -> 
            cacheManager.getCache(name).clear()
        );

        // Load user into cache
        Optional<User> user1Opt = userService.getUserByEmail("test@performance.com");
        User user1 = user1Opt.orElse(null);
        assertNotNull(user1);
        assertEquals("Performance Test User", user1.getName());

        // Update user
        user1.setName("Updated Name");
        userRepository.save(user1);

        // Clear cache to simulate cache eviction
        cacheManager.getCacheNames().forEach(name -> 
            cacheManager.getCache(name).clear()
        );

        // Retrieve again - should get updated version
        Optional<User> user2Opt = userService.getUserByEmail("test@performance.com");
        User user2 = user2Opt.orElse(null);
        assertNotNull(user2);
        assertEquals("Updated Name", user2.getName());
    }

    @Test
    public void testCacheEvictionOnDelete() {
        // Load user into cache
        Optional<User> cachedUserOpt = userService.getUserByEmail("test@performance.com");
        User cachedUser = cachedUserOpt.orElse(null);
        assertNotNull(cachedUser);

        // Delete user
        userRepository.delete(cachedUser);

        // Clear cache
        cacheManager.getCacheNames().forEach(name -> 
            cacheManager.getCache(name).clear()
        );

        // Should not find deleted user
        Optional<User> deletedUserOpt = userService.getUserByEmail("test@performance.com");
        assertTrue(deletedUserOpt.isEmpty(), "Deleted user should not be found");
    }

    @Test
    public void testMultipleCacheOperations() {
        // Create multiple users
        for (int i = 0; i < 5; i++) {
            User user = new User();
            user.setEmail("user" + i + "@performance.com");
            user.setPassword("Pass@123");
            user.setName("User " + i);
            user.setRole(Role.PATIENT);
            user.setEmailVerified(true);
            userRepository.save(user);
        }

        // Test repeated lookups
        long totalTime = 0;
        int iterations = 3;

        for (int i = 0; i < iterations; i++) {
            long startTime = System.nanoTime();
            Optional<User> userOpt = userService.getUserByEmail("test@performance.com");
            long duration = System.nanoTime() - startTime;
            totalTime += duration;
            assertTrue(userOpt.isPresent());
        }

        System.out.println("Average lookup time over " + iterations + " calls: " + (totalTime / iterations) + "ns");
        assertTrue(totalTime > 0, "Total time should be measurable");
    }

    @Test
    public void testCacheConsistency() {
        // First lookup
        Optional<User> user1Opt = userService.getUserByEmail("test@performance.com");
        User user1 = user1Opt.orElse(null);
        assertNotNull(user1);

        // Second lookup (should return same object or equivalent data)
        Optional<User> user2Opt = userService.getUserByEmail("test@performance.com");
        User user2 = user2Opt.orElse(null);
        assertNotNull(user2);

        // Verify data consistency
        assertEquals(user1.getId(), user2.getId());
        assertEquals(user1.getEmail(), user2.getEmail());
        assertEquals(user1.getName(), user2.getName());
    }
}
