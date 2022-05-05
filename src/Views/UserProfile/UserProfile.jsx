import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';

import styles from './index.module.scss';
import StandardLayout from '../../Components/Layout/StandardLayout';
import MemberProfileCard from './Components/Cards/MemberProfileCard';
import ProjectMemberCard from './Components/Cards/ProjectMemberCard';
import RecentActivitiesCard from './Components/Cards/RecentActivitiesCard';
import { getUserProfileAPI } from '../../APIs';

const UserProfile = () => {
  const { username, role } = useSelector((state) => state);
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const profileResponse = await getUserProfileAPI(username);
        setUserProfile(profileResponse.data.result);
      } catch {
        message.error('Something went wrong while retrieving user profile');
      }
    };
    getUserProfile();
  }, []);
  return (
    <StandardLayout>
      <div className={styles['user-profile']}>
        <div className={styles['user-profile__container']}>
          <div className={styles['user-profile__container-left']}>
            <MemberProfileCard
              userProfile={userProfile}
              showPasswordReset={true}
            />
            <ProjectMemberCard username={username} role={role} />
          </div>
          <div className={styles['user-profile__container-right']}>
            <RecentActivitiesCard userId={userProfile.id} />
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default UserProfile;
