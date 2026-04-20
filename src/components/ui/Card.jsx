import React from 'react';

export const Card = ({ 
  children, 
  variant = 'glass', 
  className = '', 
  ...props 
}) => {
  const getVariantStyles = () => {
    if (variant === 'glass') {
      return 'glass-card';
    }
    // Solid variant
    return 'solid-card';
  };

  return (
    <div 
      className={`${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
