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
import { getUserProfileAPI } from '../../../../APIs';
import { Modal, Layout, message } from 'antd';
import {
  timeConvert,
  partialString,
  useCurrentProject,
} from '../../../../Utility';
import MemberProfileCard from '../../../UserProfile/Components/Cards/MemberProfileCard';
import ProjectMemberCard from '../../../UserProfile/Components/Cards/ProjectMemberCard';
import RecentActivitiesCard from '../../../UserProfile/Components/Cards/RecentActivitiesCard';
import RecentActivitiesItem from '../../../UserProfile/Components/ListItems/RecentActivitiesItem';
import styles from './MemberProfileModal.module.scss';
import { useSelector } from 'react-redux';
const { Content } = Layout;
function MemberProfileModal(props) {
  console.log(props.curRecord);
  const { username, role } = useSelector((state) => state);
  const [userProfile, setUserProfile] = useState({});
  const [currentProject] = useCurrentProject();
  const hideMask = false;
  useEffect(() => {
    const getUserProfile = async () => {
      if (props.curRecord) {
        console.log('current project', currentProject.code);
        try {
          const profileResponse = await getUserProfileAPI(
            props.curRecord.name,
            currentProject.code,
          );
          setUserProfile(profileResponse.data.result);
        } catch {
          message.error('Something went wrong while retrieving user profile');
        }
      }
    };
    getUserProfile();
  }, [props.curRecord]);
  return (
    <Modal
      className={styles['profile-modal']}
      title="Member Profile"
      width={'80%'}
      footer={null}
      style={{ top: 30 }}
      visible={props.visible}
      onCancel={props.onCancel}
      getContainer={() => {
        return document.querySelector('#members-section');
      }}
      maskClosable={true}
      maskStyle={
        hideMask
          ? { display: 'none' }
          : {
              background: 'rgb(89 89 89 / 25%)',
              'backdrop-filter': 'blur(12px)',
              top: '80px',
              zIndex: 500,
            }
      }
    >
      <Content className={styles['user-profile__container']}>
        <div className={styles['user-profile__container-left']}>
          <MemberProfileCard
            userProfile={userProfile}
            layout="vertical"
            title="User Information"
          />
        </div>
        <div className={styles['user-profile__container-right']}>
          <RecentActivitiesCard
            userId={userProfile.id}
            currentProject={currentProject}
          />
        </div>
      </Content>
    </Modal>
  );
}

export default MemberProfileModal;
