import { serverAxios, serverAxiosNoIntercept } from './config';

export const getFilteredNotifications = (username) => {
  return serverAxios({
    url: `/v1/notifications?username=${username}&all=false`,
    method: 'GET',
    params: {
      page_size: 1000,
    },
  });
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
