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
import React, { useEffect } from 'react';
import { Layout } from 'antd';
import AppHeader from './Header';
import Footer from './Footer';
import LeftSider from './LeftSider';
import { withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './index.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getAllNotifications } from '../../APIs';
import MaintenanceWarningModel from '../Modals/MaintenanceWarningModel';
import { notificationActions } from '../../Redux/actions';
const { Content } = Layout;
function StandardLayout(props) {
  const {
    observationVars = [],
    initFunc = () => {},
    leftContent,
    children,
    leftMargin = true,
  } = props;

  useEffect(() => {
    initFunc();
    // eslint-disable-next-line
  }, [...observationVars]);
  const { updateNotificationTimes } = useSelector(
    (state) => state.notifications,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    async function initData() {
      const res = await getAllNotifications();
      const listData = res.data?.result?.result;
      if (listData && listData.length) {
        dispatch(notificationActions.setNotificationList(listData));
      }
    }
    initData();
  }, [updateNotificationTimes]);
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(
        notificationActions.setUpdateNotificationTimes(
          (updateNotificationTimes) => updateNotificationTimes + 1,
        ),
      );
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content>
        <Layout>
          <Layout
            style={{ marginLeft: leftMargin ? '30px' : 0 }}
            className={styles.layout_wrapper}
            id="layout-wrapper"
          >
            {children}
            <Footer />
          </Layout>
          {leftContent && <LeftSider>{leftContent}</LeftSider>}
        </Layout>
      </Content>
      <MaintenanceWarningModel />
    </Layout>
  );
}

export default withRouter(connect(null, null)(StandardLayout));
