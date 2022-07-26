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
import { Modal, Button } from 'antd';

import FileBasics from './FileBasics';

function FileBasicsModal(props) {
  const { record } = props;
  return (
    <>
      <Modal
        title="General"
        visible={props.visible}
        onOk={props.handleOk}
        onCancel={props.handleOk}
        footer={[
          <Button key="back" onClick={props.handleOk}>
            OK
          </Button>,
        ]}
      >
        <FileBasics pid={props.projectId} record={record} />
      </Modal>
    </>
  );
}

export default FileBasicsModal;
