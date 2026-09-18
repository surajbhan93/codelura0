// In-Memory Cache Service for GBP Data
// Fast caching without Redis dependency - uses Node.js Map

class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map(); // Time-to-live tracking
    
    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Set cache with optional TTL (in seconds)
   */
  set(key, value, ttlSeconds = 300) {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + (ttlSeconds * 1000));
    return value;
  }

  /**
   * Get cached value
   */
  get(key) {
    const expiry = this.ttl.get(key);
    
    // Check if expired
    if (expiry && Date.now() > expiry) {
      this.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  /**
   * Check if key exists and not expired
   */
  has(key) {
    const expiry = this.ttl.get(key);
    
    if (expiry && Date.now() > expiry) {
      this.delete(key);
      return false;
    }
    
    return this.cache.has(key);
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  /**
   * Cleanup expired entries
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, expiry] of this.ttl.entries()) {
      if (now > expiry) {
        this.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`[Cache] Cleaned ${cleaned} expired entries. Cache size: ${this.cache.size}`);
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Helper: Generate cache key for GBP data
   */
  generateKey(userId, resource, identifier = '') {
    return `gbp:${userId}:${resource}${identifier ? ':' + identifier : ''}`;
  }
}

// Singleton instance
const cacheService = new CacheService();

export default cacheService;
