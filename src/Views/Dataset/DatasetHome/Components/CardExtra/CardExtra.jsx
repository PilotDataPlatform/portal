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
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './CardExtra.module.scss';

export function CardExtra(props) {
  const { editMode, onCancel, submitting, onClickSubmit, onClickEditButton } =
    props;

  if (editMode) {
    return (
      //if the <div></div> is replaced with <></>, when toggling, the buttons will shake. why?
      <div>
        <Button
          onClick={onCancel}
          className={styles['cancel-button']}
          type="link"
          disabled={submitting}
        >
          Cancel
        </Button>{' '}
        <Button
          className={styles['submit-button']}
          icon={<SaveOutlined />}
          type="primary"
          onClick={onClickSubmit}
          loading={submitting}
        >
          Submit
        </Button>{' '}
      </div>
    );
  }

  // return (
  //   <Button
  //     className={styles['edit-button']}
  //     type="link"
  //     onClick={onClickEditButton}
  //     icon={<EditOutlined />}
  //   ></Button>
  // );
  return null;
}
