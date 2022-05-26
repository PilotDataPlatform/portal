import React, { useState, useEffect } from 'react';

import { Pagination, Select } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import styles from './index.module.scss';

const { Option } = Select;

const Pages = (props) => {
  const { current, pageSize } = props;

  return (
    <span>
      {current}/{Math.ceil(props.total / pageSize)}
    </span>
  );
};

const CustomPagination = (props) => {
  const [pageSize, setPageSize] = useState(props.defaultSize);
  const [current, setCurrent] = useState(props.defaultPage);

  let pageSizeArr = [10, 20, 30, 50];

  const calcPageSize = () => {
    return Math.ceil(props.total / pageSize);
  };

  const changePageSize = (value) => {
    var info = { cur: 1, pageSize: value };
    props.onChange(info);
    setPageSize(value);
    setCurrent(1);
  };

  const goToPreview = () => {
    if (current > 1) {
      var info = { cur: current - 1, pageSize: pageSize };
      props.onChange(info);
      setCurrent(current - 1);
    }
  };

  const goToNext = () => {
    let totalPage = calcPageSize();
    if (current < totalPage) {
      var info = { cur: current + 1, pageSize: pageSize };
      props.onChange(info);
      setCurrent(current + 1);
    }
  };

  return (
    <div className={styles['pagination']}>
      <div className={styles['page-text']}>Per Page</div>
      <Select
        defaultValue="10"
        style={{ width: '6.9rem' }}
        onChange={changePageSize}
      >
        {props.showPageSize ? (
          pageSizeArr.map((v) => <Option value={v}>{v}</Option>)
        ) : (
          <Option disabled value={10}>
            10
          </Option>
        )}
      </Select>

      <div className={styles['page']}>
        <LeftOutlined
          className={styles['icon']}
          style={{ marginRight: '1rem' }}
          onClick={goToPreview}
        />
        <Pages {...props} current={current} pageSize={pageSize} />
        <RightOutlined
          className={styles['icon']}
          style={{ marginLeft: '1rem' }}
          onClick={goToNext}
        />
      </div>
    </div>
  );
};

export default CustomPagination;
