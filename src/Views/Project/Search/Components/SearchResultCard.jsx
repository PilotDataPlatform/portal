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
import moment from 'moment';
import { Tag, Tooltip } from 'antd';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import styles from '../index.module.scss';
import { getHighlightedText, getFileSize } from '../../../../Utility';
import _ from 'lodash';

function SearchResultCard({ record, searchConditions }) {
  const attributeConditions = searchConditions.find(
    (el) => el.category === 'attributes',
  );
  const attributeList = attributeConditions
    ? attributeConditions.attributes
    : [];
  
  const fileType = record.type;
  const attributes = record.attributes;
  const tags = record.tags;
  const location = record.parentPath.split('.').join('/') + '/' + record.name;

  const uploadTime = moment(record.createdTime).format(
    'YYYY-MM-DD HH:mm:ss',
  );
  const hightLightTemplateName = (name) => {
    if (
      searchConditions.find((el) => el.category === 'attributes') &&
      searchConditions.find((el) => el.category === 'attributes')['name']
    ) {
      return getHighlightedText(
        attributes[0].name,
        searchConditions.find((el) => el.category === 'attributes')['name'],
      );
    } else {
      return <p>{name}</p>;
    }
  };

  const displayFileType = (fileType) => {
    if (fileType === 'file') {
      return (
        <div>
          <span className="file-name-row-lable">File Name:</span>
          <FileOutlined style={{marginRight: '10px'}}/>
        </div>
      );
    } else if (fileType === 'folder') {
      return (
        <div>
          <span className="folder-name-row-lable">Folder Name:</span>
          <FolderOutlined style={{marginRight: '10px'}}/>
        </div>
      );
    }
  };

  return (
    <div className={styles.search_result_card}>
      <div className="search-item-left">
        <div className={styles.search_item_header}>
          <div
            style={{
              width: '25%',
              display: 'flex',
              whiteSpace: 'nowrap',
              marginRight: '10px',
            }}
          >
            {displayFileType(fileType)}
            {searchConditions.find((el) => el.category === 'file_name') &&
            searchConditions.find((el) => el.category === 'file_name')[
              'keywords'
            ] ? (
              getHighlightedText(
                record.name,
                searchConditions.find((el) => el.category === 'file_name')[
                  'keywords'
                ],
              )
            ) : (
              <>
                {record.name.length > 10 ? (
                  <Tooltip title={record.name}>
                    <span className="file-name-val">
                      {record.name.replace(/\s/g, '\u00a0')}
                    </span>
                  </Tooltip>
                ) : (
                  <span className="file-name-val">
                    {record.name.replace(/\s/g, '\u00a0')}
                  </span>
                )}
              </>
            )}
          </div>
          <div style={{ width: '22%', whiteSpace: 'nowrap', display: 'flex' }}>
            <span className="time-label">Uploaded Time:</span>
            <span className="file-name-val">
              {uploadTime.length > 10 ? (
                <Tooltip title={uploadTime}>
                  <span className="file-name-val">{uploadTime}</span>
                </Tooltip>
              ) : (
                <span className="file-name-val">{uploadTime}</span>
              )}
            </span>
          </div>
          <div style={{ width: '20%', whiteSpace: 'nowrap' }}>
            <span className="uploader-label">Uploaded By:</span>
            {searchConditions.find((el) => el.category === 'uploader') &&
            searchConditions.find((el) => el.category === 'uploader')[
              'keywords'
            ] ? (
              getHighlightedText(
                record.owner,
                searchConditions
                  .find((el) => el.category === 'uploader')
                  ['keywords'].toLowerCase(),
              )
            ) : (
              <>
                <span className="file-name-val">{record.owner}</span>
              </>
            )}
          </div>
          {fileType === 'file' ? <div style={{ flex: 1, whiteSpace: 'nowrap' }}>
            <span className="size-label">
              File Size:
            </span>
            <span className="file-name-val">
              {record.size ? getFileSize(record.size) : 0}
            </span>
          </div> : null}
        </div>

        {attributes && attributes.length ? (
          <div className="manifest-row">
            <span className="row-label_FileAttribute">File Attribute:</span>
            <ul className="manifest-val">
              <li style={{ display: 'flex', flexDirection: 'column' }}>
                <h4>Template Name</h4>
                {hightLightTemplateName(attributes[0].name)}
              </li>
              <li>
                <h4>Attribute Name</h4>
                {attributes.map((el) => {
                  const attributeNameList = attributeList
                    .filter((attribute) => attribute.name)
                    .map((attribute) => attribute.name);
                  if (attributeNameList.includes(el.attributeName)) {
                    return (
                      <p>
                        <b>{el.attributeName}</b>
                      </p>
                    );
                  } else {
                    return <p>{el.attributeName}</p>;
                  }
                })}
              </li>
              <li>
                <h4>Value</h4>
                {attributes.map((el) => {
                  if (el.value && Array.isArray(el.value)) {
                    const searchCondition = attributeList.some(
                      (attribute) => attribute.name === el.attributeName,
                    );
                    if (searchCondition)
                      return (
                        <p>
                          <b>{el.value[0]}</b>
                        </p>
                      );
                    return <p>{el.value[0]}</p>;
                  } else {
                    const searchCondition = attributeList.find(
                      (attribute) => attribute.name === el.attributeName,
                    );

                    if (searchCondition && el.value)
                      return getHighlightedText(
                        el.value,
                        searchCondition.value,
                      );

                    return <p>{el.value}</p>;
                  }
                })}
              </li>
            </ul>
          </div>
        ) : (
          <div className="manifest-row"></div>
        )}

        {tags && tags.length ? (
          <div className="tags-row">
            <span className="row-label">Tags:</span>
            <div className="tags-val">
              {tags.map((el) => {
                const searchedTag = searchConditions.find(
                  (el) => el.category === 'tags',
                );
                if (
                  searchedTag &&
                  searchedTag.keywords &&
                  searchedTag.keywords.includes(el)
                ) {
                  return <Tag className="highlight">{el}</Tag>;
                }
                return <Tag>{el}</Tag>;
              })}
            </div>
          </div>
        ) : (
          <div className="tags-row"></div>
        )}
      </div>
      <div className={styles.search_item_right}>
        <span>
          Location:{' '}
          {location.length > 30 ? (
            <Tooltip title={location}>
              <b>{location}</b>
            </Tooltip>
          ) : (
            <b>{location}</b>
          )}
        </span>
      </div>
    </div>
  );
}

export default SearchResultCard;
