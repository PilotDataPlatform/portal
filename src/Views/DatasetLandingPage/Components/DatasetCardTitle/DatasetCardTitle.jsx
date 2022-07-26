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
import { PageHeader, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import styles from './DatasetCardTitle.module.scss';

export default function DatasetCardHeader(props) {
  const { title, code } = props;

  return (
    <PageHeader
      ghost={true}
      style={{
        padding: '0px 0px 0px 0px',
      }}
      title={getTitle(title, code)}
    ></PageHeader>
  );
}

const getTitle = (title, code) => {
  const titleComponent =
    title.length > 40 ? (
      <Tooltip title={title}>
        <div className={styles['toolTip-div']}>
          <Link to={`/dataset/${code}/home`}>
            <span>{title}</span>
          </Link>
        </div>
      </Tooltip>
    ) : (
      <div className={styles['no-toolTip-div']}>
        <Link to={`/dataset/${code}/home`}>
          <span>{title}</span>
        </Link>
      </div>
    );

  return titleComponent;
};
