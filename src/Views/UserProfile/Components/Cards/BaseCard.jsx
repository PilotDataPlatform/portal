import React from 'react';
import { Card } from 'antd';

import styles from '../../index.module.scss';

function BaseCard ({ title, extra, className, children }) {
  return (
    <Card
      title={title}
      extra={extra}
      className={className ? className : styles['user-profile__card']}
    >
      { children }
    </Card>
  );
}

export default BaseCard;