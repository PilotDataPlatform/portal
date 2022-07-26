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
