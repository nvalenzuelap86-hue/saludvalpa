// ============================================================================
// saludvalpa 3.0 - BUTTON COMPONENT
// ============================================================================

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-saludvalpa-blue text-white hover:bg-opacity-90',
    secondary: 'bg-saludvalpa-teal text-white hover:bg-opacity-90',
    outline: 'bg-white text-saludvalpa-blue border-2 border-saludvalpa-blue hover:bg-saludvalpa-blue-light',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      {children}
    </button>
  );
};

export default Button;
