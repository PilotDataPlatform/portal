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
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import CreateNewNotification from './CreateNewNotification';
import NotificationDetail from './NotificationDetail';
import { notificationActions } from '../../../../../Redux/actions';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

const NotificationPanel = () => {
  const { activeNotification, createNewNotificationStatus } = useSelector(
    (state) => state.notifications,
  );
  const dispatch = useDispatch();

  const handleCreateNewNotificationClick = () => {
    dispatch(notificationActions.setCreateNewNotificationStatus(true));
    dispatch(notificationActions.setActiveNotification(null));
    dispatch(notificationActions.setEditNotification(false));
  };

  const renderNotificationContent = () => {
    if (!createNewNotificationStatus && activeNotification === null) {
      return (
        <div className={styles['notification-content']}>
          <Button
            className={styles['notification-content__btn']}
            icon={<PlusOutlined />}
            onClick={handleCreateNewNotificationClick}
          >
            Create New Notification
          </Button>
        </div>
      );
    } else if (!createNewNotificationStatus && activeNotification !== null) {
      return <NotificationDetail />;
    } else if (createNewNotificationStatus && activeNotification === null) {
      return <CreateNewNotification />;
    }
  };
  return (
    <div className={styles.notification}>{renderNotificationContent()}</div>
  );
};

export default NotificationPanel;
