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
import React, { useEffect, useState, Suspense, useContext } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { authedRoutes, unAuthedRoutes } from './Routes';
import './Antd.less';
import './Portal.scss';
import { useSelector, useDispatch } from 'react-redux';
import {
  setContainersPermissionCreator,
  setUserRoleCreator,
  updateUploadItemCreator,
  updateClearIdCreator,
  setSuccessNum,
  setDonwloadClearIdCreator,
  setUploadListCreator,
  updateDownloadItemCreator,
  setDownloadListCreator,
  setUsernameCreator,
  setEmailCreator,
  setIsReleaseNoteShownCreator,
  setUserStatus,
  setTokenAutoRefresh,
} from './Redux/actions';
import {
  checkDownloadStatusAPI,
  checkUploadStatus,
  checkDownloadStatus,
  lastLoginAPI,
  listUsersContainersPermission,
  getUserstatusAPI,
  attachManifest,
} from './APIs';
import { protectedRoutes, reduxActionWrapper, keepAlive } from './Utility';
import { message, Modal, Spin, Button, notification } from 'antd';
import Promise from 'bluebird';
import _ from 'lodash';
import { UploadQueueContext } from './Context';
import { namespace, ErrorMessager } from './ErrorMessages';
import { v4 as uuidv4 } from 'uuid';
import { history } from './Routes';
import { tokenManager } from './Service/tokenManager';
import { useKeycloak } from '@react-keycloak/web';
import { version } from '../package.json';
import { tokenTimer } from './Service/keycloak';
import { Loading } from './Components/Layout/Loading';
import TermsOfUse from './Views/TermsOfUse/TermsOfUse';
import semver from 'semver';
import AccountDisabled from './Views/AccountDisabled/AccountDisabled';
import { JOB_STATUS } from './Components/Layout/FilePanel/jobStatus';
import { PORTAL_PREFIX } from './config';
import i18n from './i18n';

// router change
history.listen(() => {
  Modal.destroyAll();
});

message.config({
  maxCount: 2,
  duration: 5,
});
const [
  setContainersPermissionDispatcher,
  setUserRoleDispatcher,
  updateUploadItemDispatcher,
  updateClearIdDispatcher,
  setDonwloadClearIdDispatcher,
  setUploadListDispatcher,
  setSuccessNumDispatcher,
  setDownloadListDispatcher,
  updateDownloadItemDispatch,
  setUsernameDispatcher,
  setEmailDispatcher,
  setIsReleaseNoteShownDispatcher,
  setUserStatusDispather,
  setTokenAutoRefreshDispatcher,
] = reduxActionWrapper([
  setContainersPermissionCreator,
  setUserRoleCreator,
  updateUploadItemCreator,
  updateClearIdCreator,
  setDonwloadClearIdCreator,
  setUploadListCreator,
  setSuccessNum,
  setDownloadListCreator,
  updateDownloadItemCreator,
  setUsernameCreator,
  setEmailCreator,
  setIsReleaseNoteShownCreator,
  setUserStatus,
  setTokenAutoRefresh,
]);

function Portal(props) {
  const {
    uploadList,
    downloadList,
    clearId,
    downloadClearId,
    successNum,
    isReleaseNoteShown,
    containersPermission,
    role,
    uploadFileManifest,
    username,
    project,
    user,
  } = useSelector((state) => state);
  const userStatus = user.status;
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const q = useContext(UploadQueueContext);
  //keycloak event binding
  useEffect(() => {
    // initial logic
    async function initUser() {
      console.log('keycloak token', keycloak?.tokenParsed);
      setUsernameDispatcher(keycloak?.tokenParsed.preferred_username);
      if (keycloak?.tokenParsed.email) {
        setEmailDispatcher(keycloak?.tokenParsed.email);
      }
    }
    if (keycloak?.tokenParsed) {
      initUser();
    }
    if (userStatus === 'active') {
      initApis(keycloak?.tokenParsed.preferred_username);
    }
    // eslint-disable-next-line
  }, [userStatus]);

  //check version number
  useEffect(() => {
    const versionNumLocal = localStorage.getItem('version');
    const isLatest =
      semver.valid(versionNumLocal) && semver.eq(version, versionNumLocal);

    if (!isLatest && keycloak.authenticated) {
      const args = {
        message: (
          <>
            <img
              alt="release note"
              width={30}
              src={PORTAL_PREFIX + '/Rocket.svg'}
            ></img>{' '}
            <b>{' Release ' + version}</b>
          </>
        ), //,
        description: (
          <span
            onClick={() => {
              setIsReleaseNoteShownDispatcher(true);
              notification.close('releaseNote');
              localStorage.setItem('version', version);
            }}
            style={{ cursor: 'pointer' }}
          >
            <u style={{ marginLeft: 34 }}>
              Click here to view the release notes
            </u>
          </span>
        ),
        duration: 0,
        onClose: () => {
          localStorage.setItem('version', version);
        },
        key: 'releaseNote',
        //onClick: () => { localStorage.setItem('version', version) }
      };
      notification.open(args);
    }
  }, [keycloak.authenticated]);

  //upload list update
  useEffect(() => {
    debouncedUpdatePendingStatus(uploadList);
    setRefreshConfirmation(
      uploadList.filter((item) => item.status === 'uploading'),
    );
    // eslint-disable-next-line
  }, [uploadList]);

  //download list update
  useEffect(() => {
    const pendingDownloadList = downloadList.filter(
      (el) => el.status === 'pending',
    );
    const clearId = updateDownloadStatus(pendingDownloadList);
    setRefreshConfirmation(pendingDownloadList);
    return () => {
      clearInterval(clearId);
    };
    // eslint-disable-next-line
  }, [downloadList]);
  const initApis = async (username) => {
    try {
      const params = {
        order_by: 'created_at',
        order_type: 'desc',
        is_all: true,
      };

      const {
        data: { results: containersPermission, role },
      } = await listUsersContainersPermission(username, params);
      setUserRoleDispatcher(role);
      setContainersPermissionDispatcher(containersPermission);
      const pathname = props.location.pathname;
      const isInProject = pathname.includes('project');
      let currentProject;
      if (isInProject) {
        const pathArray = pathname.split('/');
        const currentProjectId = pathArray[pathArray.length - 2];

        currentProject =
          containersPermission &&
          containersPermission.find((el) => el.id === Number(currentProjectId));
      }

      if (currentProject) {
        const sessionId = tokenManager.getCookie('sessionId');
        const res = await checkUploadStatus(
          currentProject.code,
          '*',
          sessionId,
        );
        const { code, result } = res.data;
        const itemStatus = (status) => {
          if (status === JOB_STATUS.SUCCEED) {
            return 'success';
          } else if (status === JOB_STATUS.TERMINATED) {
            return 'error';
          } else {
            return 'uploading';
          }
        };
        if (code === 200) {
          const newUploadList = [];
          for (const item of result) {
            if (item.status === JOB_STATUS.TERMINATED) {
              newUploadList.push({
                fileName: item.source,
                status: itemStatus(item.status),
                progress: 1,
                uploadedTime: parseInt(item.updateTimestamp),
                projectCode: item.projectCode,
              });
            } else if (item.status === JOB_STATUS.SUCCEED) {
              newUploadList.push({
                fileName: item.source,
                status: itemStatus(item.status),
                progress: 1,
                uploadedTime: parseInt(item.updateTimestamp),
                projectCode: item.projectCode,
              });
            } else if (item.status === JOB_STATUS.PRE_UPLOADED) {
              const task = q.workersList()[0];
              newUploadList.push({
                fileName: item.source,
                status: itemStatus(item.status),
                progress: 1,
                uploadedTime: parseInt(item.updateTimestamp),
                projectCode: item.projectCode,
              });
            }
          }
          setUploadListDispatcher(newUploadList);
        }

        try {
          const pendingDownloadList = downloadList.filter(
            (el) => el.status === 'pending',
          );

          for (const item of pendingDownloadList) {
            await checkDownloadStatusAPI(
              item.downloadKey,
              item.hashCode,
              item.namespace,
              updateDownloadItemDispatch,
              setSuccessNumDispatcher,
              successNum,
            );
          }

          if (pendingDownloadList.length === 0) {
            const downloadRes = await checkDownloadStatus(
              sessionId,
              currentProject.code,
              username,
            );

            if (downloadRes.status === 200) {
              let newDownloadList =
                downloadRes.data &&
                downloadRes.data.result.filter(
                  (el) => !el.payload.parentFolder,
                );
              newDownloadList = newDownloadList.map((item) => {
                if (
                  item.status === JOB_STATUS.READY_FOR_DOWNLOADING ||
                  item.status === JOB_STATUS.SUCCEED
                ) {
                  item.status = 'success';
                } else if (item.status === JOB_STATUS.ZIPPING) {
                  item.status = 'pending';
                } else {
                  item.status = 'error';
                }

                const sourceArray = item.source && item.source.split('/');

                item.filename =
                  sourceArray &&
                  sourceArray.length &&
                  sourceArray[sourceArray.length - 1];

                return item;
              });
              setDownloadListDispatcher(newDownloadList);
            }
          }
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.log('no download history in current session');
          }
        }
      }
    } catch (err) {
      if (err.response) {
        const errorMessager = new ErrorMessager(
          namespace.common.listUsersContainersPermission,
        );
        errorMessager.triggerMsg(err.response.status);
      }
    }
  };

  const updateDownloadStatus = (arr) => {
    tokenManager.removeListener(downloadClearId);
    if (arr.length > 0) {
      keepAlive();
    }
    const func = () => {
      Promise.map(arr, (item, index) => {
        if (item.status === 'pending') {
          checkDownloadStatusAPI(
            item.downloadKey,
            item.hashCode,
            item.namespace,
            updateDownloadItemDispatch,
            setSuccessNumDispatcher,
            successNum,
          );
        }
      });
    };
    const newDownloadClearId = setInterval(() => {
      func();
    }, 5 * 1000);
    return newDownloadClearId;
  };

  const setRefreshConfirmation = (arr) => {
    const confirmation = function (event) {
      return window.confirm(
        'You will loss your uploading progress. Are you sure to exit?',
      );
    };
    if (arr.length > 0) {
      window.onbeforeunload = confirmation;
    } else {
      window.onbeforeunload = () => {};
    }
  };

  const updatePendingStatus = (arr) => {
    tokenTimer.removeListener(clearId);
    const pendingArr = arr.filter((item) => item.status === 'pending');
    if (pendingArr.length === 0) {
      //make sure clear all interval ids
      setTokenAutoRefreshDispatcher(false);
      return;
    } else {
      setTokenAutoRefreshDispatcher(true);
    }
    if (arr.filter((item) => item.status === 'uploading').length > 0) {
      keepAlive();
    }

    const sessionId = tokenManager.getCookie('sessionId');
    const time = 4;
    const func = () => {
      checkUploadStatus(pendingArr[0].projectCode, '*', sessionId)
        .then(async (res) => {
          const { code, result } = res.data;
          if (code === 200) {
            for (let pendingFile of pendingArr) {
              let fileName = pendingFile.fileName;
              const fileStatus = result?.find(
                (el) => el.jobId === pendingFile.jobId,
              );
              const isSuccess =
                fileStatus && fileStatus.status === JOB_STATUS.SUCCEED;
              if (isSuccess) {
                message.success(
                  `${i18n.t('success:fileUpload.0')} ${fileName} ${i18n.t(
                    'success:fileUpload.1',
                  )}`,
                );
                const manifestItem = uploadFileManifest.find((x) => {
                  const fileNameFromPath = x.files[0];
                  return fileNameFromPath.normalize() == fileName.normalize();
                });
                if (manifestItem && manifestItem.manifestId) {
                  manifestItem.geid = fileStatus.payload.sourceGeid;

                  await attachManifest(
                    pendingFile.projectCode,
                    manifestItem.manifestId,
                    [manifestItem.geid],
                    manifestItem.attributes,
                  );
                }
                pendingFile.status = 'success';
                dispatch(setSuccessNum(successNum + 1));
              }
              const isError =
                fileStatus && fileStatus.status === JOB_STATUS.TERMINATED;
              if (isError) {
                pendingFile.status = 'error';
              }
              updateUploadItemDispatcher(pendingFile);
            }
          }
        })
        .catch((err) => {
          if (err.response && parseInt(err.response.status) !== 404) {
            console.log(err.response, 'error response in checking pending');
          }
        });
    };
    const condition = (timeRemain) => {
      return timeRemain % time === 0;
    };
    const newClearId = tokenTimer.addListener({ func, condition });

    updateClearIdDispatcher(newClearId);
  };

  const debouncedUpdatePendingStatus = _.debounce(updatePendingStatus, 5000, {
    leading: true,
    trailing: true,
    maxWait: 15 * 1000,
  });

  /*   if (userStatus === null) {
    return null;
  } */
  switch (userStatus) {
    case 'pending': {
      return <TermsOfUse />;
    }
    case 'disabled': {
      return <AccountDisabled />;
    }

    default: {
      return (
        <>
          <Suspense fallback={null}>
            <Switch>
              {authedRoutes.map((item) => (
                <Route
                  path={item.path}
                  key={item.path}
                  exact={item.exact || false}
                  render={(props) => {
                    if (!keycloak.authenticated) {
                      window.location.href =
                        window.location.origin + PORTAL_PREFIX;
                      return null;
                    }
                    if (!containersPermission) {
                      return <Loading />;
                    }
                    let res = protectedRoutes(
                      item.protectedType,
                      keycloak.authenticated,
                      props.match.params.projectCode,
                      containersPermission,
                      role,
                    );
                    if (res === '403') {
                      return <Redirect to="/error/403" />;
                    } else if (res === '404') {
                      return <Redirect to="/error/404" />;
                    } else if (res) {
                      return <item.component />;
                    } else {
                      window.location.href =
                        window.location.origin + PORTAL_PREFIX;
                      return null;
                    }
                  }}
                ></Route>
              ))}
            </Switch>
          </Suspense>
        </>
      );
    }
  }
}

export default withRouter(Portal);

// trigger cicd +6
