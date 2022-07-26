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
import { Button } from 'antd';
import { PullRequestOutlined } from '@ant-design/icons';
import RequestToCoreModal from './RequestToCoreModal';

const RequestToCorePlugin = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [sourcePath, setSourcePath] = useState('');
  const { selectedRows, currentRouting, orderRouting } = props;
  const handleOnClick = () => {
    const filePath = selectedRows[0].displayPath.replace(
      `/${selectedRows[0].fileName}`,
      '',
    );
    setSourcePath(`${filePath}`);
    setShowModal(true);
  };
  return (
    <>
      <Button
        type="link"
        icon={<PullRequestOutlined />}
        style={{ marginRight: 8 }}
        onClick={handleOnClick}
      >
        Request to Core
      </Button>
      <RequestToCoreModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRows={selectedRows}
        sourcePath={sourcePath}
        currentRouting={currentRouting}
        orderRouting={orderRouting}
      />
    </>
  );
};

export default RequestToCorePlugin;
