import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserDetails.css';
import { getAboutDescription } from '../utils';
import { useUser } from '../hooks/useUsers';

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userResult = useUser(id || '');

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
  }, [id, navigate]);

  if (!id) {
    return null;
  }

  if (userResult.type === 'loading') {
    return (
      <div className="user-details">
        <div className="loading-state">Loading user details...</div>
      </div>
    );
  }
  if (userResult.type === 'error') {
    return (
      <div className="user-details">
        <div className="error-state">Error loading user details</div>
      </div>
    );
  }

  const handleBackClick = () => {
    navigate('/', {
      state: { fromUserId: id }
    });
  };

  const handleEditClick = () => {
    navigate(`/user/${id}/edit`);
  };

  const user = userResult.data;

  return (
    <div className="user-details">
      <div className="user-details__header">
        <button 
          className="user-details__back-button"
          onClick={handleBackClick}
        >
          ← Back
        </button>
        <button 
          className="user-details__edit-button"
          onClick={handleEditClick}
        >
          Edit
        </button>
      </div>

      <div className="user-details__content">
        <div className="user-details__profile">
          <div className="user-details__avatar">
            <img 
              src={user.image} 
              alt={`${user.firstName} ${user.lastName}`}
              className="user-details__avatar-image"
            />
          </div>
          <div className="user-details__basic-info">
            <h1 className="user-details__name">
              {user.firstName} {user.lastName}
            </h1>
            <div className="user-details__age-and-location">
              <span className="user-details__age">{user.age} years old</span>
              <span className="user-details__location">
                {user.address.city}, {user.address.state}
              </span>
            </div>
          </div>
        </div>

        <div className="user-details__about">
          <h2 className="user-details__about-title">About</h2>
          <p className="user-details__about-text">
            {getAboutDescription(user)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
