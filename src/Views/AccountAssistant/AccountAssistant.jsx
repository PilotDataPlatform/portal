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
import { Layout } from 'antd';
import { accountAssistant as routes } from '../../Routes/index';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

function Support(props) {

  const match = useRouteMatch();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Switch>
        {routes.map((item) => (
          <Route
            exact={item.exact || false}
            path={match.url + item.path}
            key={item.path}
            render={(props) => <item.component />}
          ></Route>
        ))}
      </Switch>
    </Layout>
  );
}

export default Support;
