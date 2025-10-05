import { useParams, useNavigate, Navigate } from 'react-router-dom';
import styles from './UserDetails.module.css';
import sharedStyles from '../styles/shared.module.css';
import { getAboutDescription } from '../utils';
import { useUser } from '../hooks/useUsers';

const UserDetails = () => {
  const { id: userId } = useParams<{ id: string }>();

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return <UserDetailsContent userId={userId} />;
};

const UserDetailsContent = ({ userId }: { userId: string }) => {
  const userResult = useUser(userId);
  const navigate = useNavigate();

  if (userResult.type === 'loading') {
    return (
      <div className={styles.container}>
        <div className="loading-state">Loading user details...</div>
      </div>
    );
  }
  if (userResult.type === 'error') {
    return (
      <div className={styles.container}>
        <div className="error-state">Error loading user details</div>
      </div>
    );
  }

  const handleBackClick = () => {
    navigate('/', {
      state: { fromUserId: userId }
    });
  };

  const handleEditClick = () => {
    navigate(`/user/${userId}/edit`);
  };

  const user = userResult.data;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={sharedStyles.secondaryButton}
          onClick={handleBackClick}
        >
          ← Back
        </button>
        <button 
          className={sharedStyles.primaryButton}
          onClick={handleEditClick}
        >
          Edit
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <img 
              src={user.image} 
              alt={`${user.firstName} ${user.lastName}`}
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.basicInfo}>
            <h1 className={sharedStyles.largeTitle}>
              {user.firstName} {user.lastName}
            </h1>
            <div className={styles.ageAndLocation}>
              <span className={styles.age}>{user.age} years old</span>
              <span className={styles.separator} aria-hidden="true">•</span>
              <span className={styles.location}>
                {user.address.city}, {user.address.state}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.about}>
          <h2 className={sharedStyles.smallTitle}>About</h2>
          <p className={styles.aboutText}>
            {getAboutDescription(user)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
