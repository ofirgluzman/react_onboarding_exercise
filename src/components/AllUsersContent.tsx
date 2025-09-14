import { useRef, useImperativeHandle, forwardRef } from 'react';
import AllUsersGrid, { type AllUsersGridRef } from './AllUsersGrid';
import AllUsersList, { type AllUsersListRef }  from './AllUsersList';
import type { User, ContentMode } from '../types';

interface AllUsersContentProps {
  users: User[];
  currentContentMode: ContentMode;
  onDetailsClick?: (user: User) => void;
}

export interface AllUsersContentRef {
  scrollToUser: (userId: string) => void;
}

const AllUsersContent = forwardRef<AllUsersContentRef, AllUsersContentProps>(({
  users,
  currentContentMode,
  onDetailsClick
}, ref) => {
  const gridRef = useRef<AllUsersGridRef>(null);
  const listRef = useRef<AllUsersListRef>(null);

  useImperativeHandle(ref, () => ({
    scrollToUser: (userId: string) => {
      switch (currentContentMode) {
        case 'grid':
          gridRef.current?.scrollToUser(userId);
          break;
        case 'list':
          listRef.current?.scrollToUser(userId);
          break;
      }
    }
  }));

  switch (currentContentMode) {
    case 'grid':
      return (
        <AllUsersGrid 
          ref={gridRef}
          users={users}
          onDetailsClick={onDetailsClick}
        />
      );
    case 'list':
      return (
        <AllUsersList 
          ref={listRef}
          users={users}
          onDetailsClick={onDetailsClick}
        />
      );
    default:
      return null;
  }
});

AllUsersContent.displayName = 'AllUsersContent';

export default AllUsersContent;
