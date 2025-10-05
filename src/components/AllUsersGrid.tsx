import { useImperativeHandle, useRef } from 'react';
import type { User } from '../types';
import styles from './AllUsersGrid.module.css';
import sharedStyles from '../styles/shared.module.css';
import type { AllUsersSrollableContent } from './AllUsersScrollableContent';

interface AllUsersGridProps {
  users: User[];
  onDetailsClick: (userId: string) => void;
  scrollRef: React.Ref<AllUsersSrollableContent>;
}


const AllUsersGrid: React.FC<AllUsersGridProps> = ({ 
  users, 
  onDetailsClick,
  scrollRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(scrollRef, () => ({
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
    <div ref={containerRef} className={styles.container}>
      {users.map((user) => (
        <UserGridCard 
          key={user.id} 
          user={user}
          onDetailsClick={onDetailsClick}
        />
      ))}
    </div>
  );
};

interface UserGridCardProps {
  user: User;
  onDetailsClick: (userId: string) => void;
}

const UserGridCard: React.FC<UserGridCardProps> = ({ user, onDetailsClick }) => {
  const handleDetailsClick = () => {
    if (onDetailsClick) {
      onDetailsClick(user.id);
    }
  };

  return (
    <div id={getUserElementId(user.id)} className={styles.card}>
      <div className={styles.images}>
        <div className={styles.imagePlaceholder}></div>
        <div className={styles.imagePlaceholder}></div>
        <div className={styles.imagePlaceholder}></div>
        <div className={styles.avatarWrapper}>
          <img 
            src={user.image} 
            alt={`${user.firstName} ${user.lastName}`}
            className={styles.avatar}
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.name}>
            {user.firstName} {user.lastName}
          </div>
          <div className={styles.details}>
            {user.age} | {user.address.city} {user.address.stateCode}
          </div>
        </div>
        <div className={`${styles.email} ${sharedStyles.mediumBodyText}`}>
          {user.email}
        </div>
        <button 
          className={styles.button}
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

export default AllUsersGrid;
