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
import { Spin, Button } from 'antd';
import { UndoOutlined } from '@ant-design/icons';

import BaseCard from './BaseCard';
import MemberProfile from '../ListItems/MemberProfile';
import ResetPasswordModal from '../../../../Components/Modals/ResetPasswordModal';
import styles from '../../index.module.scss';

const MemberProfileCard = ({
  userProfile,
  showAccountStatus = false,
  showPasswordReset = false,
  layout = 'horizontal',
  title = 'Member Profile',
}) => {
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const resetPasswordButton = (
    <Button
      type="link"
      onClick={() => {
        setShowResetPasswordModal({ modalVisible: true });
      }}
    >
      <UndoOutlined />
      <span>Reset Password</span>
    </Button>
  );
  const accountStatus = () => {
    const userStatus =
      userProfile.attributes?.status === 'active' ? 'active' : 'disabled';
    return (
      <span className={styles[`member__account-status--${userStatus}`]}>
        Account Status: <span>{userProfile.attributes?.status}</span>
      </span>
    );
  };
  const extraButton = showAccountStatus
    ? accountStatus()
    : showPasswordReset
    ? resetPasswordButton
    : null;

  useEffect(() => {
    if (userProfile.username) {
      setIsLoading(false);
    }
  }, [userProfile]);

  return (
    <BaseCard
      title={title}
      className={styles['user-profile__card--member']}
      extra={extraButton}
    >
      <Spin spinning={isLoading}>
        <MemberProfile user={userProfile} layout={layout} />
      </Spin>
      <ResetPasswordModal
        visible={showResetPasswordModal}
        handleCancel={() => setShowResetPasswordModal(false)}
      />
    </BaseCard>
  );
};

export default MemberProfileCard;
