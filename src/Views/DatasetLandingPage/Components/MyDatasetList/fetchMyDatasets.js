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
import { getDatasetsListingAPI } from '../../../../APIs';
import { store } from '../../../../Redux/store';
import { myDatasetListCreators } from '../../../../Redux/actions';
import { message } from 'antd';
import i18n from '../../../../i18n';
import _ from 'lodash';

const dispatch = store.dispatch;

/**
 *
 * @param {string} username
 * @param {number} page the frontend starts from 1, the backend starts from 0
 * @param {number} pageSize
 */
export const fetchMyDatasets = (username, page = 1, pageSize) => {
  if (!_.isNumber(page)) {
    throw new TypeError('page should be a number');
  }
  if (!_.isNumber(pageSize)) {
    throw new TypeError('pageSize should be a number');
  }
  dispatch(myDatasetListCreators.setLoading(true));
  getDatasetsListingAPI(username, {
    filter: {},
    order_by: 'time_created',
    order_type: 'desc',
    page: page - 1,
    page_size: pageSize,
  })
    .then((res) => {
      dispatch(myDatasetListCreators.setDatasets(res.data.result));
      dispatch(myDatasetListCreators.setTotal(res.data.total));
    })
    .catch((err) => {
      if (err.response?.status === 500) {
        message.error(i18n.t('errormessages:getDatasets.500.0'));
      } else {
        message.error(i18n.t('errormessages:getDatasets.default.0'));
      }
    })
    .finally(() => {
      dispatch(myDatasetListCreators.setLoading(false));
    });
};
