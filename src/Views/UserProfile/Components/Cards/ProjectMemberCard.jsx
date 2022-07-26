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
import React, { useState, useEffect } from 'react';
import { List, Empty, message } from 'antd';

import styles from '../../index.module.scss';
import BaseCard from './BaseCard';
import ProjectMemberListItem from '../ListItems/ProjectMemberListItem';
import { listUsersContainersPermission } from '../../../../APIs';

const ProjectMemberCard = ({ username, role }) => {
  const [userProjects, setUserProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserProjects = async () => {
      try {
        const params = {
          order_by: 'created_at',
          order_type: 'desc',
          is_all: true,
        };
        const projectsResponse = await listUsersContainersPermission(
          username,
          params,
        );
        setUserProjects(projectsResponse.data.results);
      } catch {
        message.error(
          "Something went wrong while retrieving user's project membership data",
        );
      }
    };

    if (role !== 'admin') {
      getUserProjects();
    }

    setIsLoading(false);
  }, [username, role]);

  if (role === 'admin') {
    return (
      <BaseCard
        title="Project Membership"
        className={styles['user-profile__card--project']}
      >
        <div className={styles['project__admin-role']}>
          <p>Platform Administrator does not take any Project Roles</p>
        </div>
      </BaseCard>
    );
  }

  if (!isLoading && !userProjects.length) {
    return (
      <BaseCard
        title="Project Membership"
        className={styles['user-profile__card--project']}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="User is not part of any projects"
        />
      </BaseCard>
    );
  }

  return (
    <BaseCard
      title="Project Membership"
      className={styles['user-profile__card--project']}
    >
      <List
        dataSource={userProjects}
        key="user-projects"
        loading={isLoading}
        renderItem={(project) => <ProjectMemberListItem project={project} />}
        pagination={
          !isLoading && {
            total: userProjects.length,
            showSizeChanger: true,
          }
        }
      />
    </BaseCard>
  );
};

export default ProjectMemberCard;
