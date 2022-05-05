import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Button, Form, Input, message } from 'antd';

import styles from '../../ExplorerActions.module.scss';
import { trimString } from '../../../../../../../Utility';
import { createDatasetFolderAPI } from '../../../../../../../APIs';
import i18n from '../../../../../../../i18n';
import { namespace, ErrorMessager } from '../../../../../../../ErrorMessages';
import { fetchDatasetFiles }from '../../../DatasetDataExplorer/utility.js';

export default function CreateFolderModal({
  isModalVisible,
  setIsModalVisible,
}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const treeData = useSelector((state) => state.datasetData.treeData);
  const dispatch = useDispatch();

  const datasetGeid = datasetInfo.geid;

  const onSubmit = () => {
    setIsLoading(true);
    form
      .validateFields()
      .then((values) => {
        const { folderName } = values;
        createDatasetFolderAPI(datasetGeid, folderName)
          .then(async (res) => {
            if (res.data.code === 409) {
              message.error(`${i18n.t('errormessages:createFolder.409.0')}`);
            }
            if (res.data.code === 200) {
              message.success(`${i18n.t('success:createFolder')}`);
              form.resetFields();
              setIsModalVisible(false);
              await fetchDatasetFiles(datasetGeid, dispatch);
            }
          })
          .catch((err) => {
            if (err.response.status === 409) {
              return message.error(`${i18n.t('errormessages:createFolder.409.0')}`);
            }
            message.error(
              `${i18n.t('errormessages:createFolder.default.0')}`,
            );
          });
      })
      .catch((e) => console.log(e)) // errors are created by custom validator (folderNameValidation)
      .finally(() => setIsLoading(false));
  };

  const onCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  }

  const folderNameValidation = async (_, value) => {
    const trimmedInput = value ? trimString(value) : null;
    if (!trimmedInput) {
      return Promise.reject('Folder name should be 1 to 20 characters long');
    }

    const isLengthValid = trimmedInput.length >= 1 && trimmedInput.length <= 20;
    if (!isLengthValid) {
      return Promise.reject('Folder name should be 1 to 20 characters long');
    }

    const excludesSpecialChar = /^[^\\\/\:\?\*\<\>\|\"]*$/g.test(value);
    if (!excludesSpecialChar) {
      return Promise.reject(
        `Folder name can not contain any of the following characters / : ? * < > | " '`,
      );
    }

    const treeDataFolderNames = treeData.reduce((result, data) => {
      if (data.labels.indexOf('Folder') > -1) {
        result.push(data.name);
      }
      return result;
    }, []);
    const isDuplicateName = treeDataFolderNames.indexOf(value) > -1;
    if (isDuplicateName) {
      return Promise.reject(`A folder with the name ${value} already exists`);
    }
  };

  return (
    <Modal
      className={styles['create-folder-modal']}
      visible={isModalVisible}
      onCancel={onCancel}
      title="Create Dataset Folder"
      footer={
        <>
          <Button
            type="link"
            className={styles['cancel-button']}
            disabled={isLoading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            className={styles['create-button']}
            icon={<PlusOutlined />}
            onClick={onSubmit}
            loading={isLoading}
          >
            Create
          </Button>
        </>
      }
    >
      <Form
        name="createDatasetFolder"
        layout="vertical"
        autoComplete="off"
        form={form}
      >
        <Form.Item
          name="folderName"
          label="Folder Name"
          required
          rules={[{ required: true, validator: folderNameValidation }]}
        >
          <Input placeholder="Enter your folder name" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
