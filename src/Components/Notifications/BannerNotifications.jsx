/*
 * Copyright (C) 2022 Indoc Research
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';
import {
  SettingOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import styles from './index.module.scss';
import { formatDate } from '../../Utility';

const BannerNotifications = ({
  data,
  openModal,
  closeNotificationPerm,
  closeNotificationSession,
}) => {
  return (
    <ul className={styles['banner-notifications']}>
      {data.slice(0, 5).map((notification) => {
        const { id, type, detail } = notification;
        return (
          <li
            key={id}
            data-id={id}
            className={styles['banner-notifications__item']}
          >
            <div
              className={
                styles['banner-notifications__content'] +
                ' banner-notifications__content'
              }
            >
              <div className={styles['banner-notifications__type']}>
                <SettingOutlined
                  style={{
                    marginRight: '8px',
                    transform: 'translateY(-1px)',
                  }}
                />
                <p>{`Upcoming ${type}`}</p>
              </div>
              <p
                className={styles['banner-notifications__time']}
              >{`${formatDate(detail.maintenanceDate)} - Estimated Duration: ${
                detail.duration
              } ${detail.durationUnit}`}</p>
              <div
                className={styles['banner-notifications__info']}
                onClick={() => openModal(id, data)}
              >
                <InfoCircleOutlined style={{ marginRight: '8px' }} />
                <span>More Info</span>
              </div>
            </div>
            <div
              className={
                styles['banner-notifications__close'] +
                ' banner-notifications__close'
              }
            >
              <span onClick={() => closeNotificationPerm(id)}>
                Don't show again
              </span>
              <Button
                icon={<CloseOutlined style={{ marginRight: 0 }} />}
                size="small"
                onClick={() => closeNotificationSession(id)}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BannerNotifications;
