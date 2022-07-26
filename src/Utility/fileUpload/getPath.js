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
/**
 * return empty for multi files upload. return path to file for folder upload(no starting and ending /, no filename`)
 * @param {string} path 
 */
export const getPath = (path) => {
    if (path === "") {
        return path
    };
    const pathArr = path.split('/');
    const pathArrSliced = pathArr.slice(0, pathArr.length - 1);
    return pathArrSliced.join('/');
}