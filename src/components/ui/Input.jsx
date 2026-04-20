import React from 'react';

export const Input = ({ 
  className = '', 
  ...props 
}) => {
  return (
    <input 
      className={`custom-input ${className}`}
      {...props}
    />
  );
};

export default Input;
