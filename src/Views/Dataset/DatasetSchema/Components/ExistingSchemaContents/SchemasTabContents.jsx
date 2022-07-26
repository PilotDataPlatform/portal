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
import { Spin, Space } from 'antd';
import { FileOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

const SchemasTabContents = (props) => {
  const {
    setSchemaGeid,
    schemaGeid,
    schemas,
    handleOnClick,
    schemaActionButtons,
    tabContentStyle,
  } = props;

  return (
    <div style={{height: '100%', minHeight: '400px'}}>
      {schemas.length ? (
        schemas
          .filter((el) => !el.isDraft && el.standard === 'default') // hide draft schemas and openMINDS schemas when renders
          .map((el) => (
            <div
              style={
                schemaGeid === el.geid
                  ? { ...tabContentStyle, backgroundColor: '#E6F5FF' }
                  : tabContentStyle
              }
              onClick={() => handleOnClick(el)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '20px',
                }}
              >
                <FileOutlined style={{ marginRight: '20px' }} />{' '}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: '700',
                    }}
                  >{`${el.name}`}</span>
                  <span style={{ fontSize: '10px' }}>
                    {el.systemDefined ? 'Default' : 'Custom'}
                  </span>
                </div>
              </div>
              {schemaGeid === el.geid && schemaActionButtons(el)}
            </div>
          ))
      ) : (
        <Spin indicator={<LoadingOutlined />} className={styles.loading_icon} size="large" />
      )}
    </div>
  );
};

export default SchemasTabContents;
