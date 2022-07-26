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

import { SET_DELETE_LIST, UPDATE_DELETE_LIST } from '../actionTypes';
import datasetList from './datasetList';

const init = [];

function deletedFileList(state = init, action) {
  const { type, payload } = action;

	switch (type) {
		case SET_DELETE_LIST:
			return payload;
		case UPDATE_DELETE_LIST:
			const deleteList = state;

			for (const updated of payload) {
				for (const item of deleteList) {
					if (updated.fileName === item.fileName) {
						item.status = updated.status;
						item.action = 'data_delete';
					} else {
						const isExist = deleteList.find(el => el.fileName === updated.fileName);

						updated.action = 'data_delete';
						if (!isExist) deleteList.push(updated);
					}
				}
			}

			return deleteList;
		default: {
			return state;
		}
	}
}

export default deletedFileList;