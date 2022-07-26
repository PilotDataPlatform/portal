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
import { Table, Input, Button, Space, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './index.module.scss';
import { TABLE_STATE } from './RawTableValues';
import {
  checkIsVirtualFolder,
  checkGreenAndCore,
} from '../../../../../Utility';
import { connect } from 'react-redux';
import variables from '../../../../../Themes/base.scss';
class FilesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      page: 0,
      pageSize: 10,
      order: 'desc',
      sortColumn: 'createTime',
      selectedRowKeys: [],
      tags: [],
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tableResetMap && this.props.tableResetMap) {
      const previousResetNum = prevProps.tableResetMap[prevProps.panelKey]
        ? prevProps.tableResetMap[prevProps.panelKey]
        : null;
      const currentResetNum = this.props.tableResetMap[this.props.panelKey]
        ? this.props.tableResetMap[this.props.panelKey]
        : null;
      if (previousResetNum !== currentResetNum) {
        // empty params when user leave folder
        this.setState({
          page: 0,
          pageSize: 10,
          order: 'desc',
          sortColumn: 'createTime',
          searchedColumn: '',
          searchText: '',
          inputVisible: false,
          inputValue: '',
          tags: this.props.tags,
        });
        return;
      }
    }
  }

  getCurrentSourceType = () => {
    if (checkIsVirtualFolder(this.props.panelKey)) {
      if (this.props.currentRouting?.length === 0) {
        return 'collection';
      } else {
        return 'folder';
      }
    } else if (this.props.panelKey.toLowerCase().includes('trash')) {
      if (this.props.currentRouting?.length === 0) {
        return 'trash';
      } else {
        return 'folder';
      }
    }

    // this check is for table columns sorting and get source type when clicing on refresh button.
    if (
      checkGreenAndCore(this.props.panelKey) &&
      this.props.currentRouting?.length > 0
    ) {
      return 'folder';
    } else {
      return 'project';
    }
  };

  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.activePane !== nextProps.activePane) {
      const curSourceType = this.getCurrentSourceType();
      const parentInfo = this.props.getParentPathAndId();
      const params = {
        ...parentInfo,
        page: this.state.page,
        pageSize: this.state.pageSize,
        orderBy: this.state.sortColumn,
        orderType: this.state.order,
        sourceType: curSourceType,
      };
      if (curSourceType === 'folder' && this.props.currentRouting?.length) {
        params.node = {
          nodeLabel:
            this.props.currentRouting[this.props.currentRouting.length - 1]
              .labels,
        };
      }
      // update table
      this.props.updateTable(params);
    }
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
            // if(!this.clearFilters) this.clearFilters = clearFilters;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? variables.primaryColorLight1 : undefined,
          top: '60%',
        }}
      />
    ),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.select();
        }, 100);
      }
    },
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
  };

  onChange = (pagination, filters, sorter) => {
    let order = 'asc';

    if (sorter && sorter.order !== 'ascend') order = 'desc';

    this.setState({ page: pagination.current - 1 });

    if (sorter) {
      this.setState({
        sortColumn: sorter.columnKey,
        order,
      });
    }

    if (pagination.pageSize) this.setState({ pageSize: pagination.pageSize });

    let searchText = [];
    // eslint-disable-next-line
    let isSearchingFile = false;

    if (filters.fileName && filters.fileName.length > 0) {
      isSearchingFile = true;

      searchText.push({
        key: 'fileName',
        value: filters.fileName[0],
      });
    }

    if (filters.owner && filters.owner.length > 0) {
      isSearchingFile = true;

      searchText.push({
        value: filters.owner[0],
        key: 'owner',
      });
    }

    this.setState({ searchText: searchText });

    const curSourceType = this.getCurrentSourceType();
    const parentInfo = this.props.getParentPathAndId();
    const params = {
      ...parentInfo,
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      orderBy: sorter.columnKey,
      orderType: order,
      query: convertFilter(searchText),
      sourceType: curSourceType,
    };
    if (curSourceType === 'folder' && this.props.currentRouting.length) {
      params.node = {
        nodeLabel:
          this.props.currentRouting[this.props.currentRouting.length - 1]
            .labels,
      };
    }
    // update table
    this.props.updateTable(params);
  };

  render() {
    const { page, pageSize } = this.state;
    const { totalItem } = this.props;

    const columns =
      this.props.columns &&
      this.props.columns.map((el) => {
        if (el.searchKey) {
          return {
            ...el,
            ...this.getColumnSearchProps(el.searchKey),
          };
        }
        return el;
      });
    return (
      <div>
        {
          /* this.props.tableLoading ? (
          <Spin
            tip="Loading..."
            style={{ width: '100%', height: '100%', margin: '20% auto' }}
            size="large"
          />
        ) : */ <Table
            id={`files_table`}
            columns={columns}
            dataSource={this.props.dataSource}
            onChange={this.onChange}
            pagination={{
              current: page + 1,
              pageSize,
              total: totalItem,
              pageSizeOptions: ['10', '20', '50'],
              showSizeChanger: true,
            }}
            loading={this.props.tableLoading}
            className={styles.files_raw_table}
            tableLayout={'fixed'}
            rowKey={(record) => record.geid}
            rowSelection={{ ...this.props.rowSelection, columnWidth: 40 }}
            key={this.props.tableKey}
            rowClassName={(record) => {
              let classArr = [];
              if (
                record.name &&
                this.props.selectedRecord?.name === record.name
              ) {
                classArr.push('selected');
              }
              if (
                record.manifest &&
                record.manifest.length !== 0 &&
                this.props.tableState === TABLE_STATE.MANIFEST_APPLY
              ) {
                classArr.push('manifest-attached');
              }
              return classArr.join(' ');
            }}
          />
        }
      </div>
    );
  }
}

/**
 *
 * @param {array} searchText
 * @returns
 */
const convertFilter = (searchText) => {
  const filters = {};

  if (searchText.length > 0) {
    for (const item of searchText) {
      filters[item.key] = item.value;
    }
  }
  return filters;
};

export default connect((state) => ({
  tableResetMap: state.fileExplorer.tableResetMap,
}))(FilesTable);
