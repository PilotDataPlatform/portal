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
import React, { useEffect, useState } from 'react';
import { Collapse, Typography, Button } from 'antd';
import _ from 'lodash';
import FileBasics from './FileBasics';
import LineageGraph from './LineageGraph';
import { CloseOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fileExplorerTableActions } from '../../../Redux/actions';
import { FileManifest } from './FileManifest';
import {
  fileLineageAPI,
  getFileManifestAttrs,
  updateManifest,
} from '../../../APIs';
import LineageGraphModal from './LineageGraphModal';
const { Panel } = Collapse;
const { Title } = Typography;
export function SidePanel(props) {
  const { panelKey, reduxKey } = props;
  const dispatch = useDispatch();
  const propertyRecord = useSelector(
    (state) => state.fileExplorerTable[reduxKey]?.propertyRecord,
  );
  useEffect(() => {
    if (propertyRecord) {
      updateLineage(propertyRecord, 'INPUT');
    }
  }, [propertyRecord.globalEntityId]);
  const [recordWithLineage, setRecordWithLineage] = useState({});
  const [lineageModalVisible, setLineageModalVisible] = useState(false);
  const [lineageLoading, setLineageLoading] = useState(false);
  const [direction, setDirection] = useState('INPUT');
  async function updateLineage(record, direction) {
    try {
      const { geid } = record;
      let recordWithLineage = {};
      const res = await fileLineageAPI(geid, 'file_data', direction);
      const lineageData = res.data && res.data.result;
      const entities = lineageData && lineageData.guidEntityMap;

      for (const key in entities) {
        const entity = entities[key];
        if (
          entity &&
          entity.attributes.zone &&
          entity.attributes.zone.indexOf('Greenroom') !== -1
        ) {
          const data = [];
          data.push(entity.attributes.globalEntityId);
          const manifestRes = await getFileManifestAttrs(data, true);

          if (manifestRes.status === 200) {
            entity.fileManifests =
              manifestRes.data.result &&
              manifestRes.data.result[entity.attributes.globalEntityId];
          }
        }
      }

      recordWithLineage = { ...record, lineage: lineageData };
      setRecordWithLineage(recordWithLineage);
      setLineageLoading(false);
      setDirection(direction);
    } catch (error) {
      setLineageLoading(false);
    }
  }
  function handleLineageCancel(e) {
    setLineageModalVisible(false);
  }
  return (
    <div
      style={{
        width: 300,
        right: 0,
        minWidth: '180px',
        maxWidth: '500px',
        top: 10,
        padding: '10px 6px 0',
        borderLeft: '1px solid #f1f4f1',
        marginTop: -40,
        zIndex: 1,
        backgroundColor: '#fff',
      }}
    >
      <div style={{ position: 'relative' }}>
        <CloseOutlined
          onClick={() => {
            dispatch(
              fileExplorerTableActions.setPropertyRecord({
                geid: reduxKey,
                propertyRecord: null,
              }),
            );
            dispatch(
              fileExplorerTableActions.setSidePanelOpen({
                geid: reduxKey,
                param: false,
              }),
            );
          }}
          style={{
            zIndex: '99',
            float: 'right',
            marginTop: '11px',
          }}
        />
        <Title level={4} style={{ lineHeight: '1.9' }}>
          Properties
        </Title>
      </div>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="General" key="1">
          <FileBasics
            panelKey={panelKey}
            record={propertyRecord}
            pid={props.projectId}
          />
        </Panel>

        {!propertyRecord.nodeLabel.includes('Folder') && (
          <Panel header="File Attributes" key="Manifest">
            <FileManifest currentRecord={propertyRecord} />
          </Panel>
        )}
        {!propertyRecord?.nodeLabel?.includes('Folder') && (
          <Panel
            header={
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '80%',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                }}
              >
                Data Lineage Graph
              </span>
            }
            extra={
              <Button
                type="link"
                onClick={(event) => {
                  // If you don't want click extra trigger collapse, you can prevent this:
                  updateLineage(propertyRecord, 'INPUT');
                  setLineageModalVisible(true);
                  event.stopPropagation();
                }}
                style={{ padding: 0, height: 'auto' }}
              >
                <FullscreenOutlined />
              </Button>
            }
            key="2"
            style={{ position: 'relative' }}
          >
            <LineageGraph record={recordWithLineage} width={230} />
          </Panel>
        )}
      </Collapse>
      <LineageGraphModal
        visible={lineageModalVisible}
        record={recordWithLineage}
        handleLineageCancel={handleLineageCancel}
        updateLineage={updateLineage}
        loading={lineageLoading}
        setLoading={setLineageLoading}
        direction={direction}
        setDirection={setDirection}
      />
    </div>
  );
}
