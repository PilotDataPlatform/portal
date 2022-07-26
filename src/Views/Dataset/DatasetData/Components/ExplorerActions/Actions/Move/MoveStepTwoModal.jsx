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
import { Modal, Button, message } from 'antd';
import {
  ExclamationCircleOutlined,
  FileOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from '../../ExplorerActions.module.scss';

export function MoveStepTwoModal(props) {
  const { stepTwoVisible, setStepTwoVisible, ignoreList, processingList } =
    props;
  const { t } = useTranslation(['errormessages', 'success']);
  const onCancel = () => {
    setStepTwoVisible(false);
  };
  const onOk = () => {
    setStepTwoVisible(false);
    if (processingList.length) {
      message.success(t('success:datasetFileMove.default.0'));
    }
  };
  return (
    <Modal
      className={styles['move-step-two-modal']}
      footer={
        <div>
          <Button
            className={styles['cancel-button']}
            type="link"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button className={styles['ok-button']} type="primary" onClick={onOk}>
            OK
          </Button>
        </div>
      }
      onCancel={onCancel}
      onOk={onOk}
      title={<span className={styles['title']}>Duplicate Name</span>}
      visible={stepTwoVisible}
    >
      <div>
        <span className={styles['exclamation']}>
          {' '}
          <ExclamationCircleOutlined />{' '}
        </span>
        <span className={styles['sub-title']}>
          The following file/folder already exist, will be skipped:
        </span>
      </div>
      <div>
        <ul className={styles['ul']}>
          {ignoreList.map((item) => (
            <li>
              {item.type === 'file' ? <FileOutlined /> : <FolderOutlined />}
              <span className={styles['file-name']}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
