package com.example.hospitalappointment.config;

import com.example.hospitalappointment.interceptors.PerformanceInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC Configuration
 * Registers interceptors and configures web layer performance
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    private final PerformanceInterceptor performanceInterceptor;
    
    public WebMvcConfig(PerformanceInterceptor performanceInterceptor) {
        this.performanceInterceptor = performanceInterceptor;
    }
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(performanceInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                    "/actuator/**",
                    "/static/**",
                    "/assets/**",
                    "/favicon.ico"
                );
    }
}
