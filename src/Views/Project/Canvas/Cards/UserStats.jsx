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

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import styles from './index.module.scss';

import CustomPagination from '../../../../Components/Pagination/Pagination';

function UserStats(props) {
  const [uploadLog, setUploadLog] = useState([]);
  const [downloadLog, setDownloadLog] = useState([]);
  const [copyLogs, setCopyLogs] = useState([]);
  const [deleteLogs, setDeleteLogs] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page_size: 10, cur: 1 });
  const [total, setTotal] = useState(0);

  const {
    match: {
      params: { datasetId },
    },
  } = props;

  const format = 'YYYY-MM-DD h:mm:ss';

  const checkTimeForToday = (timeStamp) => {
    return (
      moment().startOf('day').unix() < timeStamp &&
      moment().endOf('day').unix() > timeStamp
    );
  };

  const projectInfo = useSelector((state) => state.project);

  const currentDataset = projectInfo.profile;

  const currentPermission =
    props.containersPermission &&
    props.containersPermission.find((el) => el.id === parseInt(datasetId));

  useEffect(() => {
    if (currentDataset) {
      let paginationParams = {
        page_size: pageInfo.page_size,
        page: pageInfo.cur - 1,
      };
      const query = {
        project_code: currentDataset && currentDataset.code,
        start_date: moment('19700101', 'YYYYMMDD').unix(),
        end_date: moment().endOf('day').unix(),
        resource: 'file',
      };

      getAuditLogsApi(
        currentDataset.globalEntityId,
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
  }, [pageInfo, props.successNum, currentDataset?.code]);

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
    <div>
      <Col span={24} style={{ position: 'relative', margin: '10px 0' }}>
        {sortedAllFileStreams.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          sortedAllFileStreams.map((el) => {
            const folderPath = getFolderPath(el);
            return (
              <div className={styles.file}>
                <Row>
                  <span className={styles.fileStreamIcon}>
                    {fileStreamIcon(el.tag)}
                  </span>
                  <span className={styles.fileName}>
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
                  <span className={styles.userName}>{el && el.operator}</span>
                  <span
                    className={styles.userName}
                    style={{ margin: '-0.4rem 0.5rem' }}
                  >
                    {' '}
                    /{' '}
                  </span>
                  <span className={styles.time}>
                    {el &&
                      el.createdTime &&
                      moment.unix(el.createdTime).format(format)}
                  </span>
                </Row>
              </div>
            );
          })
        )}
      </Col>
      <div className={styles.pageination}>
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
