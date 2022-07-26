/*
Copyright (C) 2022 Indoc Research

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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
