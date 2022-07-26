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
import { NOTIFICATIONS } from '../actionTypes';

const initData = {
  activeNotification: null,
  createNewNotificationStatus: false,
  userNotifications: [],
  notificationList: [],
  updateNotificationTimes: 0,
  edit: false,
};

const notificationReducer = (state = initData, action) => {
  switch (action.type) {
    case NOTIFICATIONS.SET_ACTIVE_NOTIFICATION:
      return { ...state, activeNotification: action.payload };
    case NOTIFICATIONS.SET_CREATE_NEW_NOTIFICATION_LIST_ITEM__STATUS:
      return { ...state, createNewNotificationStatus: action.payload };
    case NOTIFICATIONS.SET_USER_NOTIFICATIONS:
      return { ...state, userNotifications: action.payload };
    case NOTIFICATIONS.SET_NOTIFICATION_LIST:
      return { ...state, notificationList: action.payload };
    case NOTIFICATIONS.SET_UPDATE_NOTIFICATION_TIMES:
      return { ...state, updateNotificationTimes: action.payload };
    case NOTIFICATIONS.SET_EDIT_NOTIFICATION:
      return { ...state, edit: action.payload };
    default:
      return state;
  }
};

export default notificationReducer;
