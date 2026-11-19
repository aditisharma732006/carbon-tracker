import React from 'react';

export const Skeleton = ({ width, height, className = '', style = {} }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        ...style,
      }}
    />
  );
};

export const DashboardSkeleton = () => {
  return (
    <div>
      <div className="metrics-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card" style={{ height: 110 }}>
            <Skeleton width="40%" height="16px" style={{ marginBottom: 12 }} />
            <Skeleton width="60%" height="28px" />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        <div className="card" style={{ height: 320 }}>
          <Skeleton width="50%" height="20px" style={{ marginBottom: 20 }} />
          <Skeleton width="100%" height="220px" />
        </div>
        <div className="card" style={{ height: 320 }}>
          <Skeleton width="50%" height="20px" style={{ marginBottom: 20 }} />
          <Skeleton width="100%" height="220px" />
        </div>
      </div>
    </div>
  );
};
