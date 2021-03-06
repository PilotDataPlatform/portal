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
import React from 'react';
import { Modal, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { triggerEvent } from '../../../../../../../Redux/actions';
import { FILE_OPERATIONS } from '../../FileOperationValues';
import { tokenManager } from '../../../../../../../Service/tokenManager';
import { commitFileAction } from '../../../../../../../APIs';
import { useTranslation } from 'react-i18next';
import { DeleteModalFirstStep } from './DeleteModalFirstStep';
import { DeleteModalSecondStep } from './DeleteModalSecondStep';

const DeleteFilesModal = ({
  visible,
  setVisible,
  files,
  eraseSelect,
  panelKey,
  permission,
}) => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const project = useSelector((state) => state.project);
  const username = useSelector((state) => state.username);
  const [step, setStep] = React.useState(1);
  const [locked, setLocked] = React.useState([]);
  const { authorizedFilesToDelete, unauthorizedFilesToDelete } =
    getAuthorizedFilesToDelete(files, permission, username, panelKey);
  const parentGeid = useSelector((state) => {
    const routes = state.fileExplorer.folderRouting[panelKey];
    const parentFolder = routes?.length && routes[routes.length - 1];
    return parentFolder?.globalEntityId || '';
  });
  const { t } = useTranslation([
    'tooltips',
    'success',
    'formErrorMessages',
    'errormessages',
  ]);

  const dispatch = useDispatch();

  const sessionId = tokenManager.getCookie('sessionId');

  const handleCancel = () => {
    setStep(1);
    setLocked([]);
    eraseSelect();
    setVisible(false);
  };

  const handleOk = async () => {
    if (step === 2) {
      handleCancel();
      return;
    }
    if (authorizedFilesToDelete && authorizedFilesToDelete.length === 0) {
      handleCancel();
      return;
    }

    setConfirmLoading(true);

    try {
      const res = await commitFileAction(
        {
          targets: authorizedFilesToDelete.map((file) => {
            return {
              id: file.geid,
            };
          }),
          source: parentGeid,
        },
        username,
        FILE_OPERATIONS.DELETE,
        project.profile.code,
        sessionId,
      );
      if (res.code === 202) {
        message.success(t('success:fileOperations.delete'));
      }

      dispatch(triggerEvent('LOAD_DELETED_LIST'));
      setConfirmLoading(false);
      handleCancel();
    } catch (err) {
      console.log(err.response.status);
      if (err.response.status === 403 || err.response.status === 400) {
        message.error(t('errormessages:fileOperations.unauthorizedDelete'));
      } else {
        message.error(t('errormessages:fileOperations.deleteErr'));
      }

      setConfirmLoading(false);
      handleCancel();
    }
  };

  const firstStepProps = {
    panelKey,
    authorizedFilesToDelete,
    unauthorizedFilesToDelete,
  };

  return (
    <Modal
      title="Delete Files"
      visible={visible}
      maskClosable={false}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      onOk={handleOk}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      {step === 1 && <DeleteModalFirstStep {...firstStepProps} />}
      {step === 2 && <DeleteModalSecondStep locked={locked} />}
    </Modal>
  );
};

export default DeleteFilesModal;

/**
 *
 * @param {Array} files all files selected
 * @param {"collaborator"|"contributor"|"admin"} permission
 * @param {string} username
 * @param {string} panelKey
 * @returns {{authorizedFilesToDelete:any[], unauthorizedFilesToDelete:any[]}}
 */
const getAuthorizedFilesToDelete = (files, permission, username, panelKey) => {
  let authorizedFilesToDelete = files;
  let unauthorizedFilesToDelete = [];

  return { authorizedFilesToDelete, unauthorizedFilesToDelete };
};
