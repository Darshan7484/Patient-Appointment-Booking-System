package com.example.hospitalappointment.interceptors;

import com.example.hospitalappointment.utils.PerformanceMonitor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * Performance Tracking Interceptor
 * Monitors and logs API request/response performance
 */
@Component
public class PerformanceInterceptor implements HandlerInterceptor {
    
    private static final String START_TIME = "startTime";
    private static final String START_NANOS = "startNanos";
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(START_TIME, System.currentTimeMillis());
        request.setAttribute(START_NANOS, System.nanoTime());
        PerformanceMonitor.startTimer();
        return true;
    }
    
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                          ModelAndView modelAndView) {
        // This method can be used for additional processing
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
                               Exception ex) {
        long startTime = (long) request.getAttribute(START_TIME);
        long duration = System.currentTimeMillis() - startTime;
        
        String method = request.getMethod();
        String uri = request.getRequestURI();
        int status = response.getStatus();
        
        // Log slow requests (> 200ms)
        if (duration > 200) {
            System.out.println(String.format(
                "⚠️ SLOW REQUEST: %s %s - Status: %d - Time: %dms",
                method, uri, status, duration
            ));
        } else if (duration > 100) {
            System.out.println(String.format(
                "⏱️ REQUEST: %s %s - Status: %d - Time: %dms",
                method, uri, status, duration
            ));
        }
        
        // Track in performance monitor
        PerformanceMonitor.stopTimer(method + " " + uri);
        
        // Log exception if any
        if (ex != null) {
            System.err.println("❌ ERROR in " + method + " " + uri + ": " + ex.getMessage());
        }
    }
}
