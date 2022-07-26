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
import { SHOW_SERVICE_REQUEST_RED_DOT } from '../actionTypes';

const initData = {
    showRedDot: false
}

const serviceRequestRedDot = (state = initData, action) => {
    switch (action.type) {
        case SHOW_SERVICE_REQUEST_RED_DOT:
            return {
                ...state,
                showRedDot: action.payload
            }
        default: {
            return state;
        }
    }
}

export default serviceRequestRedDot;