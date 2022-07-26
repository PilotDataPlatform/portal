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
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { store } from '../Redux/store';
import _ from 'lodash';

/**
 *
 */
function useCurrentProject() {
  const { containersPermission } = useSelector((state) => state);
  const { projectCode } = useParams();
  if (!projectCode) {
    return [undefined];
  }
  const currentProject = _.find(containersPermission, (item) => {
    return item.code === projectCode;
  });
  return [currentProject];
}

/**
 * return a high order component which has the current project as the prop
 * @param {React.ClassicComponent} WrappedComponent
 * @returns {JSX.Element}
 */
function withCurrentProject(WrappedComponent) {
  return function (props) {
    const [currentProject] = useCurrentProject();
    return <WrappedComponent {...props} currentProject={currentProject} />;
  };
}

export { useCurrentProject, withCurrentProject };
