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
import { tokenTimer } from '../../Service/keycloak';
import { store } from '../../Redux/store';
import { Modal } from 'antd';
import _ from 'lodash';
import { keycloak } from '../../Service/keycloak';
import { namespace as serviceNamespace } from '../../Service/namespace';
import { broadcastManager } from '../../Service/broadcastManager';
import { tokenManager } from '../../Service/tokenManager';
import { BRANDING_PREFIX } from '../../config';

const debouncedBroadcastLogout = _.debounce(
  () => {
    broadcastManager.postMessage('logout', serviceNamespace.broadCast.LOGOUT);
  },
  5 * 1000,
  { leading: true, trailing: false },
);

// for logging out keycloak only
function logout() {
  // const { clearId } = store.getState();
  // tokenTimer.removeListener(clearId);
  Modal.destroyAll();
  tokenManager.clearCookies();
  debouncedBroadcastLogout();
  return keycloak
    .logout({ redirectUri: window.location.origin + BRANDING_PREFIX })
    .then((res) => {});
}

function refresh() {
  return keycloak.updateToken(-1);
}
function login() {
  return keycloak.login({ redirectUri: window.location.origin + '/landing' });
}

export { logout, refresh, login };
