'use client';

import { useEffect, useState } from 'react';
import type { WatchlistItem } from '@/lib/types';

interface WatchlistSidebarProps {
  onSelect?: (symbol: string) => void;
}

export default function WatchlistSidebar({ onSelect }: WatchlistSidebarProps) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch('/api/watchlist');
        const json = await response.json();

        if (!json.success) {
          throw new Error(json.error || 'Failed to fetch watchlist');
        }

        const payload = json.data;
        const data = payload?.data?.result || payload?.data || [];
        setWatchlist(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setError(err instanceof Error ? err.message : 'Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '1rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Watchlist</h3>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Watchlist</h3>
        <div style={{ color: 'var(--accent-warning)', fontSize: '0.875rem' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.875rem' }}>
        Watchlist ({watchlist.length})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {watchlist.map((item, index) => {
          const percentValue = parseFloat(item.percent) || 0;
          const isPositive = percentValue >= 0;
          
          return (
            <div 
              key={item.company_id || index} 
              className="watchlist-item"
              onClick={() => onSelect?.(item.symbol || item.company_code)}
            >
              <div style={{ fontWeight: 600 }}>{item.symbol || item.company_code}</div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {item.last_price?.toLocaleString() || '-'}
                </span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: isPositive ? 'var(--accent-success)' : 'var(--accent-warning)',
                  minWidth: '50px',
                  textAlign: 'right'
                }}>
                  {isPositive ? '+' : ''}{percentValue.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
