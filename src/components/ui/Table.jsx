import React from 'react';
import { MoreVertical } from 'lucide-react';

/**
 * PremiumTable Component
 * @param {Array} columns - [{ header: 'Name', key: 'name', render: (val, item) => ... }]
 * @param {Array} data - Array of objects
 */
export const Table = ({ columns, data, className = '' }) => {
  return (
    <div className={`table-container ${className}`}>
      <table className="premium-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
            <th style={{ width: '50px' }}></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
              <td>
                <button className="action-btn">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
