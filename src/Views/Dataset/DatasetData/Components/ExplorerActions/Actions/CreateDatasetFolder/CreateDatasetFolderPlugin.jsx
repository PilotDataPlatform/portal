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
