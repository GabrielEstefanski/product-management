'use client';

import React from 'react';
import { Input } from './Input';
import { Button } from './Button';

export interface PriceRangeFilterProps {
  precoMin?: number;
  precoMax?: number;
  onPrecoMinChange: (value: number) => void;
  onPrecoMaxChange: (value: number) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
  className?: string;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  precoMin = 0,
  precoMax = 0,
  onPrecoMinChange,
  onPrecoMaxChange,
  onApplyFilters,
  onClearFilters,
  loading = false,
  className = '',
}) => {
  const handlePrecoMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onPrecoMinChange(value);
  };

  const handlePrecoMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onPrecoMaxChange(value);
  };

  const hasActiveFilters = precoMin > 0 || precoMax > 0;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Preço:
        </label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Mín"
            value={precoMin > 0 ? precoMin.toString() : ''}
            onChange={handlePrecoMinChange}
            className="w-20"
            min="0"
            step="0.01"
          />
          <span className="text-gray-500">até</span>
          <Input
            type="number"
            placeholder="Máx"
            value={precoMax > 0 ? precoMax.toString() : ''}
            onChange={handlePrecoMaxChange}
            className="w-20"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          onClick={onApplyFilters}
          disabled={loading}
          size="sm"
          variant="primary"
        >
          Filtrar
        </Button>
        
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            disabled={loading}
            size="sm"
            variant="secondary"
          >
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
};
