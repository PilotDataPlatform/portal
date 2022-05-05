import React from 'react';
import { List } from 'antd';

import { mapProjectRoles } from '../../utils';

const ProjectMemberListItem = ({ project }) => {
  const { name, code, permission } = project;
  const projectDescription = (
    <>
      <p>
        <strong>Project: {code} / </strong>
        Member role is <strong>{mapProjectRoles(permission)}</strong>
      </p>
    </>
  );

  return (
    <List.Item>
      <List.Item.Meta title={name} description={projectDescription} />
    </List.Item>
  );
};

export default ProjectMemberListItem;
