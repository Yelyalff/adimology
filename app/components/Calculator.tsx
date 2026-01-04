'use client';

import { useState, useEffect } from 'react';
import InputForm from './InputForm';
import BrokerCard from './BrokerCard';
import ResultTable from './ResultTable';
import TargetCard from './TargetCard';
import type { StockInput, StockAnalysisResult } from '@/lib/types';

interface CalculatorProps {
  selectedStock?: string | null;
}

export default function Calculator({ selectedStock }: CalculatorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StockAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset result and error when a new stock is selected from sidebar
  useEffect(() => {
    if (selectedStock) {
      setResult(null);
      setError(null);
    }
  }, [selectedStock]);

  const handleSubmit = async (data: StockInput) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error || 'Failed to analyze stock');
      }

      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1>📈 Stock Target Calculator</h1>
        <p className="text-secondary" style={{ fontSize: '1.125rem' }}>
          Analyze stock targets based on broker data from Stockbit
        </p>
      </div>

      <InputForm onSubmit={handleSubmit} loading={loading} initialEmiten={selectedStock} />

      {loading && (
        <div className="text-center mt-4">
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p className="text-secondary mt-2">Fetching data from Stockbit...</p>
        </div>
      )}

      {error && (
        <div className="glass-card mt-4" style={{ 
          background: 'rgba(245, 87, 108, 0.1)',
          borderColor: 'var(--accent-warning)'
        }}>
          <h3>❌ Error</h3>
          <p style={{ color: 'var(--accent-warning)' }}>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <BrokerCard data={result.stockbitData} />
          
          <div style={{ marginTop: '1.5rem' }}>
            <ResultTable 
              marketData={result.marketData} 
              calculated={result.calculated} 
            />
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <TargetCard
              currentPrice={result.marketData.harga}
              targetRealistis={result.calculated.targetRealistis1}
              targetMax={result.calculated.targetMax}
            />
          </div>
        </div>
      )}
    </div>
  );
}
