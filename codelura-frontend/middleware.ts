// middleware.ts - Advanced version with auth
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Protected Routes ───
const protectedRoutes = ['/dashboard', '/profile', '/settings'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // ─── Check Authentication (if you have auth) ───
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;

  // ─── Redirect authenticated users from auth pages ───
  if (isAuthenticated && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ─── Redirect unauthenticated users from protected pages ───
  if (!isAuthenticated && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ─── Cache Headers ───
  const response = NextResponse.next();

  // Static assets
  if (path.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|css|js|woff|woff2)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Blog pages
  else if (path.startsWith('/blog/')) {
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=86400');
  }
  
  // API routes
  else if (path.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  
  // Default
  else {
    response.headers.set('Cache-Control', 'public, max-age=3600');
  }

  // ─── Security Headers ───
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};