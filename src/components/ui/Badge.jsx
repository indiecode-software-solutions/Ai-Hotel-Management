import React from 'react';

export const Badge = ({ 
  children, 
  status = 'default', 
  className = '', 
  ...props 
}) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'success':
      case 'confirmed':
        return 'badge-success';
      case 'warning':
      case 'pending':
        return 'badge-warning';
      case 'danger':
      case 'cancelled':
        return 'badge-danger';
      case 'ai':
      case 'accent':
        return 'badge-ai';
      case 'primary':
      case 'active':
        return 'badge-primary';
      default:
        return 'badge-default';
    }
  };

  return (
    <span 
      className={`status-badge ${getBadgeClass()} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
