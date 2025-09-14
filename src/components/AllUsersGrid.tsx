import { useImperativeHandle, forwardRef, useRef } from 'react';
import type { User } from '../types';
import './AllUsersGrid.css';

interface AllUsersGridProps {
  users: User[];
  onDetailsClick?: (user: User) => void;
}

export interface AllUsersGridRef {
  scrollToUser: (userId: string) => void;
}

const AllUsersGrid = forwardRef<AllUsersGridRef, AllUsersGridProps>(({ 
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
    <div ref={containerRef} className="all-users-grid">
      {users.map((user) => (
        <UserGridCard 
          key={user.id} 
          user={user}
          onDetailsClick={onDetailsClick}
        />
      ))}
    </div>
  );
});

interface UserGridCardProps {
  user: User;
  onDetailsClick?: (user: User) => void;
}

const UserGridCard: React.FC<UserGridCardProps> = ({ user, onDetailsClick }) => {
  const handleDetailsClick = () => {
    if (onDetailsClick) {
      onDetailsClick(user);
    }
  };

  return (
    <div id={getUserElementId(user.id)} className="user-grid-card">
      <div className="user-grid-card__images">
        <div className="user-grid-card__image-placeholder"></div>
        <div className="user-grid-card__image-placeholder"></div>
        <div className="user-grid-card__image-placeholder"></div>
        <div className="user-grid-card__avatar-wrapper">
          <img 
            src={user.image} 
            alt={`${user.firstName} ${user.lastName}`}
            className="user-grid-card__avatar"
          />
        </div>
      </div>
      <div className="user-grid-card__content">
        <div className="user-grid-card__info">
          <div className="user-grid-card__name">
            {user.firstName} {user.lastName}
          </div>
          <div className="user-grid-card__details">
            {user.age} | {user.address.city} {user.address.stateCode}
          </div>
        </div>
        <div className="user-grid-card__email">
          {user.email}
        </div>
        <button 
          className="user-grid-card__button"
          onClick={handleDetailsClick}
        >
          Details
        </button>
      </div>
    </div>
  );
};

function getUserElementId(userId: string): string {
  return `all-users-grid-user-${userId}`;
}

AllUsersGrid.displayName = 'AllUsersGrid';

export default AllUsersGrid;
