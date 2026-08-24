/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Image Optimization ───
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      // Add your custom domains
      {
        protocol: "https",
        hostname: "your-cdn-domain.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
    ],
    // Modern image formats for faster loading
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Disable blur-up placeholder for performance (optional)
    minimumCacheTTL: 60,
    // Allow SVG images (if needed)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ─── Experimental Features ───
  experimental: {
    // Optimize CSS loading
    // optimizeCss: truetrue,
    // Server Actions (if using)
    serverActions: {
      allowedOrigins: ['localhost:3000', 'your-domain.com'],
    },
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // ─── Compiler Options ───
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
    // React-specific optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // ─── Performance ───
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  
  // ─── Cache Headers ───
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // ─── Webpack Optimizations ───
  webpack: (config, { isServer, dev }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate vendor chunk for better caching
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Separate common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'async',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // ─── Environment Variables ───
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },

  // ─── Redirects ───
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
    ];
  },

  // ─── Rewrites (if needed) ───
  async rewrites() {
    return [];
  },

  // ─── i18n (if multi-language) ───
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};

module.exports = nextConfig;