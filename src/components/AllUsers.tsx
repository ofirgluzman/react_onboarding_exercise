import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AllUsersHeader from './AllUsersHeader';
import AllUsersContent, { type AllUsersContentRef } from './AllUsersContent';
import { filterUsersByName } from '../utils';
import { useUsers } from '../hooks';
import type { User, ContentMode } from '../types';

const AllUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentContentMode, setCurrentContentMode] = useState<ContentMode>('grid');
  const navigate = useNavigate();
  const location = useLocation();
  const usersResult  = useUsers();
  const isLoading = usersResult.type === 'loading';
  const usersContentRef = useRef<AllUsersContentRef>(null);
  
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
        usersContentRef.current?.scrollToUser(state.fromUserId!);
      }, 200);
    });
  }, [location.state, isLoading]);

  const handleDetailsClick = (user: User) => {
    navigate(`/user/${user.id}`);
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
      
      {isLoading ? (
        <div className="loading-state">Loading users...</div>
        ) : filteredUsers.length > 0 ? (
          <AllUsersContent 
            ref={usersContentRef}
            users={filteredUsers}
            currentContentMode={currentContentMode}
            onDetailsClick={handleDetailsClick}
          />
        ) : (
        <div className="no-results">
          {searchTerm ? `No users found matching "${searchTerm}"` : 'No users found'}
        </div>
      )}
    </>
  );
};

export default AllUsers;
