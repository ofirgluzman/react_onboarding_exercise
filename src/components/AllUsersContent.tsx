import React from 'react';
import AllUsersGrid from './AllUsersGrid';
import AllUsersList  from './AllUsersList';
import type { AllUsersSrollableContent } from './AllUsersScrollableContent';
import type { User, ContentMode } from '../types';


interface AllUsersContentProps {
  users: User[];
  currentContentMode: ContentMode;
  onDetailsClick?: (userId: string) => void;
  scrollRef: React.Ref<AllUsersSrollableContent>;
}

const AllUsersContent: React.FC<AllUsersContentProps> = ({ 
  users,
  currentContentMode,
  onDetailsClick,
  scrollRef
}) => {
  switch (currentContentMode) {
    case 'grid':
      return (
        <AllUsersGrid
          users={users}
          onDetailsClick={onDetailsClick}
          scrollRef={scrollRef}
        />
      );
    case 'list':
      return (
        <AllUsersList
          users={users}
          onDetailsClick={onDetailsClick}
          scrollRef={scrollRef}
        />
      );
    default:
      return null;
  }
};

export default AllUsersContent;
