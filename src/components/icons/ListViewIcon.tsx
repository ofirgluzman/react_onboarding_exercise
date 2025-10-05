import React from 'react';
import ListViewSvg from './list-view.svg?react';

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
    <ListViewSvg 
      className={className} 
      width={width} 
      height={height}
    />
  );
};

export default ListViewIcon;
