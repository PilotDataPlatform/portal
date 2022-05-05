import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import CreateFolderModal from './CreateDatasetFolderModal';
import styles from '../../ExplorerActions.module.scss';
// import { useSelector, useDispatch } from 'react-redux';

export default function CreateDatasetFolderPlugin() {
  // const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // should the button be disabled until the datasets are loaded?
  return (
    <>
      <Button
        type="link"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsModalVisible(true);
        }}
        className={styles['button-enable']}
      >
        New Folder
      </Button>
      <CreateFolderModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  );
}
