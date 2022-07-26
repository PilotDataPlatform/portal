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
import { Pagination, List, message } from 'antd';
import { getAnnouncementApi } from '../../../../../APIs';

import styles from '../../index.module.scss';
import moment from 'moment';
import { ErrorMessager, namespace } from '../../../../../ErrorMessages';
export default function All({
  currentProject,
  dateString: dateStringRaw,
  indicator,
}) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const projectCode = currentProject?.code;
  const projectId = currentProject?.id;
  const dateString = dateStringRaw || moment().format('YYYY-MM-DD');
  useEffect(() => {
    setLoading(true);
    getAnnouncementApi({
      projectCode,
      page,
      pageSize,
      startDate: dateStringRaw
        ? moment(dateString).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss')
        : '',
      endDate: dateStringRaw
        ? moment(dateString).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss')
        : '',
    })
      .then((res) => {
        const { result } = res.data;
        setTotal(result?.total);
        setAnnouncements(result?.result);
      })
      .catch((err) => {
        console.log(err);
        const errorMessage = new ErrorMessager(namespace.announcement.getAnnouncementApi);
        errorMessage.triggerMsg();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId, page, pageSize, dateStringRaw, indicator]);
  const onChange = (currentPage, pageSize) => {
    setPage(String(currentPage - 1));
    setPageSize(String(pageSize));
  };

  return (
    <>
      <List
        loading={loading}
        dataSource={announcements}
        renderItem={(announcement) => (
          <List.Item className={styles.announce_item}>
            <List.Item.Meta
              title={
                <span
                  style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
                >
                  {announcement.content}
                </span>
              }
              description={`${announcement.publisher} - ${moment(
                announcement.date + 'Z',
              ).format('MMMM Do YYYY, h:mm:ss a')}`}
            />
          </List.Item>
        )}
      />
      <Pagination
        className={styles.announce_pagination}
        onChange={onChange}
        showSizeChanger
        onShowSizeChange={onChange}
        pageSize={pageSize}
        current={page + 1}
        total={total}
      />
    </>
  );
}
