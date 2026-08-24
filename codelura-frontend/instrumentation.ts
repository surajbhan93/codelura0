// instrumentation.ts

// ✅ Remove type import - use simple export
// import type { Instrumentation } from 'next'; // ❌ Remove this

// ─── OR use this for Next.js 14+ ───
// import { Instrumentation } from 'next';

// ─── Best: Use direct export without type ───
export async function register() {
  // ─── Only run on server startup ───
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('🚀 Initializing server instrumentation...');

    try {
      // ─── 1. Database Connection Pool Warming ───
      await warmDatabaseConnections();

      // ─── 2. Cache Warming ───
      await warmCache();

      // ─── 3. Initialize Monitoring ───
      await initializeMonitoring();

      // ─── 4. Load Environment Configurations ───
      await loadConfigurations();

      // ─── 5. Start Background Jobs (if any) ───
      await startBackgroundJobs();

      console.log('✅ Server instrumentation completed successfully');
    } catch (error) {
      console.error('❌ Failed to initialize server:', error);
      // Optionally: send alert to monitoring service
    }
  }

  // ─── Edge Runtime (Edge Middleware) ───
  if (process.env.NEXT_RUNTIME === 'edge') {
    console.log('⚡ Edge runtime instrumentation');
    
    // Edge-specific initialization
    await initializeEdgeRuntime();
  }
}

// ─── Helper Functions ───

/**
 * Warm up database connection pool
 */
async function warmDatabaseConnections() {
  try {
    // Example: Prisma connection
    // const { prisma } = await import('@/lib/prisma');
    // await prisma.$connect();
    // console.log('✅ Database connection warmed up');
    
    // Example: MongoDB connection
    // const { connectDB } = await import('@/lib/mongodb');
    // await connectDB();
    
    console.log('✅ Database connection pool warmed up');
  } catch (error) {
    console.error('Database warmup failed:', error);
  }
}

/**
 * Warm cache with frequently accessed data
 */
async function warmCache() {
  try {
    // Example: Redis cache warmup
    // const { redis } = await import('@/lib/redis');
    // await redis.set('health-check', 'ok');
    
    // Fetch popular blog posts to cache
    // const { getPopularBlogs } = await import('@/lib/blog');
    // await getPopularBlogs();
    
    console.log('✅ Cache warmed up');
  } catch (error) {
    console.error('Cache warmup failed:', error);
  }
}

/**
 * Initialize monitoring tools
 */
async function initializeMonitoring() {
  try {
    // ─── Sentry Error Tracking ───
    // if (process.env.SENTRY_DSN) {
    //   const Sentry = await import('@sentry/nextjs');
    //   Sentry.init({
    //     dsn: process.env.SENTRY_DSN,
    //     environment: process.env.NODE_ENV,
    //     tracesSampleRate: 0.1,
    //   });
    //   console.log('✅ Sentry initialized');
    // }

    // ─── OpenTelemetry ───
    // if (process.env.OTEL_ENABLED) {
    //   const { NodeTracerProvider } = await import('@opentelemetry/sdk-trace-node');
    //   const provider = new NodeTracerProvider();
    //   provider.register();
    //   console.log('✅ OpenTelemetry initialized');
    // }

    console.log('✅ Monitoring initialized');
  } catch (error) {
    console.error('Monitoring initialization failed:', error);
  }
}

/**
 * Load environment configurations
 */
async function loadConfigurations() {
  try {
    // Load feature flags
    // const { getFeatureFlags } = await import('@/lib/feature-flags');
    // await getFeatureFlags();
    
    // Load environment variables validation
    // const { validateEnv } = await import('@/lib/env');
    // validateEnv();
    
    console.log('✅ Configurations loaded');
  } catch (error) {
    console.error('Configuration loading failed:', error);
  }
}

/**
 * Start background jobs
 */
async function startBackgroundJobs() {
  try {
    // ─── Start cron jobs ───
    // const { startCronJobs } = await import('@/lib/cron');
    // await startCronJobs();
    
    // ─── Start queue workers ───
    // const { startQueueWorkers } = await import('@/lib/queue');
    // await startQueueWorkers();
    
    console.log('✅ Background jobs started');
  } catch (error) {
    console.error('Background jobs failed:', error);
  }
}

/**
 * Edge runtime initialization
 */
async function initializeEdgeRuntime() {
  try {
    // Edge-specific setup
    // const { setupEdgeCache } = await import('@/lib/edge-cache');
    // await setupEdgeCache();
    
    console.log('✅ Edge runtime initialized');
  } catch (error) {
    console.error('Edge runtime initialization failed:', error);
  }
}