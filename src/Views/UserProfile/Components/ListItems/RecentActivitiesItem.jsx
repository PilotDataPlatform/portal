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
import { Row, Col } from 'antd';
import {
  MailOutlined,
  CloseOutlined,
  RetweetOutlined,
  CheckOutlined,
  ExclamationOutlined,
} from '@ant-design/icons';

import { timeConvert } from '../../../../Utility/timeCovert';
import { mapProjectRoles } from '../../utils';
import styles from '../../index.module.scss';

const RecentActivitiesItem = ({ activity }) => {
  const appendActionDescription = (activity) => {
    const Action = ({
      description = activity.detail.projectName,
      detail,
      icon,
    }) => (
      <div>
        <Row>
          <Col>{icon}</Col>
          <Col className={styles['action__action-description']}>
            <span>{description}</span>
            {detail && (
              <span className={styles['action__action-detail']}>{detail}</span>
            )}
          </Col>
        </Row>
      </div>
    );

    switch (activity.eventType) {
      case 'INVITE_TO_PLATFORM':
        return (
          <Action
            description={`Invited as ${activity.detail.platformRole === 'admin' ? 'Platform Admin' : 'Platform Member'}`}
            detail={<em>{`by ${activity.operator}`}</em>}
            icon={<MailOutlined />}
          />
        );
      case 'INVITE_TO_PROJECT':
        return (
          <Action
            detail={
              <>
                {`Invited as ${mapProjectRoles(activity.detail.projectRole)} - `}
                <em>{`by ${activity.operator}`}</em>
              </>
            }
            icon={<MailOutlined />}
          />
        );
      case 'REMOVE_FROM_PROJECT':
        return (
          <Action
            detail={
              <>
                {`Removed from Project - `}
                <em>{`by ${activity.operator}`}</em>
              </>
            }
            icon={<CloseOutlined />}
          />
        );
      case 'ACCOUNT_DISABLE':
        return (
          <Action
            description="Account Disabled"
            detail={<em>{`by ${activity.operator}`}</em>}
            icon={<CloseOutlined />}
          />
        );
      case 'ROLE_CHANGE':
        return (
          <Action
            icon={<RetweetOutlined />}
            detail={
              <>
                {`Role changed from ${mapProjectRoles(activity.detail.from)} to ${mapProjectRoles(activity.detail.to)} - `}{' '}
                <em>{`by ${activity.operator}`}</em>
              </>
            }
          />
        );
      case 'ACCOUNT_ACTIVATED':
        return (
          <Action description="Account Activated" icon={<CheckOutlined />} />
        );
      default:
        return (
          <Action
            icon={<ExclamationOutlined />}
            description="Unrecognized Action"
          />
        );
    }
  };

  return (
    <li className={styles['activities-log__activity-item']}>
      <Row>
        <Col flex="0 0 150px">
          <span>
            {timeConvert(activity.timestamp, 'datetime')}
          </span>
        </Col>
        <Col className="activity-item__action">
          {appendActionDescription(activity)}
        </Col>
      </Row>
    </li>
  );
};

export default RecentActivitiesItem;
