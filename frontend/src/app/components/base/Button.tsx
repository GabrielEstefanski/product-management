'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'alert';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: LucideIcon | React.ReactNode;
  rightIcon?: LucideIcon | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  primary: {
    base: 'bg-blue-600 text-white border border-blue-600',
    hover: 'hover:bg-blue-700 hover:border-blue-700',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    disabled: 'disabled:bg-blue-300 disabled:border-blue-300 disabled:cursor-not-allowed',
    loading: 'bg-blue-500 border-blue-500',
  },
  secondary: {
    base: 'bg-gray-100 text-gray-900 border border-gray-300',
    hover: 'hover:bg-gray-200 hover:border-gray-400',
    focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    disabled: 'disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed',
    loading: 'bg-gray-50 border-gray-200',
  },
  ghost: {
    base: 'bg-transparent text-gray-700 border border-transparent',
    hover: 'hover:bg-gray-100 hover:border-gray-200',
    focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    disabled: 'disabled:text-gray-400 disabled:cursor-not-allowed',
    loading: 'text-gray-400',
  },
  alert: {
    base: 'bg-red-600 text-white border border-red-600',
    hover: 'hover:bg-red-700 hover:border-red-700',
    focus: 'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    disabled: 'disabled:bg-red-300 disabled:border-red-300 disabled:cursor-not-allowed',
    loading: 'bg-red-500 border-red-500',
  },
};

const sizeStyles = {
  sm: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-1.5',
  },
  md: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-2',
  },
  lg: {
    padding: 'px-6 py-3',
    text: 'text-base',
    icon: 'w-5 h-5',
    gap: 'gap-2.5',
  },
};

const LoadingSpinner: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const spinnerSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${spinnerSize}`} />
  );
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const styles = variantStyles[variant];
  const sizeConfig = sizeStyles[size];
  
  const baseClasses = [
    'relative inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 overflow-hidden cursor-pointer',
    'focus:outline-none focus:ring-offset-2',
    'active:scale-95',
    'disabled:transform-none disabled:cursor-not-allowed',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.gap,
    styles.base,
    styles.hover,
    styles.focus,
    styles.disabled,
    loading && styles.loading,
    className,
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;

  return (
    <button
      className={baseClasses}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size={size} />
          <span>Carregando...</span>
        </>
      ) : (
        <>
          {LeftIcon && (
            <div className={`flex items-center ${sizeConfig.icon}`}>
              {typeof LeftIcon === 'function' ? <LeftIcon /> : LeftIcon}
            </div>
          )}
          <span>{children}</span>
          {RightIcon && (
            <div className={`flex items-center ${sizeConfig.icon}`}>
              {typeof RightIcon === 'function' ? <RightIcon /> : RightIcon}
            </div>
          )}
        </>
      )}
    </button>
  );
};

export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);

export const AlertButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="alert" {...props} />
);
