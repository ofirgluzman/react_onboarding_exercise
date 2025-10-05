import React from 'react';
import { clsx } from 'clsx';
import { SearchIcon, GridViewIcon, ListViewIcon } from './icons';
import type { ContentMode } from '../types';
import styles from './AllUsersHeader.module.css';
import sharedStyles from '../styles/shared.module.css';

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
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <h1 className={sharedStyles.mediumTitle}>Search users</h1>
        <div className={styles.searchField}>
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Placeholder"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          <span className={styles.filterLabel}>Filter by:</span>
          <div className={styles.chips}>
            <div className={styles.chip}>
              <span>Cities</span>
            </div>
            <div className={styles.chip}>
              <span>Age</span>
            </div>
          </div>
        </div>
        
        <div className={styles.displayControl}>
          <span className={styles.resultsCount}>{resultsCount} results</span>
          <div className={styles.toggle}>
            <button 
              className={clsx(
                styles.toggleButton,
                currentContentMode === 'grid' && styles.toggleButtonActive
              )}
              onClick={() => onContentModeChange('grid')}
            >
              <GridViewIcon />
            </button>
            <button 
              className={clsx(
                styles.toggleButton,
                currentContentMode === 'list' && styles.toggleButtonActive
              )}
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
