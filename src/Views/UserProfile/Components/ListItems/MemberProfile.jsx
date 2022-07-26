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
