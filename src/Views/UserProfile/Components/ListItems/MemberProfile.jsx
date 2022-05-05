import React from 'react';
import { Row, Col } from 'antd';
import styles from '../../index.module.scss';

import { formatDate } from '../../../../Utility/timeCovert';

const MemberProfile = ({ user, layout }) => {
  return (
    <ul className={styles[`member__content--${layout}`]}>
      <li className={styles['content__user-meta']}>
        <Row>
          <Col>
            <span>Username</span>
            <span>{user.username}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>First Name</span>
            <span>{user.firstName}</span>
          </Col>
          <Col>
            <span>Last Name</span>
            <span>{user.lastName}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>Email</span>
            <span>{user.email}</span>
          </Col>
        </Row>
      </li>
      <li className={styles['content__user-login']}>
        <Row>
          <Col>
            <span>Join Date</span>
            <span>{formatDate(user.createdTimestamp)}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>Last Login</span>
            <span>{formatDate(user.attributes?.lastLogin)}</span>
          </Col>
        </Row>
      </li>
    </ul>
  );
};

export default MemberProfile;
