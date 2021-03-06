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
import React, { Component } from 'react';
import { Col, Row, Button, Modal, notification } from 'antd';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import styles from './index.module.scss';
import { namespace, ErrorMessager } from '../../ErrorMessages';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import variables from '../../Themes/base.scss';
import {
  AddDatasetCreator,
  setUserListCreator,
  setTagsCreator,
  setMetadatasCreator,
  setContainersPermissionCreator,
  setUserRoleCreator,
  setIsLoginCreator,
  setUsernameCreator,
} from '../../Redux/actions';
import { getDatasetsAPI, listUsersContainersPermission } from '../../APIs';
import CoookiesDrawer from './CookiesDrawer';
import { login as keycloakLogin } from '../../Utility';
import { tokenManager } from '../../Service/tokenManager';
import { BRANDING_PREFIX, PLATFORM } from '../../config';
import { xwikis } from '../../externalLinks';
const { detect } = require('detect-browser');
const browser = detect();
const isSafari = browser?.name === 'safari';
const { confirm } = Modal;

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookiesDrawer: false,
      notificationKey: null,
      btnLoading: false,
    };
  }
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  componentDidMount() {
    this.setTermsOfUse();
  }

  componentWillUnmount() {
    const key = this.state.notificationKey;
    notification.close(key);
  }

  setTermsOfUse = () => {
    const cookiesNotified = localStorage.getItem('cookies_notified');

    if (!cookiesNotified) {
      const closeNotification = () => {
        notification.close(key);
        localStorage.setItem('cookies_notified', true);
      };
      const key = `open${Date.now()}`;
      this.setState({ notificationKey: key });
      const btn = (
        <Button type="primary" size="small" onClick={closeNotification}>
          OK
        </Button>
      );

      notification.open({
        message: 'Cookies on this site',
        description: (
          <>
            <p>
              We use cookies to make your experience better by keeping your
              session information and login status. By using the {PLATFORM} you
              accept our use of cookies in accordance with our{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={xwikis.privacyPolicy}
              >
                Privacy Policy
              </a>
            </p>
          </>
        ),
        key,
        btn,
        duration: 0,
        onClose: closeNotification,
      });
    }
  };

  onFinish = async (values) => {
    try {
      await new Promise((resolve, reject) => {
        const { uploadList, allCookies } = this.props;
        const uploadingList = uploadList.filter(
          (item) => item.status === 'uploading',
        );
        if (
          uploadingList.length === 0 ||
          allCookies.username === values.username
        ) {
          resolve();
          return;
        }
        confirm({
          title: `Are you sure to log in as ${values.username}?`,
          icon: <ExclamationCircleOutlined />,
          content: `The file uploading is still in progress in another tab. Progress will be lost if you login as ${values.username}`,
          onOk() {
            resolve();
          },
          onCancel() {
            reject();
          },
        });
      });
    } catch (err) {
      return;
    }

    this.setState({ btnLoading: true });

    keycloakLogin().catch((err) => {
      if (err.response) {
        const errorMessager = new ErrorMessager(namespace.login.auth);
        errorMessager.triggerMsg(err.response.status);
        this.setState({ btnLoading: false });
      }
    });
  };

  initApis = async (username) => {
    getDatasetsAPI({})
      .then((res) => {
        this.props.AddDatasetCreator(res.data.result, 'All Use Cases');
      })
      .catch((err) => {
        const errorMessager = new ErrorMessager(namespace.common.getDataset);
        errorMessager.triggerMsg(err.response && err.response.status);
      });
    try {
      const {
        data: { result: containersPermission },
      } = await listUsersContainersPermission(username, {
        is_all: true,
        order_by: 'created_at',
        order_type: 'desc',
      });
      this.props.setUserRoleCreator(containersPermission.role);
      this.props.setContainersPermissionCreator(
        containersPermission.permission,
      );
    } catch (err) {
      const errorMessager = new ErrorMessager(
        namespace.common.listUsersContainersPermission,
      );
      errorMessager.triggerMsg(err.response && err.response.status);
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showDrawer = () => {
    this.setState({
      cookiesDrawer: true,
    });
  };
  onDrawerClose = () => {
    this.setState({
      cookiesDrawer: false,
    });
  };

  render() {
    // if (keycloak.authenticated && !tokenManager.getCookie('sessionId')) {
    //   const sourceId = uuidv4();
    //   tokenManager.setCookies({
    //     sessionId: `${keycloak?.tokenParsed.preferred_username}-${sourceId}`,
    //   });
    //   lastLoginAPI(keycloak?.tokenParsed.preferred_username);
    // }
    if (tokenManager.getCookie('sessionId')) {
      if (isSafari) {
        window.location.href = `${BRANDING_PREFIX}/landing`;
      } else {
        return <Redirect to="/landing" />;
      }
    }

    return (
      <>
        <div className={styles.bg}>
          <div className={styles.container}>
            <div className={styles.header}>
              <span className={styles['header__logo']}>
                <img src={require('../../Images/pilot-Logo-White.svg')} />
              </span>
              {/* <span className={styles['header__register']}>Self-Register</span> */}
              <span
                className={styles['header__login']}
                id="auth_login_btn"
                onClick={this.onFinish}
                loading={this.state.btnLoading}
              >
                <UserOutlined
                  style={{
                    marginRight: 13,
                    strokeWidth: '30',
                    stroke: 'white',
                  }}
                />
                Login
              </span>
            </div>
            <div className={styles['descr-banner']}>
              <div className={styles['descr-banner__img']}>
                <img src={require('../../Images/PILOT-Display-MockUp.png')} />
              </div>
              <div
                className={styles['descr-banner-right']}
                style={{ marginLeft: '12rem' }}
              >
                <img
                  className={styles['descr-banner__logo']}
                  src={require('../../Images/PilotPoweredLogo.png')}
                />
                <div className={styles['descr-banner__text']} style={{}}>
                  Data management platform that enables researchers to store,
                  find, access, analyse, and share their data.
                </div>
              </div>
            </div>
            <div className={styles['descr-dataGateway']} style={{}}>
              <div className={styles['descr-dataGateway__img']}>
                <img src={require('../../Images/Illustration.png')} />
              </div>
              <div
                className={styles['descr-dataGateway-right']}
                style={{ marginLeft: '8.7rem' }}
              >
                <div className={styles['descr-dataGateway__text']} style={{}}>
                  Data gateway that provides project and role based access
                  controls
                </div>
              </div>
            </div>
            <div>
              <div className={styles['trapezoid']}></div>
              <div className={styles['descr-trapezoid']} style={{}}>
                <div className={styles['descr-trapezoid-right']} style={{}}>
                  <div className={styles['descr-trapezoid__text']} style={{}}>
                    Data zones that support ingestion of all types of data
                    across modalities and sensitivities
                  </div>
                </div>
                <div className={styles['descr-trapezoid__img']}>
                  <img src={require('../../Images/Illustration.png')} />
                </div>
              </div>
            </div>
            <div
              className={styles['descr-workbench']}
              style={{
                alignItems: 'center',

                marginTop: '55rem',
              }}
            >
              <div className={styles['descr-workbench__img']}>
                <img src={require('../../Images/Illustration.png')} />
              </div>
              <div
                className={styles['descr-workbench-right']}
                style={{ marginLeft: '11.56rem' }}
              >
                <div className={styles['descr-workbench__text']} style={{}}>
                  A workbench that provides access to analysis and visualization
                  tools
                </div>
              </div>
            </div>
            <div>
              <div className={styles['trapezoid-rotation']}></div>
              <div className={styles['doc']}>
                <span className={styles['doc__title']}>Documentation</span>
                <div className={styles['doc-content']}>
                  <div className={styles['doc-content__img']}>
                    <img src={require('../../Images/GitHub-Logo-White.png')} />
                  </div>
                  <span className={styles['doc-content__text']}>
                    A collaborative, version-controlled code repository with
                    shared documents and code.
                  </span>
                  <a
                    target="_blank"
                    href="https://github.com/PilotDataPlatform"
                  >
                    <span className={styles['doc-content__btn']}>
                      <img
                        style={{ width: 14, marginRight: 17 }}
                        src={require('../../Images/LearnMore.png')}
                      />
                      Learn more
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.footer}>
              <span className={styles['footer-logo']}>
                <a target="_blank" href="https://www.indocresearch.org/">
                  <img src={require('../../Images/PilotPoweredLogo.png')} />
                </a>
              </span>

              <div className={styles['footer-links']}>
                <span className={styles['footer-links__text']}>
                  Documentation
                </span>

                <span className={styles['footer-links__text']}>
                  <a
                    target="_blank"
                    href="https://github.com/PilotDataPlatform"
                  >
                    PILOT GitHub{' '}
                  </a>
                </span>

                <span className={styles['footer-links__text']}>Support</span>
                <span className={styles['footer-links__text']}>
                  Terms of Use
                </span>
              </div>
              <div className={styles['footer-right']}>
                <span
                  className={styles['footer-right__login']}
                  onClick={this.onFinish}
                  loading={this.state.btnLoading}
                >
                  <UserOutlined style={{ marginRight: 13 }} />
                  Login
                </span>
                <span className={styles['footer-right__version']}>
                  V 1.0.0 Copyright ??2022, PILOT. All rights reserved
                </span>
              </div>
            </div>
          </div>

          <div className={styles['bg-icon']}>
            <img src={require('../../Images/Pilot-icon.png')} width={150} />
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(
  withCookies(
    connect((state) => ({ uploadList: state.uploadList }), {
      AddDatasetCreator,
      setUserListCreator,
      setTagsCreator,
      setMetadatasCreator,
      setContainersPermissionCreator,
      setUserRoleCreator,
      setIsLoginCreator,
      setUsernameCreator,
    })(Auth),
  ),
);
