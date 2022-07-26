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
import { Tabs } from 'antd';
import NotificationList from './Components/NotificationList/NotificationList';
import NotificationPanel from './Components/NoticationInfo/NotificationInfoPanel';
import styles from './index.module.scss';
const Notifications = () => {
  return (
    <div className={styles.tab}>
      <Tabs defaultActiveKey="maintenance">
        <Tabs.TabPane tab="Maintenance" key="maintenance">
          <div className={styles.tab_content}>
            <div className={styles.tab_content_left_part}>
              <NotificationList />
            </div>
            <div className={styles.tab_content_right_part}>
              <NotificationPanel />
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Notifications;
