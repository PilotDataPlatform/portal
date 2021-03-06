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
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StandardLayout } from '../../Components/Layout';
import { message } from 'antd';
import { projectRoutes as routes } from '../../Routes/index';
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  useParams,
  useLocation,
} from 'react-router-dom';
import ToolBar from './Components/ToolBar';
import { getUserOnProjectAPI, getProjectInfoAPI } from '../../APIs';
import { connect } from 'react-redux';
import { protectedRoutes } from '../../Utility';
import roleMap from '../../Utility/project-roles.json';
import {
  triggerEvent,
  setCurrentProjectProfile,
  setCurrentProjectSystemTags,
  setFolderRouting,
  clearCurrentProject,
} from '../../Redux/actions';

import _ from 'lodash';
function Project(props) {
  const { pathname } = useLocation();
  const project = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const { params } = props.match;
  const {
    match: { path },
    containersPermission,
    role,
  } = props;
  const containerDetails =
    containersPermission &&
    _.find(containersPermission, (item) => {
      return item.code === params.projectCode;
    });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (params.projectCode && containerDetails) {
      getProjectInfoAPI(containerDetails.id).then((res) => {
        if (res.status === 200 && res.data && res.data.code === 200) {
          const currentDataset = res.data.result;
          dispatch(setCurrentProjectProfile(currentDataset));
          dispatch(
            setCurrentProjectSystemTags({
              tags: currentDataset && currentDataset.systemTags,
            }),
          );
        }
      });
    }
    dispatch(setFolderRouting({}));
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [containerDetails]);

  useEffect(() => {
    if (project.profile) {
      dispatch(triggerEvent('LOAD_COPY_LIST'));
      dispatch(triggerEvent('LOAD_DELETED_LIST'));
      dispatch(triggerEvent('LOAD_UPLOAD_LIST'));
    }
  }, [project.profile]);

  const [userListOnDataset, setUserListOnDataset] = useState(null);

  const rolesDetail = [];
  for (const key in roleMap) {
    rolesDetail.push({
      value: roleMap[key] && roleMap[key].value,
      label: roleMap[key] && roleMap[key].label,
      description: roleMap[key] && roleMap[key].description,
    });
  }

  const config = {
    observationVars: [params.projectCode, containersPermission, role],
    initFunc: () => {
      if (containersPermission !== null && role !== null) {
        const isAccess =
          role === 'admin' ||
          _.some(containersPermission, (item) => {
            return item.code === params.projectCode;
          });

        if (!isAccess) {
          message.error('No Access to the Container');
          window.setTimeout(() => {
            props.history.push('/landing');
          }, 1000);
          return;
        }
      }
    },
  };
  return (
    <StandardLayout {...config} leftContent={<ToolBar />}>
      <Switch>
        {routes.map((item) => (
          <Route
            exact={item.exact || false}
            path={path + item.path}
            key={item.path}
            render={(props) => {
              if (!params.projectCode) {
                throw new Error(`projectCode undefined`);
              }
              let res = protectedRoutes(
                item.protectedType,
                true,
                params.projectCode,
                containersPermission,
                role,
              );
              if (res === '403') {
                return <Redirect to="/error/403" />;
              } else if (res === '404') {
                return <Redirect to="/error/404" />;
              } else {
                return (
                  <item.component
                    userListOnDataset={userListOnDataset}
                    containerDetails={containerDetails}
                    getUserOnProjectAPI={getUserOnProjectAPI}
                    setUserListOnDataset={setUserListOnDataset}
                    rolesDetail={rolesDetail}
                  />
                );
              }
            }}
          ></Route>
        ))}
        <Redirect to="/error/404" />
      </Switch>
    </StandardLayout>
  );
}

export default connect((state) => ({
  containersPermission: state.containersPermission,
  role: state.role,
  datasetList: state.datasetList,
}))(withRouter(Project));
