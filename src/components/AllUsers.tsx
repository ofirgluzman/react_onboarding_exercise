import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AllUsersContent from './AllUsersContent';
import AllUsersHeader from './AllUsersHeader';
import type { AllUsersSrollableContent } from './AllUsersScrollableContent';
import { filterUsersByName } from '../utils';
import { useUsers } from '../hooks';
import type { ContentMode } from '../types';

const AllUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentContentMode, setCurrentContentMode] = useState<ContentMode>('grid');
  const navigate = useNavigate();
  const location = useLocation();
  const usersResult  = useUsers();
  const isLoading = usersResult.type === 'loading';
  const scrollableContentRef = useRef<AllUsersSrollableContent>(null);
  
  const filteredUsers = useMemo(() => {
    if (usersResult.type !== 'success') {
      return [];
    }
    return filterUsersByName(usersResult.data, searchTerm);
  }, [usersResult, searchTerm]);

  // Scroll restoration effect
  useEffect(() => {
    const state = location.state as { fromUserId?: string } | null;
    
    if (!state?.fromUserId) return;
    if (isLoading) return;
    
    requestAnimationFrame(() => {
      setTimeout(() => { 
        scrollableContentRef.current?.scrollToUser(state.fromUserId!);
      }, 200); // Delay the srolling to avoid instant overwhelming scrolling.
    });
  }, [location.state, isLoading]);

  const handleDetailsClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  return (
    <>
      <AllUsersHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultsCount={filteredUsers.length}
        currentContentMode={currentContentMode}
        onContentModeChange={setCurrentContentMode}
      />
      {(() => {
        if (isLoading) {
          return <div className="loading-state">Loading users...</div>;
        }

        if (filteredUsers.length === 0) {
          return  (
            <div className="no-results">
              {searchTerm ? `No users found matching "${searchTerm}"` : 'No users found'}
            </div>
          );
        }

        return <AllUsersContent 
          users={filteredUsers}
          currentContentMode={currentContentMode}
          onDetailsClick={handleDetailsClick}
          scrollRef={scrollableContentRef}
        />;
      })()}
    </>
  );
};

export default AllUsers;
