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
import {BroadcastChannel} from 'broadcast-channel';
import {namespace as ServiceNamespace} from '../namespace';
const { detect } = require('detect-browser');
const browser = detect();
const isSafari = browser?.name === 'safari';
class BroadCastManager {
    constructor() {
        this._loginChannel = new BroadcastChannel('login',isSafari?{type:'localstorage'}:{});
        this._logoutChannel = new BroadcastChannel('logout',isSafari?{type:'localstorage'}:{});
        this._refreshChannel = new BroadcastChannel('refresh',isSafari?{type:'localstorage'}:{});
        this._loginListeners = [];
        this._logoutListeners = [];
        this._refreshListeners = [];
        this._loginChannel.onmessage = ({ msg, namespace }) => {
            this._loginListeners.forEach(func => {
                func(msg, namespace);
            });
        }
        this._logoutChannel.onmessage = ({ msg, namespace }) => {
            this._logoutListeners.forEach(func => {
                func(msg, namespace);
            });
        }
        this._refreshChannel.onmessage = ({ msg, namespace }) => {
            this._refreshListeners.forEach(func => {
                func(msg, namespace);
            });
        }

    }

    /**
     * listen to the the broadcast channel that specified by channel parameter
     * @param {"login"|"logout"|"refresh"} channel the broadcast channel you're listening to
     * @param {(msg:string,namespace:string)=>void} func  will get the message and the namespace, indicating where the posMessage method is called in another tab
     */
    addListener(channel, func) {
        switch (channel) {
            case 'login': {
                this._loginListeners.push(func);
                break;
            }
            case 'logout': {
                this._logoutListeners.push(func);
                break;
            }
            case 'refresh': {
                this._refreshListeners.push(func);
                break;
            } default: {
                throw new Error(`the channel should be 'login'|'logout'|'refresh'`)
            }
        }
    }

    /**
     * post a message to the broadcast channel
     * @param {"login"|"logout"|"refresh"} channel the channel you want to post message
     * @param {string} namespace a unique namespace to locate where the postMessage method was called
     * @param {string} msg the message you want to broadcast, usually the username
     */
    postMessage(channel, namespace, msg) {
        if(!Object.values(ServiceNamespace.broadCast).includes(namespace)){
            throw new Error('the namespace is not defined on broadcast namespace file');
        }
        if (typeof namespace!=='string') {
            throw new Error('a unique namespace is necessary')
        }
        switch (channel) {
            case 'login': {
                this._loginChannel.postMessage({ msg, namespace });
                break;
            }
            case 'logout': {
                this._logoutChannel.postMessage({ msg, namespace });
                break;
            }
            case 'refresh': {
                this._refreshChannel.postMessage({ msg, namespace });
                break;
            } default: {
                throw new Error(`the channel should be 'login'|'logout'|'refresh'`)
            }
        }
    }


}

const broadcastManager = new BroadCastManager();
export {broadcastManager};