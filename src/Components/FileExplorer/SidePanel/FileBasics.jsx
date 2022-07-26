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
import { Descriptions, Tooltip } from 'antd';
import FileTags from './FileTags';
import { getFileSize, timeConvert } from '../../../Utility';
function FileBasics(props) {
  const { record, panelKey } = props;
  let pathsArr;
  let pathStr;
  if (record.displayPath) {
    pathsArr = record.displayPath.split('/');
    pathStr = pathsArr.slice(0, pathsArr.length - 1).join('/');
  }

  return (
    <div style={{ paddingBottom: '16px' }}>
      {/* <Title level={5}>Basic information</Title> */}
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="Name" style={{ wordBreak: 'break-word' }}>
          {record.name}
        </Descriptions.Item>

        <Descriptions.Item label="Added by">{record.owner}</Descriptions.Item>
        <Descriptions.Item label="Created">
          {timeConvert(record.createTime, 'datetime')}
        </Descriptions.Item>
        {record.nodeLabel.indexOf('Folder') === -1 ? (
          <Descriptions.Item label="File Size">
            {![undefined, null].includes(record.fileSize)
              ? getFileSize(record.fileSize)
              : 'N/A'}
          </Descriptions.Item>
        ) : null}
        {pathsArr && (
          <Descriptions.Item label="Path">
            {pathStr.length > 22 ? (
              <Tooltip title={pathStr}>{pathStr.slice(0, 22) + '...'}</Tooltip>
            ) : (
              pathStr
            )}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="ID">{record.geid}</Descriptions.Item>
        <Descriptions.Item>
          <FileTags
            panelKey={panelKey}
            key={record.guid}
            pid={props.pid}
            record={record}
            guid={record.guid}
            geid={record.geid}
          />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default FileBasics;
