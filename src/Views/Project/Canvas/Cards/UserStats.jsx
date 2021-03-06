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
import React, { useState, useEffect } from 'react';
import { Col, Row, Empty, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import {
  CloudUploadOutlined,
  DownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { getAuditLogsApi } from '../../../../APIs';
import { useCurrentProject } from '../../../../Utility';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import styles from './index.module.scss';

import CustomPagination from '../../../../Components/Pagination/Pagination';
import currentProject from '../../../../Redux/Reducers/currentProject';

function UserStats(props) {
  const [uploadLog, setUploadLog] = useState([]);
  const [downloadLog, setDownloadLog] = useState([]);
  const [copyLogs, setCopyLogs] = useState([]);
  const [deleteLogs, setDeleteLogs] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page_size: 10, cur: 1 });
  const [total, setTotal] = useState(0);

  const [currentProject] = useCurrentProject();

  const format = 'YYYY-MM-DD h:mm:ss';

  useEffect(() => {
    if (currentProject) {
      let paginationParams = {
        page_size: pageInfo.page_size,
        page: pageInfo.cur - 1,
      };
      const query = {
        project_code: currentProject && currentProject.code,
        start_date: moment('19700101', 'YYYYMMDD').unix(),
        end_date: moment().endOf('day').unix(),
        resource: 'file',
      };

      getAuditLogsApi(
        currentProject.globalEntityId,
        paginationParams,
        query,
      ).then((res) => {
        const { total, result } = res.data;
        const deleteList = result.reduce((filtered, el) => {
          let { action } = el['source'];

          if (action === 'data_delete') {
            filtered.push({
              ...el['source'],
              tag: 'delete',
              userName: props.username,
            });
          }
          return filtered;
        }, []);

        const copyList = result.reduce((filtered, el) => {
          let { action } = el['source'];

          if (action === 'data_transfer') {
            filtered.push({
              ...el['source'],
              tag: 'copy',
              userName: props.username,
            });
          }
          return filtered;
        }, []);

        const uploadList = result.reduce((filtered, el) => {
          let { action } = el['source'];

          if (action === 'data_upload') {
            filtered.push({
              ...el['source'],
              tag: 'upload',
              userName: props.username,
            });
          }
          return filtered;
        }, []);

        const downloadList = result.reduce((filtered, el) => {
          let { action } = el['source'];

          if (action === 'data_download') {
            filtered.push({
              ...el['source'],
              tag: 'download',
              userName: props.username,
            });
          }
          return filtered;
        }, []);

        setDeleteLogs(deleteList);

        setUploadLog(uploadList);

        setCopyLogs(copyList);

        setDownloadLog(downloadList);

        setTotal(total);
      });
    }
  }, [pageInfo, props.successNum, currentProject?.code]);

  const allFileStreams = [
    ...uploadLog,
    ...downloadLog,
    ...copyLogs,
    ...deleteLogs,
  ];

  const sortedAllFileStreams = allFileStreams.sort(
    (a, b) => b.createdTime - a.createdTime,
  );
  const fileStreamIcon = (tag) => {
    if (tag === 'upload') {
      return <CloudUploadOutlined style={{ color: '#1E607E' }} />;
    } else if (tag === 'download') {
      return <DownloadOutlined style={{ color: '#5B8C00' }} />;
    } else if (tag === 'copy') {
      return <CopyOutlined style={{ color: '#FF8B18' }} />;
    } else if (tag === 'delete') {
      return <DeleteOutlined style={{ color: '#7E1E1E' }} />;
    }
  };

  // get the file's folder path
  const getFolderPath = (fileLog) => {
    const wholePathList = fileLog.target.split('/');
    let outComePathList;
    if (fileLog.action === 'data_transfer') {
      outComePathList = wholePathList.slice(0, wholePathList.length - 1);
    } else {
      outComePathList = wholePathList.slice(0, wholePathList.length - 1);
    }
    const outComePathStr = outComePathList.join('/');
    return outComePathStr;
  };

  const getFileDisplayName = (fileLog) => {
    if (fileLog.action !== 'data_delete') {
      return fileLog.displayName;
    } else {
      const wholePathList = fileLog.target.split('/');
      return wholePathList.pop();
    }
  };

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  const getCurrentVal = (val) => {
    console.log('from child', val);
    setPageInfo(val);
  };

  return (
    <div className={styles.card_inner}>
      <Col span={24} style={{ position: 'relative', margin: '10px 0' }}>
        {sortedAllFileStreams.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          sortedAllFileStreams.map((el, ind) => {
            const folderPath = getFolderPath(el);
            return (
              <div className={styles.file}>
                <Row>
                  <span className={styles['file-stream--icon']}>
                    {fileStreamIcon(el.tag)}
                  </span>
                  <span className={styles['file-name']}>
                    {el && el.action !== 'data_download' ? (
                      <Tooltip title={folderPath}>
                        {getFileDisplayName(el)}
                      </Tooltip>
                    ) : (
                      getFileDisplayName(el)
                    )}
                  </span>
                </Row>
                <Row>
                  <div className={styles['connect-line']}></div>
                  <div className={styles['file-descr']}>
                    <span className={styles['user-name']}>
                      {el && el.operator}
                    </span>
                    <span
                      className={styles['user-name']}
                      style={{ margin: '-0.4rem 0.5rem' }}
                    >
                      {' '}
                      /{' '}
                    </span>
                    <span className={styles.time}>
                      {el &&
                        el.createdTime &&
                        moment(el.createdTime * 1000).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )}
                    </span>
                  </div>
                </Row>
              </div>
            );
          })
        )}
      </Col>
      <div className={styles.pagination}>
        <CustomPagination
          onChange={getCurrentVal}
          total={total}
          defaultPage={1}
          defaultSize={10}
          showPageSize={true}
        />
      </div>
    </div>
  );
}

export default connect((state) => ({
  containersPermission: state.containersPermission,
  successNum: state.successNum,
  username: state.username,
}))(withRouter(UserStats));
