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
const broadCast = {
    "USER_CLICK_LOGIN": "USER_CLICK_LOGIN",
    "CLICK_HEADER_LOGOUT": "CLICK_HEADER_LOGOUT",
    'CLICK_REFRESH_MODAL': 'CLICK_REFRESH_MODAL',
    "AUTO_REFRESH": 'AUTO_REFRESH',
    "REFRESH_MODAL_LOGOUT": "REFRESH_MODAL_LOGOUT",
    "ONACTION": "ONACTION",
    "LOGOUT": "LOGOUT"
}

Object.entries(broadCast).forEach(([key, value]) => {
    broadCast[key] = "BROADCAST_" + value;
});

export { broadCast };