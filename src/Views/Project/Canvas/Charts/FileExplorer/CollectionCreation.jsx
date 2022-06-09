import React, { useEffect, useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import { createVirtualFolder, deleteVirtualFolder } from '../../../../../APIs';
import { trimString } from '../../../../../Utility';
import _ from 'lodash';
import { PlusOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import i18n from '../../../../../i18n';
import styles from './index.module.scss';
import variables from '../../../../../Themes/base.scss';
import {
  setCurrentProjectActivePane,
  setCurrentProjectTree,
  vFolderOperation,
} from '../../../../../Redux/actions';
import { connect } from 'react-redux';
import { useCurrentProject } from '../../../../../Utility';
function CollectionCreation(props) {
  const [updateBtnLoading, setUpdateBtnLoading] = useState(false);
  const [currentDataset] = useCurrentProject();
  const [collectionName, setCollectionName] = useState('');
  const projectCode = currentDataset.code;
  const onCreateCollectionFormFinish = async (values) => {
    try {
      setUpdateBtnLoading(true);
      await createVirtualFolder(projectCode, collectionName, props.username);
      await props.updateVfolders();
      props.clearVFolderOperation();
    } catch (error) {
      setUpdateBtnLoading(false);
      switch (error.response?.status) {
        case 409: {
          message.error(
            `${i18n.t('errormessages:createVirtualFolder.duplicate.0')}`,
            3,
          );
          break;
        }
        case 400: {
          message.error(
            `${i18n.t('errormessages:createVirtualFolder.limit.0')}`,
            3,
          );
          break;
        }
        default: {
          message.error(
            `${i18n.t('errormessages:createVirtualFolder.default.0')}`,
            3,
          );
        }
      }
    }
  };
  //   const deleteCollection = async (geid, key) => {
  //     try {
  //       setDeleteBtnLoading(true);
  //       setDeletedPaneKey(key);
  //       await deleteVirtualFolder(geid);
  //       updateVfolders();
  //     } catch (error) {
  //       setDeleteBtnLoading(false);
  //       message.error(`${i18n.t('errormessages:deleteVirtualFolder.default.0')}`);
  //     }
  //   };
  if (!props.createCollection) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingTop: 4,
        }}
      >
        <PlusOutlined
          style={{
            width: '14px',
            height: '14px',
            color: variables.primaryColorLight1,
            marginRight: '8px',
            marginLeft: '5px',
          }}
        />
        <span
          style={{
            fontSize: '12px',
            color: '#818181',
            cursor: 'pointer',
          }}
          onClick={() => props.setVFolderOperationCreate()}
        >
          Create Collection
        </span>
      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', paddingTop: 4 }}>
        <Form>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginLeft: '5px',
            }}
          >
            <Form.Item
            //   name="newCollectionName"
            //   rules={[
            //     {
            //       required: true,
            //       validator: (rule, value) => {
            //         const collection = value ? trimString(value) : null;
            //         if (!collection) {
            //           return Promise.reject(
            //             'Collection name should be 1 ~ 20 characters',
            //           );
            //         }
            //         const isLengthValid =
            //           collection.length >= 1 && collection.length <= 20;
            //         if (!isLengthValid) {
            //           return Promise.reject(
            //             'Collection name should be 1 ~ 20 characters',
            //           );
            //         } else {
            //           const specialChars = [
            //             '\\',
            //             '/',
            //             ':',
            //             '?',
            //             '*',
            //             '<',
            //             '>',
            //             '|',
            //             '"',
            //             "'",
            //           ];
            //           for (let char of specialChars) {
            //             if (collection.indexOf(char) !== -1) {
            //               return Promise.reject(
            //                 `Collection name can not contain any of the following character ${specialChars.join(
            //                   ' ',
            //                 )}`,
            //               );
            //             }
            //           }
            //           return Promise.resolve();
            //         }
            //       },
            //     },
            //   ]}
            >
              <Input
                placeholder="Enter Collection Name"
                style={{
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
                onChange={(e) => {
                  setCollectionName(e.target.value);
                }}
              />
            </Form.Item>
          </div>
          <div className={styles['vfolder-create__buttons']}>
            <Button
              type="default"
              icon={<CloseOutlined />}
              onClick={() => {
                props.clearVFolderOperation();
              }}
              className="vfolder-create__buttons-close"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={updateBtnLoading}
              onClick={onCreateCollectionFormFinish}
            >
              Create
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
export default connect((state) => ({}), {
  setCurrentProjectTree,
  setCurrentProjectActivePane,
  setVFolderOperationCreate: vFolderOperation.setVFolderOperationCreate,
  clearVFolderOperation: vFolderOperation.clearVFolderOperation,
})(CollectionCreation);
