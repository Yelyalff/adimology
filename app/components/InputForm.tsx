'use client';

import { useState, useEffect } from 'react';
import type { StockInput } from '@/lib/types';

interface InputFormProps {
  onSubmit: (data: StockInput) => void;
  loading: boolean;
  initialEmiten?: string | null;
}

export default function InputForm({ onSubmit, loading, initialEmiten }: InputFormProps) {
  const [emiten, setEmiten] = useState('SOCI');
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-01-02');

  useEffect(() => {
    if (initialEmiten) {
      setEmiten(initialEmiten.toUpperCase());
    }
  }, [initialEmiten]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ emiten, fromDate, toDate });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card">
      <h3>🔍 Analyze Stock</h3>
      
      <div className="grid grid-3">
        <div className="input-group">
          <label htmlFor="emiten" className="input-label">
            Emiten
          </label>
          <input
            id="emiten"
            type="text"
            className="input-field"
            value={emiten}
            onChange={(e) => setEmiten(e.target.value.toUpperCase())}
            placeholder="SOCI"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="fromDate" className="input-label">
            From Date
          </label>
          <input
            id="fromDate"
            type="date"
            className="input-field"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="toDate" className="input-label">
            To Date
          </label>
          <input
            id="toDate"
            type="date"
            className="input-field"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ width: '100%' }}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
}
