package com.example.hospitalappointment.utils;

import org.hibernate.Session;

import org.springframework.stereotype.Component;
import java.util.*;

/**
 * Database Query Optimization Utility
 * Provides best practices for efficient database queries
 */
@Component
public class QueryOptimizer {
    
    /**
     * Batch insert entities
     * More efficient than individual inserts
     */
    public static <T> void batchInsert(Session session, List<T> entities, int batchSize) {
        for (int i = 0; i < entities.size(); i++) {
            session.persist(entities.get(i));
            
            // Flush and clear every batchSize entities
            if ((i + 1) % batchSize == 0) {
                session.flush();
                session.clear();
            }
        }
        
        // Flush remaining entities
        session.flush();
        session.clear();
    }
    
    /**
     * Batch update entities
     * More efficient than individual updates
     */
    public static <T> void batchUpdate(Session session, List<T> entities, int batchSize) {
        for (int i = 0; i < entities.size(); i++) {
            session.merge(entities.get(i));
            
            if ((i + 1) % batchSize == 0) {
                session.flush();
                session.clear();
            }
        }
        
        session.flush();
        session.clear();
    }
    
    /**
     * Batch delete entities
     * More efficient than individual deletes
     */
    public static <T> void batchDelete(Session session, List<T> entities, int batchSize) {
        for (int i = 0; i < entities.size(); i++) {
            session.remove(entities.get(i));
            
            if ((i + 1) % batchSize == 0) {
                session.flush();
                session.clear();
            }
        }
        
        session.flush();
        session.clear();
    }
}
