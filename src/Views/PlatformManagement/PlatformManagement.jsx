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
import React, { useState } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import UserManagement from './UserManagement';
import Notifications from './Notifications';
import AppHeader from '../../Components/Layout/Header';
import Footer from '../../Components/Layout/Footer';
import { Tabs } from 'antd';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import { StandardLayout } from '../../Components/Layout';
import styles from './PlatformManagement.module.scss';

const PlatformManagement = () => {
  const [adminView, setAdminView] = useState(true);
  return (
    <StandardLayout leftMargin={false}>
      <div
        className={styles.platform_management}
        id="platform-management-section"
      >
        {adminView ? (
          <div className={styles.tabs}>
            <Tabs
              defaultActiveKey="userManagement"
              style={{ backgroundColor: 'white' }}
            >
              <Tabs.TabPane
                tab={
                  <span>
                    <UserOutlined />
                    User Management
                  </span>
                }
                key="userManagement"
              >
                <UserManagement
                  adminView={adminView}
                  setAdminView={setAdminView}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <BellOutlined />
                    Notifications
                  </span>
                }
                key="notifications"
              >
                <Notifications />
              </Tabs.TabPane>
            </Tabs>
          </div>
        ) : (
          <Redirect to="/error/403" />
        )}
      </div>
    </StandardLayout>
  );
};

export default PlatformManagement;
