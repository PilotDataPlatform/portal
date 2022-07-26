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
import React, { useState, useEffect } from 'react';
import { Card, Divider, Button, Popover, Collapse, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import styles from '../../ExplorerActions.module.scss';
import {
  SyncOutlined,
  CloseOutlined,
  CloseCircleFilled,
  WarningFilled,
  WarningOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons';
import { keycloak } from '../../../../../../../Service/keycloak';
import { preValidateBids } from '../../../../../../../APIs';
import { getFileSize } from '../../../../../../../Utility';
import { datasetInfoCreators } from '../../../../../../../Redux/actions';

const { Panel } = Collapse;

export default function ValidateButton(props) {
  const dispatch = useDispatch();
  const basicInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const treeData = useSelector((state) => state.datasetData.treeData);

  const openMessagePanel = async () => {
    console.log(keycloak.refreshToken, keycloak.token);
    if (treeData.length === 0) {
      message.error(
        'There is no file in your dataset. Please import files before validation',
      );
      return;
    }

    if (!basicInfo['bidsLoading']) {
      const response = await preValidateBids(basicInfo.geid);
      message.info('Validation in progress, this might take few minutes.');
      console.log(response.data);
    }

    basicInfo['bidsLoading'] = true;
    dispatch(datasetInfoCreators.setBasicInfo(basicInfo));
  };

  return (
    <Button
      icon={<SyncOutlined spin={basicInfo.bidsLoading} />}
      style={{ height: 28, margin: '3px 10px 3px 5px', borderRadius: 5 }}
      onClick={openMessagePanel}
    >
      <span>Validate BIDS</span>
    </Button>
  );
}
