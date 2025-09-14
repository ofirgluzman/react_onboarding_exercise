import React from 'react';

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
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 16 16" 
      fill="none"
    >
      <path 
        d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" 
        stroke="#A3A6AC" 
        strokeWidth="1.33333" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M14 14L11.1 11.1" 
        stroke="#A3A6AC" 
        strokeWidth="1.33333" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchIcon;
