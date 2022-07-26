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
import React, { useState } from 'react';
import { FolderAddOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import VirtualFolderModal from './VirtualFolderModal';
import i18n from '../../../../../../../i18n';
function VirtualFolderPlugin({ selectedRowKeys, selectedRows }) {
  const [modalVisible, setModalVisible] = useState(false);
  let files = [];
  if (selectedRows) {
    files = selectedRows.map((v) => (v ? v.geid : v));
  }
  files = files.filter((v) => !!v);
  function popCollectionModal() {
    if (selectedRowKeys.length === 0) {
      message.error(
        `${i18n.t('formErrorMessages:addToVfolderModal.files.empty')}`,
        3,
      );
      return;
    }
    setModalVisible(true);
  }
  return (
    <>
      <Button
        type="link"
        onClick={() => {
          popCollectionModal();
        }}
        icon={<FolderAddOutlined />}
        style={{ marginRight: 8 }}
      >
        Add To Collection
      </Button>
      <VirtualFolderModal
        files={files}
        visible={modalVisible}
        setVisible={setModalVisible}
      />
    </>
  );
}
export default VirtualFolderPlugin;
