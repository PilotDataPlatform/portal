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
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, message } from 'antd';
import styles from '../../index.module.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deployWorkbenchAPI } from '../../../../../APIs';
import { useTranslation } from 'react-i18next';
import { setCurrentProjectWorkbench } from '../../../../../Redux/actions';
import variables from '../../../../../Themes/base.scss';

const modalTitle = (
  <p style={{ padding: '14px 0px 0px 29px' }}>
    <ExclamationCircleOutlined
      style={{ color: '#FF9418', marginRight: '8px' }}
    />
    Confirmation
  </p>
);

const WorkbenchModal = (props) => {
  const { t } = useTranslation(['errormessages', 'success']);
  const [btnLoading, setBtnLoading] = useState(false);
  const {
    showModal,
    workbench,
    closeModal,
    projectGeid,
    setCurrentProjectWorkbench,
  } = props;

  const deployWorkbench = async () => {
    try {
      setBtnLoading(true);
      const res = await deployWorkbenchAPI(
        projectGeid,
        workbench.toLowerCase(),
      );
      if (res.data.result) {
        setBtnLoading(false);
        setCurrentProjectWorkbench();
        closeModal();
      }
    } catch (error) {
      setBtnLoading(false);
      message.error(
        t('errormessages:projectWorkench.deployWorkbench.default.0'),
      );
    }
  };

  return (
    <Modal
      className={styles.workbench_modal}
      title={modalTitle}
      visible={showModal}
      maskClosable={false}
      centered={true}
      footer={null}
      closable={false}
    >
      <div>
        <p style={{ marginLeft: '38px' }}>
          Do you confirm to configure{' '}
          <span style={{ color: variables.primaryColor1 }}>
            <strong>{workbench}</strong>
          </span>
          ?
        </p>
        <div style={{ textAlign: 'end', marginRight: '24px' }}>
          <Button type="text" style={{ border: 'none' }} onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="primary"
            style={{
              borderRadius: '6px',
              width: '80px',
              height: '30px',
              padding: '0px',
            }}
            loading={btnLoading}
            onClick={() => {
              deployWorkbench();
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default connect(null, { setCurrentProjectWorkbench })(WorkbenchModal);
