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
