import React from 'react';
import { useMediaQuery } from 'react-responsive';
import './ProfileCard.css';

interface ProfileCardProps {
  name: string;
  imageUrl: string;
  description: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, imageUrl, description }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="profile-card">
      {isMobile ? (
        // Layout cho mobile (dọc)
        <div className="profile-card-mobile">
          <img src={imageUrl} alt={name} className="profile-image" />
          <div className="profile-content">
            <h2 className="profile-name">{name}</h2>
            <p className="profile-description">{description}</p>
          </div>
        </div>
      ) : (
        // Layout cho desktop (ngang)
        <div className="profile-card-desktop">
          <img src={imageUrl} alt={name} className="profile-image" />
          <div className="profile-content">
            <h2 className="profile-name">{name}</h2>
            <p className="profile-description">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Cách sử dụng component
const App: React.FC = () => {
  return (
    <ProfileCard
      name="John Doe"
      imageUrl="https://via.placeholder.com/150"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    />
  );
};

export default ProfileCard;