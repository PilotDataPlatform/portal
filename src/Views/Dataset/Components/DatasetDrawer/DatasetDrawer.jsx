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
import { Drawer, Table } from 'antd';
import {
  getDatasetVersionsAPI,
  datasetDownloadReturnURLAPI,
  datasetDownloadAPI,
} from '../../../../APIs';
import { useDispatch, useSelector } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './DatasetDrawer.module.scss';
import { namespace, ErrorMessager } from '../../../../ErrorMessages';
import variables from '../../../../Themes/base.scss';
const DatasetDrawer = (props) => {
  const { datasetDrawerVisibility, setDatasetDrawerVisibility } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItem, setTotalItem] = useState(0);
  const [datasetVersions, setDatasetVersions] = useState(0);
  const { basicInfo, currentVersion } = useSelector(
    (state) => state.datasetInfo,
  );

  const downloadDataset = async (version) => {
    try {
      const res = await datasetDownloadReturnURLAPI(basicInfo.geid, version);
      const hash = res.data.result.downloadHash;
      await datasetDownloadAPI(hash);
    } catch (err) {
      if (err.response) {
        const errorMessager = new ErrorMessager(
          namespace.dataset.files.downloadFilesAPI,
        );
        errorMessager.triggerMsg(err.response.status);
      }
      return;
    }
  };

  const columns = [
    {
      title: '',
      key: 'content',
      width: '80%',
      render: (item) => {
        return (
          <div
            style={
              Number(item.version) % 1 === 0
                ? {
                    display: 'flex',
                    padding: '24px',
                    backgroundColor: '#F0F0F0',
                  }
                : {
                    display: 'flex',
                    padding: '24px',
                  }
            }
          >
            <div
              style={{ marginTop: '-2px', marginRight: '3px', width: '35px' }}
            >
              <p
                style={{
                  margin: '0px',
                  fontSize: '16px',
                  color: variables.primaryColor1,
                  fontWeight: 'bold',
                }}
              >
                {item.version}
              </p>
            </div>
            <div style={{ width: '250px', marginRight: '30px' }}>
              <p style={{ margin: '0px' }}>
                <span style={{ marginRight: '3px' }}>-</span>
                {`${moment(item.createdAt).format('YYYY.MM.DD HH:MM:SS')} by ${
                  item.createdBy
                }`}
              </p>
              <p style={{ margin: '0px' }}>{item.notes}</p>
            </div>
            <div style={{ flex: '1', alignSelf: 'center' }}>
              <DownloadOutlined
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  downloadDataset(item.version);
                }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const getDatasetVersions = async () => {
    const params = {
      page: currentPage - 1,
      page_size: pageSize,
      order: 'desc',
      sorting: 'create_at',
    };
    const res = await getDatasetVersionsAPI(basicInfo.geid, params);
    setDatasetVersions(res.data.result);
    setTotalItem(res.data.total);
  };

  useEffect(() => {
    if (basicInfo.geid) {
      getDatasetVersions();
    }
  }, [basicInfo.geid, currentPage, currentVersion, pageSize]);

  const onTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <Drawer
      className={styles.dataset_drawer}
      title={
        <p
          style={{
            margin: '0px',
            fontSize: '16px',
            color: variables.primaryColor1,
          }}
        >
          Versions
        </p>
      }
      placement={'right'}
      closable={true}
      onClose={() => setDatasetDrawerVisibility(false)}
      visible={datasetDrawerVisibility}
      mask={false}
      key={'right'}
    >
      <Table
        className={styles.drawer_content_table}
        columns={columns}
        dataSource={datasetVersions}
        onChange={onTableChange}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalItem,
          pageSizeOptions: [10, 20, 50],
          showSizeChanger: true,
        }}
        size="middle"
      />
    </Drawer>
  );
};

export default DatasetDrawer;
