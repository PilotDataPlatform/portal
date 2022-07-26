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
import _ from 'lodash';
import { broadcastManager } from '../Service/broadcastManager';
import { namespace as serviceNamespace } from '../Service/namespace';

const actionType = 'touchmove';
const proxyActionType = 'keydown';

const debouncedBroadcastAction = _.debounce(() => {
    broadcastManager.postMessage('refresh', serviceNamespace.broadCast.ONACTION);
  }, 1000 * 5, { leading: true, trailing: false });

const broadcastAction = ()=>{
    document.dispatchEvent(new Event(actionType));
};

const keepAlive = ()=>{
    document.dispatchEvent(new Event(proxyActionType));
}


export {actionType,broadcastAction,keepAlive,debouncedBroadcastAction};