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
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../../ExplorerActions.module.scss';
import { EDIT_MODE } from '../../../../../../../Redux/Reducers/datasetData';
import { MoveStepOneModal } from './MoveStepOneModal';

export function Move() {
  const editorMode = useSelector((state) => state.datasetData.mode);
  const selectedData = useSelector((state) => state.datasetData.selectedData);
  const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const moveCondition =
    selectedData.length !== 0 &&
    editorMode !== EDIT_MODE.EIDT_INDIVIDUAL &&
    !datasetInfo.bidsLoading;
  const [stepOneVisible, setStepOneVisible] = useState(false);

  return (
    <>
      <Button
        disabled={!moveCondition}
        className={ moveCondition && styles['button-enable'] }
        type="link"
        onClick={() => {
          setStepOneVisible(true);
        }}
        icon={<SwapOutlined />}
      >
        Move to
      </Button>
      <MoveStepOneModal
        stepOneVisible={stepOneVisible}
        setStepOneVisible={setStepOneVisible}
      />
    </>
  );
}
