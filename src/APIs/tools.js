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
import { serverAxios as axios } from './config';

function sendEmailToAll(subject, messageBody) {
  return axios({
    url: '/v1/email',
    method: 'POST',
    timeout: 100 * 1000,
    data: {
      subject: subject,
      send_to_all_active: true,
      message_body: messageBody,
    },
  });
}

function sendEmails(subject, messageBody, emails) {
  return axios({
    url: '/v1/email',
    method: 'POST',
    timeout: 100 * 1000,
    data: {
      subject: subject,
      send_to_all_active: false,
      message_body: messageBody,
      emails: emails,
    },
  });
}
export { sendEmailToAll, sendEmails };
