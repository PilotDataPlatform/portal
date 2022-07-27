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
import React, { useState, Component, useEffect } from 'react';
import { Menu, message, Badge } from 'antd';
import {
  TeamOutlined,
  SettingOutlined,
  LoadingOutlined,
  SearchOutlined,
  PullRequestOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import GreenRoomUploader from './GreenRoomUploader';
import { connect } from 'react-redux';
import _ from 'lodash';
import style from './index.module.scss';
import { useCurrentProject } from '../../../Utility';
import AnnouncementButton from './AnnouncementButton';
import RequestAccessModal from './requestAccessModal';
import {
  getResourceRequestsAPI,
  getWorkbenchInfo,
  listAllCopyRequests,
} from '../../../APIs';
import { useTranslation } from 'react-i18next';
import variables from '../../../Themes/base.scss';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const DashboardSelected = () => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17 16"
      width="16"
    >
      <rect
        id="Rectangle_262"
        fill={variables.primaryColor1}
        data-name="Rectangle 262"
        width="5"
        height="7"
        rx="1"
      />
      <rect
        id="Rectangle_263"
        data-name="Rectangle 263"
        fill={variables.primaryColor1}
        x="11"
        y="9"
        width="6"
        height="7"
        rx="1"
      />
      <rect
        id="Rectangle_264"
        data-name="Rectangle 264"
        fill={variables.primaryColor1}
        x="7"
        width="10"
        height="7"
        rx="1"
      />
      <rect
        id="Rectangle_265"
        data-name="Rectangle 265"
        fill={variables.primaryColor1}
        y="9"
        width="9"
        height="7"
        rx="1"
      />
    </svg>
  );
};

const ToolBar = ({
  location: { pathname },
  match: { params },
  containersPermission,
  role,
  project,
  username,
}) => {
  const { t } = useTranslation(['errormessages', 'success']);
  const [isShown, toggleModal] = useState(false);
  const [showRequestToCoreRedDot, setShowRequestToCoreRedDot] = useState(false);
  const iconSelected = pathname ? pathname.split('/')[3] : null;
  const [showRequestModal, toggleRequestModal] = useState(false);
  const [requestItem, setRequestItem] = useState('');
  const [requests, setRequests] = useState(null);
  const [superSetActive, setSuperSetActive] = useState(true);
  const [guacamoleActive, setGuacamoleActive] = useState(true);
  const [guacamoleDeployed, setGuacamoleDeployed] = useState('');
  const [supersetDeployed, setSupersetDeployed] = useState('');
  const [jupyterhubDeployed, setJupyterhubDeployed] = useState('');
  const [lowerIcon, setLowerIcon] = useState('');
  const adminPermission =
    role === 'admin' ||
    _.some(containersPermission, (item) => {
      return item.code === params.projectCode && item.permission === 'admin';
    });
  const collaboratorPermission = _.some(containersPermission, (item) => {
    return (
      item.code === params.projectCode && item.permission === 'collaborator'
    );
  });
  let [currentProject] = useCurrentProject();
  const projectCode = currentProject?.code;

  const getWorkbenchInformation = async () => {
    try {
      const res = await getWorkbenchInfo(currentProject?.globalEntityId);
      const workbenchKeys = Object.keys(res.data.result);
      if (workbenchKeys.length > 0) {
        if (workbenchKeys.includes('guacamole')) {
          setGuacamoleDeployed(true);
        } else {
          setGuacamoleDeployed(false);
        }
        if (workbenchKeys.includes('superset')) {
          setSupersetDeployed(true);
        } else {
          setSupersetDeployed(false);
        }
        if (workbenchKeys.includes('jupyterhub')) {
          setJupyterhubDeployed(true);
        } else {
          setJupyterhubDeployed(false);
        }
      } else {
        setGuacamoleDeployed(false);
        setSupersetDeployed(false);
        setJupyterhubDeployed(false);
      }
    } catch (error) {
      message.error(t('errormessages:projectWorkench.getWorkbench.default.0'));
    }
  };

  useEffect(() => {
    if (currentProject?.permission !== 'contributor') getWorkbenchInformation();
  }, [project.workbenchDeployedCounter]);

  useEffect(() => {
    const getResourceRequests = async () => {
      const res = await getResourceRequestsAPI({});
      const { result } = res.data;
      if (result && result.length > 0) {
        setRequests(result);
        const superSetRequests = result.filter(
          (el) => el.requestFor === 'SuperSet',
        );
        const guacamoleRequests = result.filter(
          (el) => el.requestFor === 'Guacamole',
        );
        if (superSetRequests.length > 0) {
          if (currentProject) {
            const currentProjectRequest = superSetRequests.filter(
              (el) => el.projectGeid === currentProject.globalEntityId,
            );
            if (currentProjectRequest.length === 0) {
              // set true if this project doesn't have superSet request
              setSuperSetActive(true);
            } else if (currentProjectRequest.length > 0) {
              setSuperSetActive(currentProjectRequest[0].active);
            }
          }
        }
        if (guacamoleRequests.length > 0) {
          if (currentProject) {
            const currentProjectRequest = guacamoleRequests.filter(
              (el) => el.projectGeid === currentProject.globalEntityId,
            );
            if (currentProjectRequest.length === 0) {
              //set true if this project doesn't have Guacamole request
              setGuacamoleActive(true);
            }
            if (currentProjectRequest.length > 0) {
              setGuacamoleActive(currentProjectRequest[0].active);
            }
          }
        }
      }
    };

    const requestToCorePendingCheck = async () => {
      const res = await listAllCopyRequests(projectCode, 'pending', 0, 10);
      if (res.data.result.length) {
        const requestToCoreTimeRecord = new Date(
          localStorage.getItem('requestToCoreTimeRecord'),
        );
        const latestRequestToCoreTime = new Date(
          res.data.result[0].submittedAt,
        );
        if (latestRequestToCoreTime > requestToCoreTimeRecord) {
          setShowRequestToCoreRedDot(true);
        }
      }
    };

    getResourceRequests();
    requestToCorePendingCheck();
  }, [params.projectCode]);

  const superSet = (
    platFormRole,
    projectRole,
    supersetDeployed,
    superSetActive,
  ) => {
    if (projectRole === 'contributor') {
      return null;
    }
    if (supersetDeployed === true) {
      if (platFormRole === 'admin' || superSetActive === false) {
        return (
          <Menu.Item
            key="superset"
            onClick={(e) => {
              setLowerIcon(e);
            }}
          >
            <a
              href={`/bi/${currentProject?.code}/superset/welcome`}
              //rel="noopener noreferrer"
              // eslint-disable-next-line
              target="_blank"
            >
              <span role="img" className="anticon">
                <img
                  className={style['superset-img']}
                  src={require('../../../Images/SuperSet.svg')}
                />
              </span>
              <span>Superset</span>
            </a>
          </Menu.Item>
        );
      } else {
        return (
          <Menu.Item
            key="superset"
            onClick={(e) => {
              setRequestItem('Superset');
              toggleRequestModal(true);
              setLowerIcon(e);
            }}
          >
            <span role="img" className="anticon">
              <img
                className={style['superset-img']}
                src={require('../../../Images/SuperSet.svg')}
              />
            </span>
            <span>Superset</span>
          </Menu.Item>
        );
      }
    } else if (supersetDeployed === false) {
      return (
        <Menu.Item
          key="superset"
          onClick={() => {
            message.info('This project does not have superset configured yet.');
          }}
        >
          <span role="img" className="anticon">
            <img
              className={style['superset-img']}
              src={require('../../../Images/SuperSet.svg')}
            />
          </span>
          <span>Superset</span>
        </Menu.Item>
      );
    } else {
      return null;
    }
  };

  const guacamole = (
    platFormRole,
    projectRole,
    guacamoleDeployed,
    guacamoleActive,
  ) => {
    if (projectRole === 'contributor') {
      return null;
    }
    if (guacamoleDeployed === true) {
      if (platFormRole === 'admin' || guacamoleActive === false) {
        return (
          <Menu.Item
            key="guacamole"
            onClick={(e) => {
              setLowerIcon(e);
            }}
          >
            <a
              href={`/workbench/${currentProject?.code}/guacamole/`}
              //rel="noopener noreferrer"
              // eslint-disable-next-line
              target="_blank"
            >
              <span role="img" className="anticon">
                <img
                  className={style['guacamole-img']}
                  src={require('../../../Images/Guacamole.svg')}
                />
              </span>
              <span>Guacamole</span>
            </a>
          </Menu.Item>
        );
      } else {
        return (
          <Menu.Item
            key="guacamole"
            onClick={(e) => {
              setRequestItem('Guacamole');
              toggleRequestModal(true);
              setLowerIcon(e);
            }}
          >
            <span role="img" className="anticon">
              <img
                className={style['guacamole-img']}
                src={require('../../../Images/Guacamole.svg')}
              />
            </span>
            <span>Guacamole</span>
          </Menu.Item>
        );
      }
    } else if (guacamoleDeployed === false) {
      return (
        <Menu.Item
          key="guacamole"
          onClick={() => {
            message.info(
              'This project does not have Guacamole configured yet.',
            );
          }}
        >
          <span role="img" className="anticon">
            <img
              className={style['guacamole-img']}
              src={require('../../../Images/Guacamole.svg')}
            />
          </span>
          <span>Guacamole</span>
        </Menu.Item>
      );
    } else {
      return null;
    }
  };

  const jupyterhub = (projectRole, jupyterhubDeployed) => {
    if (projectRole === 'contributor') {
      return null;
    }
    if (jupyterhubDeployed === true) {
      return (
        <Menu.Item
          key="jupyter"
          onClick={(e) => {
            setLowerIcon(e);
          }}
        >
          <a
            href={`/workbench/${currentProject?.code}/j/`}
            //rel="noopener noreferrer"
            // eslint-disable-next-line
            target="_blank"
          >
            <span role="img" className="anticon">
              <img
                className={style['jupyter-img']}
                src={require('../../../Images/Jupyter.svg')}
              />
            </span>
            <span>Jupyterhub</span>
          </a>
        </Menu.Item>
      );
    } else if (jupyterhubDeployed === false) {
      return (
        <Menu.Item
          key="jupyter"
          onClick={() => {
            message.info(
              'This project does not have Jupyterhub configured yet.',
            );
          }}
        >
          <span role="img" className="anticon">
            <img
              className={style['jupyter-img']}
              src={require('../../../Images/Jupyter.svg')}
            />
          </span>
          <span>Jupyterhub</span>
        </Menu.Item>
      );
    } else {
      return null;
    }
  };

  const handleRequestToCoreOnClick = () => {
    setShowRequestToCoreRedDot(false);
  };

  return (
    <>
      <Menu
        id="side-bar"
        mode="inline"
        selectedKeys={[pathname.split('/')[3]]}
        className={style.upperMenu}
      >
        <div
          className={
            iconSelected === 'canvas'
              ? style['menu-spacing--after-selected']
              : style['no-radius']
          }
        ></div>
        <Menu.Item key="canvas" style={{ position: 'relative' }}>
          <Link to="canvas">
            {iconSelected === 'canvas' ? (
              <span role="img" className="anticon">
                <DashboardSelected
                  style={{
                    marginLeft: -17,
                  }}
                />
              </span>
            ) : (
              <span role="img" className="anticon">
                <img
                  style={{ width: 17, marginLeft: -17 }}
                  src={require('../../../Images/Dashboard.svg')}
                />
              </span>
            )}
            <span>Canvas</span>
          </Link>
        </Menu.Item>
        <div
          className={
            iconSelected === 'data' ? style['space--prev-selected'] : ''
          }
        ></div>
        <div
          className={
            iconSelected === 'canvas'
              ? style['menu-spacing--prev-selected']
              : iconSelected === 'data'
              ? style['menu-spacing--after-selected']
              : style['no-radius']
          }
        ></div>
        <div
          className={
            iconSelected === 'canvas'
              ? style['space--prev-selected']
              : iconSelected === 'data'
              ? ''
              : style['space--after-selected']
          }
        ></div>
        <Menu.Item key="data">
          <Link to="data">
            <CompassOutlined />
            <span>File Explorer</span>
          </Link>
        </Menu.Item>
        <div
          className={
            iconSelected === 'search' ? style['space--prev-selected'] : ''
          }
        ></div>
        <div
          className={
            iconSelected === 'data'
              ? style['menu-spacing--prev-selected']
              : iconSelected === 'search'
              ? style['menu-spacing--after-selected']
              : style['no-radius']
          }
        ></div>
        <div
          className={
            iconSelected === 'data'
              ? style['space--prev-selected']
              : iconSelected === 'search'
              ? ''
              : style['space--after-selected']
          }
        ></div>
        <div className={iconSelected === 'data' ? style['space'] : ''}></div>
        <Menu.Item key="search">
          <Link to="search">
            <SearchOutlined />
            <span>Search</span>
          </Link>
        </Menu.Item>
        <div
          className={
            iconSelected === 'announcement' ? style['space--prev-selected'] : ''
          }
        ></div>

        <div
          className={
            iconSelected === 'search'
              ? style['menu-spacing--prev-selected']
              : iconSelected === 'announcement'
              ? style['menu-spacing--after-selected']
              : style['no-radius']
          }
        ></div>
        <div
          className={
            iconSelected === 'search'
              ? style['space--prev-selected']
              : iconSelected === 'announcement'
              ? ''
              : style['space--after-selected']
          }
        ></div>

        <Menu.Item title={null} key="announcement">
          <AnnouncementButton currentProject={currentProject} />
        </Menu.Item>
        <div
          className={
            iconSelected === 'teams' ? style['space--prev-selected'] : ''
          }
        ></div>
        <div
          className={
            iconSelected === 'announcement'
              ? style['menu-spacing--prev-selected']
              : iconSelected === 'teams'
              ? style['menu-spacing--after-selected']
              : style['no-radius']
          }
        ></div>
        <div
          className={
            iconSelected === 'announcement'
              ? style['space--prev-selected']
              : iconSelected === 'teams'
              ? ''
              : style['space--after-selected']
          }
        ></div>

        {adminPermission && (
          <Menu.Item key="teams">
            <Link to="teams">
              <TeamOutlined />
              <span>Members</span>
            </Link>
          </Menu.Item>
        )}
        {adminPermission && (
          <div
            className={
              iconSelected === 'settings' ? style['space--prev-selected'] : ''
            }
          ></div>
        )}
        {adminPermission && (
          <div
            className={
              iconSelected === 'teams'
                ? style['menu-spacing--prev-selected']
                : iconSelected === 'settings'
                ? style['menu-spacing--after-selected']
                : style['no-radius']
            }
          ></div>
        )}
        {adminPermission && (
          <div
            className={
              iconSelected === 'teams'
                ? style['space--prev-selected']
                : iconSelected === 'settings'
                ? ''
                : style['space--after-selected']
            }
          ></div>
        )}

        {adminPermission && (
          <Menu.Item key="settings">
            <Link to="settings">
              <SettingOutlined />
              <span>Settings</span>
            </Link>
          </Menu.Item>
        )}
        {adminPermission && (
          <div
            className={
              iconSelected === 'requestToCore'
                ? style['space--prev-selected']
                : ''
            }
          ></div>
        )}
        {adminPermission && (
          <div
            className={
              iconSelected === 'settings'
                ? style['menu-spacing--prev-selected']
                : iconSelected === 'requestToCore'
                ? style['menu-spacing--after-selected']
                : style['no-radius']
            }
          ></div>
        )}
        {adminPermission && (
          <div
            className={
              iconSelected === 'settings'
                ? style['space--prev-selected']
                : iconSelected === 'requestToCore'
                ? ''
                : style['space--after-selected']
            }
          ></div>
        )}
        {(adminPermission || collaboratorPermission) && (
          <Menu.Item key="requestToCore" onClick={handleRequestToCoreOnClick}>
            <Link to="requestToCore">
              <PullRequestOutlined />
              <span>Requests</span>
            </Link>
          </Menu.Item>
        )}
        {adminPermission && (
          <div className={style['menu-spacing']}>
            <div className={style.temp}></div>
            <div
              className={
                iconSelected === 'requestToCore' || iconSelected === ''
                  ? style['radius']
                  : style['radius-bottom']
              }
            ></div>
          </div>
        )}
        {(adminPermission || collaboratorPermission) && (
          <>
            {showRequestToCoreRedDot && (
              <Menu.Item
                key="request-dot"
                style={{
                  marginTop: -30,
                  width: 10,
                  height: 10,
                  marginLeft: 31,
                  marginBottom: 35,
                  pointerEvents: 'none',
                }}
              >
                <Badge className={style.badge} status={'error'}>
                  {' '}
                </Badge>
              </Menu.Item>
            )}
          </>
        )}
        {(adminPermission || collaboratorPermission) && (
          <div
            className={
              iconSelected === 'requestToCore'
                ? style['menu-spacing--prev-selected']
                : style['no-radius']
            }
          ></div>
        )}
      </Menu>

      <Menu
        mode="inline"
        className={style.lowerMenu}
        selectedKeys={[pathname.split('/')[3]]}
      >
        {superSet(
          role,
          currentProject?.permission,
          supersetDeployed,
          superSetActive,
        )}

        {/* <div>
          <div className={style.temp}></div>
          <div
            className={
              lowerIcon === 'superset'
                ? style['radius']
                : style['radius-bottom']
            }
          ></div>
        </div> */}

        {guacamole(
          role,
          currentProject?.permission,
          guacamoleDeployed,
          guacamoleActive,
        )}

        {/* <div>
          <div className={style.temp}></div>
          <div
            className={
              lowerIcon === 'guacamole'
                ? style['radius']
                : style['radius-bottom']
            }
          ></div>
        </div> */}

        {jupyterhub(currentProject?.permission, jupyterhubDeployed)}

        {/* <div>
          <div className={style.temp}></div>
          <div
            className={
              lowerIcon === 'jupyter' ? style['radius'] : style['radius-bottom']
            }
          ></div>
        </div> */}

        <Menu.Item key="xwiki" onClick={(e) => setLowerIcon(e)}>
          <a
            href={`/xwiki/wiki/${currentProject?.code}/view/Main/`}
            //rel="noopener noreferrer"
            // eslint-disable-next-line
            target="_blank"
          >
            <span role="img" className="anticon">
              <img
                className={style['xwiki-img']}
                src={require('../../../Images/XWIKI.svg')}
              />
            </span>
            <span>XWiki</span>
          </a>
        </Menu.Item>
        {/* <div>
          <div className={style.temp}></div>
          <div
            className={
              lowerIcon === 'xwiki' ? style['radius'] : style['radius-bottom']
            }
          ></div>
        </div> */}
      </Menu>
      <GreenRoomUploader
        isShown={isShown}
        cancel={() => {
          toggleModal(false);
        }}
      />
      <RequestAccessModal
        showRequestModal={showRequestModal}
        requestItem={requestItem}
        toggleRequestModal={toggleRequestModal}
        username={username && username}
        projectGeid={project && project.profile && project.profile.id}
      />
    </>
  );
};

export default connect((state) => ({
  containersPermission: state.containersPermission,
  role: state.role,
  project: state.project,
  username: state.username,
}))(withRouter(ToolBar));
