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
import React from 'react';
import { Modal, Tooltip } from 'antd';
import styles from './uploadErrorModal.module.scss';
import { WarningOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
export default function UploadErrorModal(props) {
  const {
    errorModalVisible,
    setErrorFileList,
    setErrorModalVisible,
    errorFileList,
  } = props;
  const { t } = useTranslation(['errormessages']);
  return (
    <Modal
      className={styles['error-modal']}
      title="Upload openMINDS Schemas"
      visible={errorModalVisible}
      onCancel={() => {
        setErrorFileList([]);
        setErrorModalVisible(false);
      }}
      footer={null}
    >
      <div className={styles['content']}>
        <span className={styles['description']}>
          {t('errormessages:uploadOpenMindsSchema.uploadFailed.0')}
        </span>
        <br></br>
        <ul className={styles['ul']}>
          {errorFileList.map((errorFile) => {
            return (
              <li className={styles['li']}>
                <WarningOutlined />{' '}
                <Tooltip title={errorFile.name}>
                  <span className={styles['file-name']}>{errorFile.name}</span>
                </Tooltip>{' '}
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
