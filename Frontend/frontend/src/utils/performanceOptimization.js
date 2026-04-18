/**
 * Frontend Performance Optimization Utilities
 * Provides hooks and utilities for optimizing React performance
 */

import { lazy, Suspense } from 'react';
import { memo } from 'react';

/**
 * Code Splitting Utility
 * Creates lazy-loaded components for better initial load time
 */
export const createLazyComponent = (importStatement, fallback = null) => {
  const Component = lazy(() => importStatement);
  
  return (props) => (
    <Suspense fallback={fallback || <div className="spinner-border">Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

/**
 * Memoized Component Wrapper
 * Prevents unnecessary re-renders
 */
export const OptimizedComponent = memo(({ Component, props, dependencies = [] }) => {
  return <Component {...props} />;
}, (prevProps, nextProps) => {
  // Custom comparison for deep prop checking
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});

/**
 * Debounce Hook
 * Reduces function call frequency (e.g., for search)
 */
export function useDebounce(callback, delay = 500) {
  const timeoutRef = React.useRef(null);

  const debouncedFunction = React.useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return debouncedFunction;
}

/**
 * Throttle Hook
 * Limits function call frequency (e.g., for scroll events)
 */
export function useThrottle(callback, limit = 1000) {
  const lastCallRef = React.useRef(null);
  const timeoutRef = React.useRef(null);

  return React.useCallback((...args) => {
    const now = Date.now();

    if (!lastCallRef.current) {
      lastCallRef.current = now;
      callback(...args);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (now - lastCallRef.current >= limit) {
          lastCallRef.current = now;
          callback(...args);
        }
      }, limit - (now - lastCallRef.current));
    }
  }, [callback, limit]);
}

/**
 * Lazy Loading Hook
 * Defers heavy operations until needed
 */
export function useLazyLoad(callback, options = {}) {
  const ref = React.useRef(null);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        ...options
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return ref;
}

/**
 * Image Optimization
 * Serves responsive images with proper format
 */
export const OptimizedImage = ({ src, alt, width, height, sizes }) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading="lazy"
      className={isLoading ? 'placeholder' : ''}
    />
  );
};

/**
 * Virtual List Component
 * Renders only visible items for large lists
 */
export function VirtualList({ items, itemHeight, height, renderItem }) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef(null);

  const visibleItems = React.useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = startIndex + Math.ceil(height / itemHeight);
    return items.slice(startIndex, endIndex + 1);
  }, [items, scrollTop, itemHeight, height]);

  return (
    <div
      ref={containerRef}
      style={{ height, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight }}>
        {visibleItems.map((item, index) => (
          <div key={index} style={{ height: itemHeight }}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Request Caching Hook
 * Caches API responses to avoid redundant requests
 */
export function useCachedData(key, fetchFn, ttl = 5 * 60 * 1000) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const cacheRef = React.useRef(new Map());

  React.useEffect(() => {
    const cachedData = cacheRef.current.get(key);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < ttl) {
      setData(cachedData.value);
      return;
    }

    setLoading(true);
    fetchFn()
      .then((result) => {
        setData(result);
        cacheRef.current.set(key, { value: result, timestamp: now });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [key, fetchFn, ttl]);

  return { data, loading, error };
}

/**
 * Bundle Analysis Utility
 * Shows component render time in development
 */
export function useRenderTime(componentName) {
  React.useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      console.log(`[Performance] ${componentName} rendered in ${(endTime - startTime).toFixed(2)}ms`);
    };
  }, [componentName]);
}

/**
 * Lazy Load Module
 * Dynamic imports for code splitting
 */
export async function loadModule(modulePath) {
  try {
    const module = await import(modulePath);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load module: ${modulePath}`, error);
    throw error;
  }
}
