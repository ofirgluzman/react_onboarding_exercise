import React from 'react';

interface GridViewIconProps {
  className?: string;
  width?: number;
  height?: number;
}

const GridViewIcon: React.FC<GridViewIconProps> = ({ 
  className, 
  width = 24, 
  height = 24 
}) => {
  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none"
    >
      <rect x="3" y="3" width="7" height="7" fill="#A3A6AC"/>
      <rect x="14" y="3" width="7" height="7" fill="#A3A6AC"/>
      <rect x="3" y="14" width="7" height="7" fill="#A3A6AC"/>
      <rect x="14" y="14" width="7" height="7" fill="#A3A6AC"/>
    </svg>
  );
};

export default GridViewIcon;
