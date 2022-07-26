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
import React, { useState } from 'react';
import { Card, Tag } from 'antd';
import { UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons';
import styles from './DatasetCard.module.scss';
import DatasetCardTitle from '../DatasetCardTitle/DatasetCardTitle';
import { getFileSize, getTags } from '../../../../Utility';
import moment from 'moment';

export default function DatasetCard(props) {
  const {
    title,
    creator,
    createdAt,
    description,
    tags,
    size,
    totalFiles,
    code,
  } = props.dataset;
  const [isExpand, setIsExpand] = useState(false);

  const toggleExpand = () => {
    setIsExpand((preValue) => !preValue);
  };
  return (
    <div className={styles['dataset-card']}>
      <Card>
        <div className={styles['left']}>
          <DatasetCardTitle title={title} code={code} />
          <div className={styles['dataset-card-note']}>
            <b>
              Dataset Code: {code} / Created on{' '}
              {moment.utc(createdAt).local().format('YYYY-MM-DD')}
            </b>{' '}
            by {creator || 'N/A'}
          </div>
          {isExpand && <Description>{description}</Description>}
        </div>

        <div className={styles['right']}>
          <div className={styles['statistics-container']}>
            <Statistics label="Files">{totalFiles}</Statistics>
            <Statistics label="Size">{getFileSize(size)}</Statistics>
          </div>
          <div className={styles['tags-container']}>{getTags(tags)}</div>
        </div>

        <div onClick={toggleExpand} className={styles['expand']}>
          {isExpand ? <UpCircleOutlined /> : <DownCircleOutlined />}
        </div>
      </Card>
    </div>
  );
}

const Statistics = (props) => {
  const { label, children } = props;
  return (
    <span className={styles['statistics']}>
      <span className={styles['statistics-title']}>{label}</span>
      <span className={styles['statistics-value']}>{children}</span>
    </span>
  );
};

const Description = (props) => {
  const { children } = props;
  return (
    <div className={styles['description']}>
      <div>Description:</div>
      <p>{children || 'N/A'}</p>
    </div>
  );
};
