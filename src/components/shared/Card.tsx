// ============================================================================
// saludvalpa 3.0 - CARD COMPONENT
// ============================================================================

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card = ({ children, className = '', onClick, hoverable = false }: CardProps) => {
  const baseStyles = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const hoverStyles = hoverable || onClick ? 'hover:shadow-md transition-shadow cursor-pointer' : '';
  
  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
