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
import React, { useEffect, useState } from 'react';
import { Modal, Typography } from 'antd';
import styles from './terms.module.scss';
import axios from 'axios';
import { PORTAL_PREFIX } from '../../config';
const { Title } = Typography;

function TermsOfUseModal(props) {
  const [html, setHtml] = useState('');
  useEffect(() => {
    axios(`${PORTAL_PREFIX}/files/terms-of-use.html`)
      .then((res) => {
        setHtml(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Modal
      title="Platform Terms of Use Agreement"
      visible={props.visible}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
      width={'70%'}
      // bodyStyle={{ maxHeight: '68vh', overflow: 'scroll' }}
      footer={props.footer}
      maskClosable={false}
      zIndex="1020"
      className={styles.terms_modal}
    >
      <div
        style={{ overflowY: 'scroll', height: '60vh' }}
        onScroll={props.handleScroll}
        dangerouslySetInnerHTML={{__html: html}}
      ></div>
    </Modal>
  );
}

export default TermsOfUseModal;
