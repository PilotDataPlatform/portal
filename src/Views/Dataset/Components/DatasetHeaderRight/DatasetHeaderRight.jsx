import React, { useState } from 'react';
import { Tag, Button } from 'antd';
import styles from './DatasetHeaderRight.module.scss';
import { useSelector } from 'react-redux';
import { getFileSize, getTags } from '../../../../Utility';
import DatasetFilePanel from '../DatasetFilePanel/DatasetFilePanel';
import { RocketOutlined } from '@ant-design/icons';
import PublishNewVersion from '../PublishNewVersion/PublishNewVersion';

export default function DatasetHeaderRight(props) {
  const [newVersionModalVisibility, setNewVersionModalVisibility] = useState(false);
  const {
    basicInfo: { size, totalFiles, tags },
  } = useSelector((state) => state.datasetInfo);

  

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={styles['statistics-container']}>
          <Statistics label="Files">{totalFiles}</Statistics>
          <Statistics label="Size">{getFileSize(size)}</Statistics>
        </div>
        <div style={{ marginTop: '-10px' }}>
          <DatasetFilePanel />
        </div>
      </div>
      <div className={styles['tags-container']}>{getTags(tags)}</div>
      <Button
        icon={<RocketOutlined />}
        type="primary"
        style={{
          position: 'absolute',
          top: window.innerWidth>=1366?'97px':'89px',
          right: '8px',
          borderRadius: '6px',
          padding: '2px 0px',
          height: window.innerWidth>=1366?'35px':'27px',
          width: window.innerWidth>=1366?'196px':'173px',
          fontSize:window.innerWidth>=1366?'16px':'13px',
          fontWeight:'600'
        }}
        onClick={() => setNewVersionModalVisibility(true)}
      >
        Release new version
      </Button>
      <PublishNewVersion 
        newVersionModalVisibility={newVersionModalVisibility}
        setNewVersionModalVisibility={setNewVersionModalVisibility}
      />
    </>
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
