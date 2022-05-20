import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import {
  HomeOutlined,
  PaperClipOutlined,
  CloudServerOutlined
} from '@ant-design/icons';
import { projectFileCountTotal } from '../../../../APIs';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styles from './index.module.scss';

function FileStats(props) {
  const [greenRoomCount, setGreenRoomCount] = useState(0);
  const [coreCount, setCoreCount] = useState(0);
  // const [uploadCount, setUploadCount] = useState(0);
  // const [downloadCount, setDownloadCount] = useState(0);
  // const [copyCount, setCopyCount] = useState(0);

  const {
    match: {
      params: { datasetId },
    },
  } = props;

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
      projectFileCountTotal(currentDataset.globalEntityId, {
        start_date: moment().startOf('day').unix(),
        end_date: moment().endOf('day').unix(),
      }).then((res) => {
        const statistics = res?.data?.result;
        if (res.status === 200 && statistics) {
          //no collection number in statistics
          setGreenRoomCount(statistics.greenroom);
          setCoreCount(statistics.core);
          // setCopyCount(statistics.approved);
          // setDownloadCount(statistics.downloaded);
          // setUploadCount(statistics.uploaded);
        }
      });
    }
  }, [currentDataset, props.successNum]);

  return currentDataset ? (
    <div style={{ flexDirection:'column',display: 'flex'}}>
      <div className={styles.shortcut}>
          <span className={styles.iconColumn}>
            <HomeOutlined className={styles.icon} style={{color:'#A5CF00'}} />
          </span>
          <span className={styles.fileFont}>Green Room</span>
          <span className={styles.fileNumber}>Files {greenRoomCount}</span>
          
      </div>
      {props.projectRole !== 'collaborator' && coreCount !== null ?<div className={styles.shortcut}>
          <span className={styles.iconColumn}>
            <CloudServerOutlined className={styles.icon} style={{color:'#1890FF'}} />
          </span>
          <span className={styles.fileFont}>Core</span>
          <span className={styles.fileNumber}>Files {coreCount}</span>
          
      </div>:null}
      {props.projectRole !== 'collaborator' ?<div className={styles.shortcut}>
          <span className={styles.iconColumn}>
            <PaperClipOutlined className={styles.icon} style={{color:'#FFC118'}} />
          </span>
          <span className={styles.fileFont}>Collections</span>
          <span className={styles.fileNumber}>Files {greenRoomCount}</span>
          
      </div>:null}
    </div>
  ) : null;
}

export default connect((state) => ({
  containersPermission: state.containersPermission,
  datasetList: state.datasetList,
  successNum: state.successNum,
  username: state.username,
  role: state.role,
}))(withRouter(FileStats));
