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
import { serverAxios, serverAxiosNoIntercept } from './config';

export const getFilteredNotifications = async (username) => {
  const res = await serverAxios({
    url: `/v1/notifications?username=${username}&all=false`,
    method: 'GET',
    params: {
      page_size: 1000,
    },
  });
  res.data.result.result = res.data.result.result.sort((a, b) => {
    return (
      new Date(a.detail.maintenanceDate) - new Date(b.detail.maintenanceDate)
    );
  });
  return res;
};

export const postUnsubscribeNotifications = (username, notification_id) => {
  return serverAxios({
    url: `/v1/unsubscribe`,
    method: 'POST',
    data: {
      username,
      notification_id,
    },
  });
};

export const createNotification = (type, message, detail) => {
  return serverAxios({
    url: '/v1/notification',
    method: 'POST',
    data: {
      type,
      message,
      detail,
    },
  });
};

export const updateNotification = (id, type, message, detail) => {
  return serverAxios({
    url: `/v1/notification?id=${id}`,
    method: 'PUT',
    data: {
      type,
      message,
      detail,
    },
  });
};

export const deleteNotification = (id) => {
  return serverAxios({
    url: `/v1/notification?id=${id}`,
    method: 'DELETE',
  });
};

export const getAllNotifications = () => {
  return serverAxios({
    url: '/v1/notifications?all=true',
    method: 'GET',
    params: {
      page_size: 1000,
    },
  });
};
