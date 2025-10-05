import React from 'react';
import GridViewSvg from './grid-view.svg?react';

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
    <GridViewSvg 
      className={className} 
      width={width} 
      height={height}
    />
  );
};

export default GridViewIcon;
