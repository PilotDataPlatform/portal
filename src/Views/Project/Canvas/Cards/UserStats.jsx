import React, { useState, useEffect } from 'react';
import { Pagination,Col, Row, Empty, Tooltip } from 'antd';
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

function UserStats(props) {
  const [uploadLog, setUploadLog] = useState([]);
  const [downloadLog, setDownloadLog] = useState([]);
  const [copyLogs, setCopyLogs] = useState([]);
  const [deleteLogs, setDeleteLogs] = useState([]);
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
      const paginationParams = {
        page_size: 10,
        page: 0,
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
        const { result } = res.data;
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
      });
    }
  }, [props.successNum, currentDataset?.code]);

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
      return <CloudUploadOutlined style={{color:'#1E607E'}}/>;
    } else if (tag === 'download') {
      return <DownloadOutlined style={{color:'#5B8C00'}} />;
    } else if (tag === 'copy') {
      return <CopyOutlined style={{color:'#FF8B18'}}/>;
    } else if (tag === 'delete') {
      return <DeleteOutlined style={{color:'#7E1E1E'}} />;
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

  const onShowSizeChange = (current, pageSize) =>{
    console.log(current, pageSize);
  }

  return (
    <div>
      <Col span={24} style={{position:'relative', margin: '10px 0' }}>
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
                <Row  style={{marginTop:'-0.5rem',marginLeft:'3.0rem'}}>
                  <span className={styles.userName}>{el && el.operator}</span>
                  <span className={styles.userName} style={{margin:'0 0.5rem'}}>/</span>
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
        <Pagination
          style={{marginBottom:'0.8rem',marginTop:'0.7rem',marginRight:'0.2rem',float:'right'}}
          total={sortedAllFileStreams.length}
          size="small"
          current={1}
          showSizeChanger={true}
          onShowSizeChange={onShowSizeChange}
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
