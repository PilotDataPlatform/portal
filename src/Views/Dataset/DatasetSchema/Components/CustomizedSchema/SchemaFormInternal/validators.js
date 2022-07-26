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
import _ from 'lodash'

export const validators = {
  templateName: (templates) => {
    return [
      {
        validator: async (rule, value) => {
          const isDuplicated = _.find(templates, (item) => value === item.name);
          if (isDuplicated) {
            return Promise.reject(`The template name has been taken`);
          }
          return Promise.resolve();
        },
      },
      {
        validator: async (rule, value) => {
          if (!value) {
            return Promise.reject('The template name is required');
          }
          const regex = new RegExp(/^(.){1,30}$/);
          if (!regex.test(value)) {
            return Promise.reject(
              'The template name can only contains 1-30 characters',
            );
          }
          return Promise.resolve();
        },
      },
    ];
  },
};
