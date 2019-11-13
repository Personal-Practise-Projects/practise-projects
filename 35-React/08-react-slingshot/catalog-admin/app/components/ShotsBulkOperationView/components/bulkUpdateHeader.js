import React from 'react';

export function BulkUpdateHeader({ title, subtitle }) {
  return (
    <div className="bulk-update-panel-header">
      <h3 className="secondary-title">{title}</h3>
      {subtitle && <span className="secondary-subtitle">{subtitle}</span>}
    </div>
  );
}
