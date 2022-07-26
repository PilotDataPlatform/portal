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
export const DataSourceType = {
  GREENROOM_HOME: 'GREENROOM_HOME',
  GREENROOM: 'GREENROOM',
  CORE: 'CORE',
  CORE_HOME: 'CORE_HOME',
  CORE_VIRTUAL_FOLDER: 'CORE_VIRTUAL_FOLDER',
  TRASH: 'TRASH',
};
export const PanelKey = {
  GREENROOM_HOME: 'greenroom-home',
  CORE_HOME: 'core-home',
  TRASH: 'trash',
  GREENROOM: 'greenroom',
  CORE: 'core'
};
export const TABLE_STATE = {
  NORMAL: 'NORMAL',
  COPY_TO_CORE: 'COPY_TO_CORE',
  VIRTUAL_FOLDER: 'VIRTUAL_FOLDER',
  DELETE: 'DELETE',
  MANIFEST_APPLY: 'MANIFEST_APPLY',
  ADD_TAGS: 'ADD_TAGS',
  ADD_TO_DATASETS: 'ADD_TO_DATASETS',
};

export const SYSTEM_TAGS = {
  COPIED_TAG: 'copied-to-core',
};
