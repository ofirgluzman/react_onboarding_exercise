import React from 'react';

interface ListViewIconProps {
  className?: string;
  width?: number;
  height?: number;
}

const ListViewIcon: React.FC<ListViewIconProps> = ({ 
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
      <rect x="3" y="6" width="18" height="2" fill="#161719"/>
      <rect x="3" y="11" width="18" height="2" fill="#161719"/>
      <rect x="3" y="16" width="18" height="2" fill="#161719"/>
    </svg>
  );
};

export default ListViewIcon;
