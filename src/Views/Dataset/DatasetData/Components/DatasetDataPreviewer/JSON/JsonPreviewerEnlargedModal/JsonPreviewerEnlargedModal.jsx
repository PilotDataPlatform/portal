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
import { Modal } from 'antd';
import { JsonMonacoEditor } from '../JsonMonacoEditor/JsonMonacoEditor';
import styles from './JsonPreviewerEnlargedModal.module.scss';
export function JsonPreviewerEnlargedModal(props) {
  const { isEnlarged, name, json, setIsEnlarged, format } = props;
  return (
    <Modal
      maskClosable={false}
      onCancel={() => setIsEnlarged(false)}
      footer={null}
      width={'90%'}
      title={name}
      visible={isEnlarged}
      className={styles['enlarged_json_model']}
    >
      <JsonMonacoEditor json={json} format={format} />
    </Modal>
  );
}
