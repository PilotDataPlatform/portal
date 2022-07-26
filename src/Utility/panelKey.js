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
 *
 * @param {string} panelKey the current open panel key
 * @returns {boolean} true if the current panel is a virtual folder
 */
export const checkIsVirtualFolder = (panelKey) => {
  if (!panelKey) {
    return false;
  }
  return !(
    panelKey.includes('trash') ||
    panelKey.startsWith('greenroom') ||
    panelKey.startsWith('core')
  );
};

export const checkUserHomeFolder = (tabPanelKey) => {
  return tabPanelKey === 'greenroom-home' || tabPanelKey === 'core-home';
};

export const checkRootFolder = (tabPanelKey) => {
  return tabPanelKey === 'greenroom' || tabPanelKey === 'core';
};

export const checkGreenAndCore = (tabPanelKey) => {
  return checkUserHomeFolder(tabPanelKey) || checkRootFolder(tabPanelKey);
};