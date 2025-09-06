'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  leftIcon?: LucideIcon | React.ReactNode;
  rightIcon?: LucideIcon | React.ReactNode;
  label?: string;
  error?: string;
  onChange?: (rawValue: string) => void;
  className?: string;
}

const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) {
    return 'R$ 0,00';
  }
  
  const cents = numbers.padStart(3, '0');
  const reais = cents.slice(0, -2) || '0';
  const centavos = cents.slice(-2);
  
  return `R$ ${reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
};

const getRawValue = (maskedValue: string): string => {
  return maskedValue.replace(/[R$\s.]/g, '').replace(',', '');
};

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(({
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  label,
  error,
  onChange,
  className = '',
  value: externalValue,
  ...props
}, ref) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (externalValue !== undefined) {
      const masked = formatCurrency(String(externalValue));
      setDisplayValue(masked);
    }
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const rawValue = getRawValue(inputValue);
    const maskedValue = formatCurrency(rawValue);
    
    setDisplayValue(maskedValue);
    
    if (onChange) {
      onChange(rawValue);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {typeof LeftIcon === 'function' ? <LeftIcon className="w-4 h-4" /> : LeftIcon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
            placeholder-gray-400
            focus:outline-none focus:ring-1 focus:ring-opacity-50
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${LeftIcon ? 'pl-10' : ''}
            ${RightIcon ? 'pr-10' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${isFocused ? 'border-blue-500' : ''}
          `}
          {...props}
        />
        
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {typeof RightIcon === 'function' ? <RightIcon className="w-4 h-4" /> : RightIcon}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

MaskedInput.displayName = 'MaskedInput';
