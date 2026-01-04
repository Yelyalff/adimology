import { NextResponse } from 'next/server';
import { fetchWatchlist } from '@/lib/stockbit';
import type { ApiResponse } from '@/lib/types';

export async function GET() {
  try {
    const watchlistData = await fetchWatchlist();

    const result: ApiResponse = {
      success: true,
      data: watchlistData as any, // Using any here because ApiResponse data structure is currently specific to stock analysis, might need to adjust ApiResponse type later or just return direct data
    };

    // Or just return the data directly if we don't want to strictly follow ApiResponse structure for this simple endpoint
    return NextResponse.json({
      success: true,
      data: watchlistData
    });

  } catch (error) {
    console.error('Watchlist API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
