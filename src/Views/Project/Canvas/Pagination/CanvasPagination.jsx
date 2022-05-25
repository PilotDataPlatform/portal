import React, { useState, useEffect } from 'react';

import { Pagination, Select } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import styles from './index.module.scss';

const { Option } = Select;

const withHiddenProp = (WrappedComponent) => {
  const MyComponent = (props) => {
    const [pageSize, setPageSize] = useState(props.defaultSize);
    const [current, setCurrent] = useState(props.defaultPage);

    let pageSizeArr = [10, 20, 30, 50];

    const calcPageSize = () => {
      return Math.ceil(props.fileLength / pageSize);
    };

    const changePageSize = (value) => {
      var info = { cur: current, pageSize: value };
      props.onChange(info);
      setPageSize(value);
    };

    const goToPreview = () => {
      if (current > 1) {
        var info = { cur: current - 1, pageSize: pageSize };
        props.onChange(info);
        setCurrent(current - 1);
      }
    };

    const goToNext = () => {
      let total = calcPageSize();
      if (current < total) {
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
          {pageSizeArr.map((v) => (
            <Option value={v}>{v}</Option>
          ))}
        </Select>

        <div className={styles['page']}>
          <LeftOutlined
            className={styles['icon']}
            style={{ marginRight: '1rem' }}
            onClick={goToPreview}
          />
          <WrappedComponent {...props} current={current} page={pageSize} />
          <RightOutlined
            className={styles['icon']}
            style={{ marginLeft: '1rem' }}
            onClick={goToNext}
          />
        </div>
      </div>
    );
  };

  return MyComponent;
};

const CanvasPageination = (props) => {
  const { current, page } = props;

  return (
    <span>
      {current}/{Math.ceil(props.fileLength / page)}
    </span>
  );
};

const CanvasPageinationWithCustom = withHiddenProp(CanvasPageination);

export default CanvasPageinationWithCustom;
