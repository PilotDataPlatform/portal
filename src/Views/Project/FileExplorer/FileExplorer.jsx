import React from 'react';
import BasicCard from '../../../Components/Cards/BasicCard';
import FileExplorer from '../Canvas/Charts/FileExplorer/FileExplorer';
import CanvasPageHeader from '../Canvas/PageHeader/CanvasPageHeader';

import styles from './index.module.scss';

const FileExplorerView = ({
  datasetId,
  userListOnDataset,
  containerDetails,
  getUserOnProjectAPI,
  setUserListOnDataset,
  rolesDetail,
}) => {
  return (
    <div className={styles['fileExplorer__container']}>
      <CanvasPageHeader variant="fileExplorer"/>
      <div className={styles['fileExplorer__card']}>
        <BasicCard title="File Explorer" content={<FileExplorer />} />
      </div>
    </div>
  );
};

export default FileExplorerView;
