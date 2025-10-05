import React from 'react';
import SearchSvg from './search.svg?react';

interface SearchIconProps {
  className?: string;
  width?: number;
  height?: number;
}

const SearchIcon: React.FC<SearchIconProps> = ({ 
  className = "search-icon", 
  width = 16, 
  height = 16 
}) => {
  return (
    <SearchSvg 
      className={className} 
      width={width} 
      height={height}
    />
  );
};

export default SearchIcon;
