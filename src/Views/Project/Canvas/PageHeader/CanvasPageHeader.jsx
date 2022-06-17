import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Row,
  Layout,
  PageHeader,
  Typography,
  Avatar,
  Tag,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
} from '@ant-design/icons';
import {
  setContainersPermissionCreator,
  setCurrentProjectProfile,
  setCurrentProjectSystemTags,
  triggerEvent,
} from '../../../../Redux/actions';
import { getUsersOnDatasetAPI, getAdminsOnDatasetAPI } from '../../../../APIs';
import { connect } from 'react-redux';
import {
  withCurrentProject,
  objectKeysToCamelCase,
  getTags,
} from '../../../../Utility';
import userRoles from '../../../../Utility/project-roles.json';
import styles from '../index.module.scss';
import { PLATFORM } from '../../../../config';
import '../../../../Themes/base.scss';
const { Content } = Layout;
const { Paragraph } = Typography;

class CanvasPageHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectUsersInfo: null,
      currentRole: '',
      pageHeaderExpand: false,
      userListOnDataset: null,
    };
  }

  initData = async () => {
    const currentProject = this.props.currentProject;
    if (currentProject?.permission) {
      this.loadAdmin();
      const projectRole = currentProject.permission;
      if (projectRole === 'admin') {
        await this.getProjectUsersInfo();
      }
      this.setState({
        currentRole: projectRole,
      });
    }
  };
  loadAdmin = async () => {
    try {
      const users = await getAdminsOnDatasetAPI(
        this.props.currentProject.globalEntityId,
      );
      const userList = objectKeysToCamelCase(users.data.result);
      this.setState({
        userListOnDataset: userList,
      });
    } catch (e) {
      this.setState({
        userListOnDataset: null,
      });
    }
  };

  getProjectUsersInfo = async () => {
    try {
      const usersInfo = await getUsersOnDatasetAPI(
        this.props.currentProject.globalEntityId,
      );
      if (usersInfo && usersInfo.data && usersInfo.data.result) {
        this.setState({ projectUsersInfo: usersInfo.data.result });
      }
    } catch (e) {
      this.setState({
        projectUsersInfo: null,
      });
    }
  };
  componentDidMount() {
    this.initData();
  }
  toggleExpand = () => {
    this.setState({ pageHeaderExpand: !this.state.pageHeaderExpand });
  };
  render() {
    const { currentProject } = this.props;

    const pageHeaderExpand = this.state.pageHeaderExpand;
    const projectUsersInfo = this.state.projectUsersInfo;
    const currentRole = this.state.currentRole;
    const administrators =
      projectUsersInfo &&
      projectUsersInfo.filter((el) => el.permission === 'admin');
    const contributors =
      projectUsersInfo &&
      projectUsersInfo.filter((el) => el.permission === 'contributor');
    const collaborators =
      projectUsersInfo &&
      projectUsersInfo.filter((el) => el.permission === 'collaborator');

    // userRole refers to project role
    let userRole = this.state.currentRole;

    if (userRole === 'admin') {
      // this.props.role refers to platform role
      if (this.props.role === 'admin') {
        userRole = 'Platform Administrator';
      } else {
        userRole = 'Project Administrator';
      }
    } else {
      userRole =
        userRoles && userRoles[userRole] && userRoles[userRole]['label'];
    }
    const adminsContent = (
      <div style={{ marginTop: -8 }}>
        <div
          style={{
            lineHeight: '16px',
            marginTop: 15,
            marginBottom: 10,
            whiteSpace: 'normal',
            wordBreak: 'break-all',
          }}
        >
          <span className={styles['user-font']}>Administrators</span>
          {this.state.userListOnDataset &&
            this.state.userListOnDataset.map((el, index) => (
              <a
                href={
                  'mailto:' +
                  el.email +
                  `?subject=[${PLATFORM} Platform: ${currentProject.name}]`
                }
                target="_blank"
                style={{ paddingRight: '5px' }}
                key={index}
              >
                <span
                  style={{
                    color: '#1F93FA',
                    fontSize: '12px',
                    marginRight: '20px',
                    fontWeight: 'normal',
                  }}
                >
                  {`${el.firstName} ${el.lastName}`}
                </span>
              </a>
            ))}
        </div>
      </div>
    );

    const title = (
      <div>
        {currentProject.name.length > 40 ? (
          <Tooltip title={currentProject.name}>
            <div style={{ lineHeight: '22px' }}>
              <span className={styles['curproject-name']}>
                {currentProject.name}
              </span>
            </div>
          </Tooltip>
        ) : (
          <div style={{ lineHeight: '22px' }}>
            <span className={styles['curproject-name']}>
              {currentProject.name}
            </span>
          </div>
        )}
        {this.props.variant !== 'fileExplorer' ||
        this.state.pageHeaderExpand ? (
          <div style={{ lineHeight: '14px' }}>
            <span
              style={{
                color: '#595959',
                fontSize: '12px',
                fontWeight: 'normal',
              }}
            >
              {`Project Code: ${currentProject.code} / `}
            </span>
            {userRole ? (
              <span
                style={{
                  color: '#818181',
                  fontSize: '12px',
                  fontWeight: 'lighter',
                }}
              >
                {`Your role is ${userRole}`}
              </span>
            ) : null}
          </div>
        ) : null}
        {currentRole && pageHeaderExpand ? adminsContent : null}
      </div>
    );

    const pageHeaderContent = (
      <Content>
        <Paragraph>
          <div style={{ height: 14, lineHeight: '14px', marginTop: -15 }}>
            <span
              style={{
                color: '#818181',
                fontSize: '12px',
              }}
            >
              Description
            </span>
          </div>
          {currentProject.description ? (
            <div>
              <p
                style={{
                  color: '#595959',
                  fontSize: '12px',
                  marginTop: 4,
                  lineHeight: '16px',
                  wordBreak: 'break-all',
                }}
              >
                {currentProject.description}
              </p>
            </div>
          ) : (
            <div>
              <p
                style={{
                  color: '#595959',
                  fontSize: '12px',
                  marginTop: 4,
                  lineHeight: '16px',
                }}
              >
                There is no description for this project.
              </p>
            </div>
          )}
        </Paragraph>
      </Content>
    );

    const tagsContent = (
      <div
        style={{
          width: '290px',
          flex: '0 0 290px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        {currentRole === 'admin' && pageHeaderExpand ? (
          <div
            style={{ marginTop: '2px', textAlign: 'right', marginRight: 44 }}
          >
            <div style={{ textAlign: 'right' }}>
              <UserOutlined style={{ fontSize: '18px', color: '#1C5388' }} />
            </div>
            <div style={{ height: 35, lineHeight: '35px' }}>
              <span
                style={{
                  color: '#818181',
                  fontSize: '13px',
                  verticalAlign: 'middle',
                }}
              >
                Administrators
              </span>
              <span className={styles['owner']}>
                {administrators ? administrators.length : 0}
              </span>
            </div>
            <div style={{ height: 35, lineHeight: '35px' }}>
              <span
                style={{
                  color: '#818181',
                  fontSize: '13px',
                  verticalAlign: 'middle',
                }}
              >
                Contributors
              </span>
              <span className={styles['owner']}>
                {contributors ? contributors.length : 0}
              </span>
            </div>
            <div
              style={{ height: 35, lineHeight: '35px', marginBottom: '5px' }}
            >
              <span
                style={{
                  color: '#818181',
                  fontSize: '13px',
                  verticalAlign: 'middle',
                }}
              >
                Collaborators
              </span>
              <span className={styles['owner']}>
                {collaborators ? collaborators.length : 0}
              </span>
            </div>
            <div style={{ marginTop: '1rem', marginRight: '-5px' }}>
              {currentProject.tags && getTags(currentProject.tags)}
            </div>
          </div>
        ) : (
          <div style={{ height: '53px' }}></div>
        )}
        {!pageHeaderExpand && (
          <div
            style={{
              display: 'block',
              marginRight: '44px',
              lineHeight: '35px',
              textAlign: 'right',
            }}
          >
            {currentProject.tags && getTags(currentProject.tags)}
          </div>
        )}
      </div>
    );

    const showTagsContent = (role, expand) => {
      if (currentRole !== 'admin' && expand) {
        return (
          <div>
            <div style={{ height: '50px' }}></div>
            {tagsContent}
          </div>
        );
      } else {
        return tagsContent;
      }
    };

    const avatarClass = styles['canvas-page-header__avatar'];

    const avatar = currentProject.imageUrl ? (
      <Avatar
        className={avatarClass}
        shape="circle"
        src={currentProject.imageUrl && currentProject.imageUrl}
      ></Avatar>
    ) : (
      <Avatar shape="circle" className={avatarClass}>
        <span
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {currentProject.name ? currentProject.name.charAt(0) : ''}
        </span>
      </Avatar>
    );

    return (
      <div style={{ position: 'relative' }}>
        <Row>
          <Content
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              padding: '12px 0',
              borderRadius: '9px',
              boxShadow: '0px 1px 7px #0000001A',
            }}
          >
            <div
              style={{
                width: '100%',
                paddingLeft: 18,
                display: 'flex',
                overflow: 'hidden',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    alignSelf: 'flex-start',
                    transform:
                      this.props.variant === 'fileExplorer' &&
                      !currentProject.tags?.length
                        ? 'translateY(4px)'
                        : 'translateY(6px)',
                  }}
                >
                  {avatar}
                </div>
                <div
                  style={{
                    paddingLeft: 15,
                    width: '100%',
                    flex: 1,
                    overflow: 'hidden',
                  }}
                >
                  <PageHeader
                    ghost={true}
                    style={{
                      width: '100%',
                      padding: '0px 0px 0px 0px',
                    }}
                    title={title}
                  >
                    {pageHeaderExpand && pageHeaderContent}
                  </PageHeader>
                </div>
              </div>
              {showTagsContent(currentRole, pageHeaderExpand)}
            </div>
            <div style={{ position: 'absolute', right: 10, bottom: -10 }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  zIndex: 1,
                }}
              ></div>
              {pageHeaderExpand ? (
                <UpCircleOutlined
                  onClick={this.toggleExpand}
                  className={styles['up-circle']}
                />
              ) : (
                <DownCircleOutlined
                  onClick={this.toggleExpand}
                  className={styles['down-circle']}
                />
              )}
            </div>
          </Content>
        </Row>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    role: state.role,
  }),
  {
    setCurrentProjectSystemTags,
    setCurrentProjectProfile,
    triggerEvent,
  },
)(withCurrentProject(withRouter(CanvasPageHeader)));
