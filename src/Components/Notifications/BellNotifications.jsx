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
import React from 'react';
import { SettingOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { formatDate } from '../../Utility';

const BellNotifications = ({ data, handleClick }) => {
  return data && data.length ? (
    <ul className={styles.notification_container}>
      {data.map((notification) => {
        const { id, type, detail } = notification;
        return (
          <li
            className={styles['bell-item']}
            onClick={() => handleClick(id, data)}
          >
            <div className={styles['bell-item__type']}>
              <SettingOutlined
                style={{ marginRight: '8px', transform: 'translateY(-1px)' }}
              />
              <p>{`Upcoming ${type}`}</p>
            </div>
            <p>{`${formatDate(detail.maintenanceDate)} - Estimated Duration: ${
              detail.duration
            } ${detail.durationUnit}`}</p>
          </li>
        );
      })}
    </ul>
  ) : null;
};

export default BellNotifications;
