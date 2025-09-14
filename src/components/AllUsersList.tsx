import { useImperativeHandle, forwardRef, useRef } from 'react';
import type { User } from '../types';
import './AllUsersList.css';

interface AllUsersListProps {
  users: User[];
  onDetailsClick?: (user: User) => void;
}

export interface AllUsersListRef {
  scrollToUser: (userId: string) => void;
}

const AllUsersList = forwardRef<AllUsersListRef, AllUsersListProps>(({ 
  users, 
  onDetailsClick 
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollToUser: (userId: string) => {
      const elementId = getUserElementId(userId);
      const userElement = containerRef.current?.querySelector(`#${elementId}`);
      if (userElement) {
        userElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }));

  return (
    <div ref={containerRef} className="all-users-list">
      <div className="all-users-list__table">
        <div className="all-users-list__base-row all-users-list__header-row">
          <div className="all-users-list__base-cell all-users-list__header-cell all-users-list__header-cell--name">Name</div>
          <div className="all-users-list__base-cell all-users-list__header-cell all-users-list__header-cell--email">Email</div>
          <div className="all-users-list__base-cell all-users-list__header-cell all-users-list__header-cell--age">Age</div>
          <div className="all-users-list__base-cell all-users-list__header-cell all-users-list__header-cell--location">Location</div>
        </div>
        
        {users.map((user) => (
          <div 
            key={user.id}
            id={getUserElementId(user.id)}
            className="all-users-list__base-row all-users-list__content-row"
            onClick={() => onDetailsClick?.(user)}
          >
            <div className="all-users-list__base-cell all-users-list__content-cell all-users-list__content-cell--name">
              <div className="all-users-list__avatar">
                <img 
                  src={user.image} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="all-users-list__avatar-image"
                />
              </div>
              <span className="all-users-list__name">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className="all-users-list__base-cell all-users-list__content-cell all-users-list__content-cell--email">
              {user.email}
            </div>
            <div className="all-users-list__base-cell all-users-list__content-cell all-users-list__content-cell--age">
              {user.age}
            </div>
            <div className="all-users-list__base-cell all-users-list__content-cell all-users-list__content-cell--location">
              {user.address.city}, {user.address.stateCode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

function getUserElementId(userId: string): string {
  return `all-users-list-user-${userId}`;
}

AllUsersList.displayName = 'AllUsersList';

export default AllUsersList;
