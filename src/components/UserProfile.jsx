// src/components/UserProfile.jsx
import { useEffect, useState } from 'react';
import { userAPI } from '../api/userAPI';

export default function UserProfile({ user }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userAPI.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="profile">
      {profile && (
        <>
          <img src={profile.photo_url} alt="Profile" />
          <h2>{profile.username}</h2>
          <p>{profile.email}</p>
          <p>{profile.phone_number}</p>
        </>
      )}
    </div>
  );
}