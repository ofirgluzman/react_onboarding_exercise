import React from 'react';
import { SearchIcon, GridViewIcon, ListViewIcon } from './icons';
import type { ContentMode } from '../types';
import './AllUsersHeader.css';

interface AllUsersHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultsCount: number;
  currentContentMode: ContentMode;
  onContentModeChange: (mode: ContentMode) => void;
}

const AllUsersHeader: React.FC<AllUsersHeaderProps> = ({
  searchTerm,
  onSearchChange,
  resultsCount,
  currentContentMode,
  onContentModeChange
}) => {
  return (
    <div className="all-users-header">
      <div className="all-users-header__search-container">
        <h1 className="all-users-header__search-title">Search users</h1>
        <div className="all-users-header__search-field">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Placeholder"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="all-users-header__search-field-input"
          />
        </div>
      </div>

      <div className="all-users-header__controls">
        <div className="all-users-header__filters">
          <span className="all-users-header__filter-label">Filter by:</span>
          <div className="all-users-header__filter-chips">
            <div className="all-users-header__chip">
              <span>Cities</span>
            </div>
            <div className="all-users-header__chip">
              <span>Age</span>
            </div>
          </div>
        </div>
        
        <div className="all-users-header__display-control">
          <span className="all-users-header__results-count">{resultsCount} results</span>
          <div className="all-users-header__content-mode-toggle">
            <button 
              className={`all-users-header__content-mode-toggle-button ${
                currentContentMode === 'grid' ? 'all-users-header__content-mode-toggle-button--active' : ''
              }`}
              onClick={() => onContentModeChange('grid')}
            >
              <GridViewIcon />
            </button>
            <button 
              className={`all-users-header__content-mode-toggle-button ${
                currentContentMode === 'list' ? 'all-users-header__content-mode-toggle-button--active' : ''
              }`}
              onClick={() => onContentModeChange('list')}
            >
              <ListViewIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsersHeader;
