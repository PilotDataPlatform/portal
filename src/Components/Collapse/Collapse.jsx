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
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

function Collapse(props) {
  const [collapsed, setCollased] = useState(false);
  function onClick(e) {
    if (props.disabled) {
      return;
    }
    setCollased(!collapsed);
  }
  return (
    <div>
      <p onClick={onClick} className={styles.title}>
        <strong>
          {props.icon} {props.title}
        </strong>
        {!props.hideIcon ? (
          <span>{collapsed ? <PlusOutlined /> : <MinusOutlined />}</span>
        ) : null}
      </p>
      <div
        style={{ maxHeight: props.maxHeight ? props.maxHeight : 300 }}
        className={styles.collpasePanel + ' ' + (collapsed && styles.collapsed)}
      >
        <div
          className={styles.collapseBg + ' ' + (props.active && styles.active)}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default Collapse;
