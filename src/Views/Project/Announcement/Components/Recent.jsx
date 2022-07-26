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
import { Typography, Card, Spin, message, Empty } from 'antd';
import { getAnnouncementApi } from '../../../../APIs';
import moment from 'moment';
const { Paragraph } = Typography;

export default function Recent({ currentProject, indicator }) {
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  useEffect(() => {
    setLoading(true);
    getAnnouncementApi({ projectCode: currentProject?.code })
      .then((res) => {
        const result = res?.data?.result?.result[0];
        setAnnouncement(result);
      })
      .catch((err) => {
        message.error('Failed to get recent announcement');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentProject.id, indicator]);
  return (
    <Card title="Recent announcement" style={{ width: '100%' }}>
      {loading ? (
        <Spin />
      ) : announcement ? (
        <>
          <Paragraph
            style={{
              whiteSpace: 'pre-line',
              wordBreak:"break-all",
              lineHeight: '16px',
              fontSize: 14,
              marginBottom: 0,
            }}
          >
            {announcement?.content || 'No Data'}
          </Paragraph>
          <span
            style={{ color: 'rgba(0, 0, 0, 0.45)', fontStyle: 'italic' }}
          >{`${announcement?.publisher} - ${
            announcement?.date &&
            moment(announcement.date + 'Z').format('MMMM Do YYYY, h:mm:ss a')
          }`}</span>
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  );
}
