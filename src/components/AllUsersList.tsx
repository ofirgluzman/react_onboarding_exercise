import { useImperativeHandle, useRef } from 'react';
import type { User } from '../types';
import styles from './AllUsersList.module.css';
import sharedStyles from '../styles/shared.module.css';
import type { AllUsersSrollableContent } from './AllUsersScrollableContent';

interface AllUsersListProps {
  users: User[];
  onDetailsClick: (userId: string) => void;
  scrollRef: React.Ref<AllUsersSrollableContent>;
}

const AllUsersList: React.FC<AllUsersListProps> = ({ 
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
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.headerRow}`}>
          <div className={`${styles.cell} ${styles.headerCell} ${styles.nameCell}`}>Name</div>
          <div className={`${styles.cell} ${styles.headerCell} ${styles.emailCell}`}>Email</div>
          <div className={`${styles.cell} ${styles.headerCell} ${styles.ageCell}`}>Age</div>
          <div className={`${styles.cell} ${styles.headerCell} ${styles.locationCell}`}>Location</div>
        </div>
        
        {users.map((user) => (
          <div 
            key={user.id}
            id={getUserElementId(user.id)}
            className={`${styles.row} ${styles.contentRow}`}
            onClick={() => onDetailsClick(user.id)}
          >
            <div className={`${styles.cell} ${styles.contentCell} ${styles.nameCell}`}>
              <div className={styles.avatar}>
                <img 
                  src={user.image} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className={styles.avatarImage}
                />
              </div>
              <span className={`${styles.name} ${sharedStyles.smallBodyText}`}>
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className={`${styles.cell} ${styles.contentCell} ${styles.emailCell} ${sharedStyles.mediumBodyText}`}>
              {user.email}
            </div>
            <div className={`${styles.cell} ${styles.contentCell} ${styles.ageCell} ${sharedStyles.smallBodyText}`}>
              {user.age}
            </div>
            <div className={`${styles.cell} ${styles.contentCell} ${styles.locationCell} ${sharedStyles.smallBodyText}`}>
              {user.address.city}, {user.address.stateCode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getUserElementId(userId: string): string {
  return `all-users-list-user-${userId}`;
}

export default AllUsersList;
