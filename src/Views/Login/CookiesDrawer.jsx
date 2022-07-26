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
import { Drawer, Checkbox, Button } from 'antd';

const CookiesDrawer = ({ onDrawerClose, cookiesDrawer }) => {
  return (
    <Drawer
      title="Cookies on this site"
      placement="right"
      closable={false}
      onClose={onDrawerClose}
      visible={cookiesDrawer}
    >
      <p>
        We use <strong>following strictly necessary cookies</strong> to fulfil
        the site functionality. These are not tracking cookies.
      </p>
      <p>
        <strong>Access token</strong> : An encoded token that is used to mark
        user's identity and access to services.
      </p>
      <p>
        <strong>Refresh token</strong>: An encoded token that is used to refresh
        user's session.
      </p>
      <p>
        <strong>Username</strong> : Username of the current user.
      </p>
      <p>
        <strong>Login status</strong> : A boolean that marks whether a user is
        logged in.
      </p>
      <p>
        <strong>Cookies notification</strong> : A boolean that marks whether a
        user has seen the cookies notification.
      </p>
      <br />
      <p>Explainations about other cookies, if any.</p>
      <p>The site is currently using following cookies:</p>
      <Checkbox checked={true} disabled={true}>
        Strictly necessary cookies
      </Checkbox>
      <br />
      <br />
      <Button onClick={onDrawerClose} type="primary" size="small">
        OK
      </Button>
    </Drawer>
  );
};

export default CookiesDrawer;
