import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'accent':
        return 'btn-accent';
      case 'ghost':
        return 'btn-ghost';
      default:
        return 'btn-primary';
    }
  };

  return (
    <button 
      className={`${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
