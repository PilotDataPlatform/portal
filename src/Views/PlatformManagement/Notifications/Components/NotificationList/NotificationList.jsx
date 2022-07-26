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
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { notificationActions } from '../../../../../Redux/actions';
import { List } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './NotificationList.module.scss';
import { timeConvert } from '../../../../../Utility';
import moment from 'moment';

const NotificationList = () => {
  const {
    activeNotification,
    createNewNotificationStatus,
    notificationList,
    edit,
  } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const onListClick = (item) => {
    if (!edit) {
      dispatch(notificationActions.setCreateNewNotificationStatus(false));
      dispatch(notificationActions.setActiveNotification(item));
    }
  };
  const onNewNotificationClick = () => {
    dispatch(notificationActions.setCreateNewNotificationStatus(false));
    dispatch(notificationActions.setActiveNotification(null));
  };
  return (
    <div className={styles['notification-list']}>
      <div
        className={`${styles['new-notification-listItem']} ${
          createNewNotificationStatus && styles['list-item-backgroundColor']
        }`}
        onClick={onNewNotificationClick}
      >
        <PlusOutlined className={styles['new-notification-listItem__icon']} />{' '}
        Create New Notification
      </div>
      <List
        size="large"
        bordered={false}
        dataSource={notificationList}
        pagination={{
          pageSize: 10,
          simple: true,
        }}
        renderItem={(item, index) => (
          <List.Item
            className={`${
              !createNewNotificationStatus &&
              activeNotification &&
              activeNotification.id === item.id &&
              styles['list-item-backgroundColor']
            }`}
            id={item.id}
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              onListClick(item);
            }}
          >
            <div className={styles['list-content']}>
              <div className={styles['list-content__icon']}>
                <SettingOutlined />
              </div>
              <div>
                <p>{timeConvert(item.detail.maintenanceDate, 'datetime')}</p>
                <p className={styles['list-content__status']}>Published</p>
              </div>
              {new Date() > new Date(item.detail.maintenanceDate) ? (
                <div className={styles['list-content__expired']}></div>
              ) : null}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default NotificationList;
