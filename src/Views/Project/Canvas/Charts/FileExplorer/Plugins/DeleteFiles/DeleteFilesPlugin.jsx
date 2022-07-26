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
import { DeleteOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { TABLE_STATE } from '../../RawTableValues';
import DeleteFilesModal from './DeleteFilesModal';
import i18n from '../../../../../../../i18n';

const DeleteFilesPlugin = ({
  tableState,
  selectedRowKeys,
  clearSelection,
  selectedRows,
  setTableState,
  panelKey,
  permission,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const deleteFiles = selectedRows
    .map((v) => {
      if (!v) return null;
      return {
        input_path: v.name,
        fileName: v.fileName,
        uploader: v.owner,
        geid: v.geid,
      };
    })
    .filter((v) => !!v);

  const fileDeletion = (e) => {
    if (selectedRowKeys.length === 0) {
      message.error(
        `${i18n.t('errorMessages:fileOperations.noFileToDelete')}`,
        3,
      );
      return;
    }
    setTableState(TABLE_STATE.NORMAL);
    setDeleteModalVisible(true);
  };

  return (
    <>
      <Button
        type="link"
        onClick={() => {
          fileDeletion();
        }}
        icon={<DeleteOutlined />}
        style={{ marginRight: 8 }}
      >
        Delete
      </Button>

      <DeleteFilesModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        files={deleteFiles}
        eraseSelect={() => {
          clearSelection();
        }}
        panelKey={panelKey}
        permission={permission}
      />
    </>
  );
};

export default DeleteFilesPlugin;
