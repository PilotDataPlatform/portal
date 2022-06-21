import React, { Component } from 'react';
import { Col, Row, Button, Modal, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import styles from './index.module.scss';
import { namespace, ErrorMessager } from '../../ErrorMessages';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
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
          <Row>
            <Col className={styles['landing-container']}>
              <img
                src={require('../../Images/pilot-Logo-White.svg')}
                width={150}
              />
              <div className={styles['landing__description']}>
                <p>
                  Pilot is a data management platform that enables researchers
                  to store, find, access, analyse, and share their data,
                  including sensitive data, thus reducing barriers to biomedical
                  research and innovation.
                </p>
                <div className={styles['landing__list']}>
                  <p>Features:</p>
                  <ul>
                    <li>
                      A data gatway that provides project- and role-based access
                      controls
                    </li>
                    <li>
                      Data zones that support ingestion of all types of data
                      across modalities and sensitivities
                    </li>
                    <li>
                      A workbench that provides access to analysis and
                      visualization tools
                    </li>
                  </ul>
                </div>
              </div>
              <Button
                id="auth_login_btn"
                type="primary"
                htmlType="submit"
                className={styles['landing__login-button']}
                onClick={this.onFinish}
                loading={this.state.btnLoading}
              >
                Login
              </Button>
            </Col>
          </Row>
          <div className={styles.utils}>
            <CoookiesDrawer
              onDrawerClose={this.onDrawerClose}
              cookiesDrawer={this.state.cookiesDrawer}
            />
          </div>
          <small className={styles.copyright}>
            &copy; Copyright Indoc Research 2022
          </small>
          <div className={styles['bg-icon']}>
            <img
              alt="pilot background icon"
              src={require('../../Images/Pilot-icon-Background.svg')}
            />
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
