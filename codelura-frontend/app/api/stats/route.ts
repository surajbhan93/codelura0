// app/api/stats/route.ts
import { NextResponse } from 'next/server';

interface StatsData {
  developers: number;
  resources: number;
  sessions: number;
  websites: number;
}

// Cache stats in memory with TTL
let cachedStats: StatsData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

export async function GET() {
  try {
    // Check cache
    if (cachedStats && Date.now() - cacheTimestamp < CACHE_TTL) {
      return NextResponse.json(cachedStats);
    }

    // In production, fetch from database or external API
    const stats = {
      developers: 10000,
      resources: 500,
      sessions: 350,
      websites: 200,
    };

    // Update cache
    cachedStats = stats;
    cacheTimestamp = Date.now();

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}