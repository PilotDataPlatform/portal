import React, { useState } from 'react';
import { Table, Button, Collapse, Radio, Spin } from 'antd';
import SearchResultCard from './SearchResultCard';
import DataSetsModal from '../../Canvas/Charts/FileExplorer/Plugins/Datasets/DatasetsModal';
import styles from '../index.module.scss';
import { useCurrentProject } from '../../../../Utility';
import {
  HomeOutlined,
  CloudServerOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';

const { Panel } = Collapse;

function SearchResultTable({
  files,
  page,
  setPage,
  pageSize,
  zone,
  setFilters,
  onTableChange,
  loading,
  attributeList,
  searchConditions,
  greenRoomTotal,
  coreTotal,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDataSetsModal, setShowDataSetsModal] = useState(false);
  const currentProject = useCurrentProject();

  const currentProjectRole = currentProject[0].permission;
  const columns = [
    {
      title: '',
      dataIndex: 'index',
      render: (text, record) => (
        <SearchResultCard
          record={record}
          attributeList={attributeList}
          searchConditions={searchConditions}
        />
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },

    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  const locationOnChange = (e) => {
    setFilters({ zone: e.target.value.toLowerCase() });
    setPage(0);
  };

  const openDatasetsModal = () => {
    setShowDataSetsModal(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.search_result_actions}>
        {zone === 'core' ? (
          <Button
            type="link"
            icon={<DeploymentUnitOutlined />}
            disabled={selectedRows.length ? false : true}
            onClick={() => {
              openDatasetsModal();
            }}
          >
            Add to Datasets
          </Button>
        ) : null}

        {['admin', 'collaborator'].includes(currentProjectRole) ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '60px',
              marginTop: '6px',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <span style={{ margin: '0px 0px 0px 10px', cursor: 'pointer' }}>
              Location:
            </span>

            <Radio.Group
              style={{ marginLeft: 10 }}
              value={zone}
              onChange={locationOnChange}
            >
              <Radio value="greenroom" style={{ marginRight: '50px' }}>
                <HomeOutlined style={{ margin: '0px 5px 0px 3px' }} /> Green
                Room{' '}
                {typeof greenRoomTotal === 'number' ? (
                  <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                    {greenRoomTotal}
                  </span>
                ) : (
                  '-'
                )}
              </Radio>
              <Radio value="Core">
                <CloudServerOutlined style={{ margin: '0px 5px 0px 3px' }} />
                Core{' '}
                {typeof coreTotal === 'number' ? (
                  <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                    {coreTotal}
                  </span>
                ) : (
                  '-'
                )}
              </Radio>
            </Radio.Group>
          </div>
        ) : null}
        <DataSetsModal
          visible={showDataSetsModal}
          setVisible={setShowDataSetsModal}
          selectedRows={selectedRows}
        />
      </div>
      <div className={styles.search_result_table}>
        <div style={{ flex: 1 }}>
          <Spin spinning={loading}>
            <Table
              rowSelection={{
                ...rowSelection,
              }}
              className={styles.search_result_table}
              columns={columns}
              dataSource={files[zone]}
              pagination={{
                total: zone === 'greenroom' ? greenRoomTotal : coreTotal,
                pageSize: pageSize,
                current: page + 1,
                showSizeChanger: true,
              }}
              onChange={onTableChange}
            />
          </Spin>
        </div>
      </div>
    </div>
  );
}
export default SearchResultTable;
