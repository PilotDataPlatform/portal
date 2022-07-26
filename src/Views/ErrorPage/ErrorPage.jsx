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
import { StandardLayout } from '../../Components/Layout';
import { errorPageRoutes as routes } from '../../Routes/index';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
function ErrorPage(props) {
  const {
    match: { path },
  } = props;
  const config = {
    observationVars: [],
    initFunc: () => {},
  };
  return (
    <StandardLayout {...config}>
      <Switch>
        {routes.map((item) => (
          <Route
            exact={item.exact || false}
            path={path + item.path}
            key={item.path}
            render={() => <item.component />}
          ></Route>
        ))}
        <Redirect to="/error/404" />
      </Switch>
    </StandardLayout>
  );
}

export default withRouter(ErrorPage);
