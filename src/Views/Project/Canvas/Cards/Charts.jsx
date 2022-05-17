import React, { useState, useEffect } from 'react';
import {
  FileTextOutlined,
  HddOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { projectFileCountTotal } from '../../../../APIs';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styles from './index.module.scss';

function Charts(props) {
  // const projectInfo = useSelector((state) => state.project);

  // const currentDataset = projectInfo.profile;

  // const currentPermission =
  //   props.containersPermission &&
  //   props.containersPermission.find((el) => el.id === parseInt(datasetId));

  return (
    <div className={styles.charts}>
      <ul className={styles['charts-meta']}>
        <li className={styles['charts-meta__files']}>
          <div>
            <span>Total Files</span>
            <div className={styles['meta-stat']}>
              <FileTextOutlined />
              <span>226</span>
            </div>
          </div>
        </li>
        <li className={styles['charts-meta__file-size']}>
          <div>
            <span>Total File Size</span>
            <div className={styles['meta-stat']}>
              <HddOutlined />
              <span>1.7TB</span>
            </div>
          </div>
        </li>
        <li className={styles['charts-meta__project-members']}>
          <div>
            <span>Uploaded</span>
            <div className={styles['meta-stat']}>
              <TeamOutlined />
              <span>28</span>
            </div>
          </div>
        </li>
        <li className={styles['charts-meta__uploaded']}>
          <div>
            <span>Uploaded</span>
            <div className={styles['meta-stat']}>
              <CloudUploadOutlined />
              <span>150</span>
            </div>
          </div>
        </li>
        <li className={styles['charts-meta__downloaded']}>
          <div>
            <span>Downloaded</span>
            <div className={styles['meta-stat']}>
              <DownloadOutlined />
              <span>180</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Charts;

// export default connect((state) => ({
//   containersPermission: state.containersPermission,
//   datasetList: state.datasetList,
//   successNum: state.successNum,
//   username: state.username,
//   role: state.role,
// }))(withRouter(Charts));
