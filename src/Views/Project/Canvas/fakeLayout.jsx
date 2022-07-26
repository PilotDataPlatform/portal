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
const info = {
  type: 'info',
  key: '0',
  title: 'Project Information',
  content:
    'stands for GErman NEtwork for Research on AuToimmune Encephalitis. Our mission is to address the medical community working on autoimmuneencephalitis as well as all patients and their relatives touched by this condition.',
  expandable: false,
  exportable: false,
};

const charts = {
  type: 'charts',
  key: '1',
  title: 'Charts',
  defaultSize: 'm',
  expandable: false,
  exportable: false,
};

const fileStats = {
  type: 'fileStats',
  key: '2',
  title: 'Go To',
  defaultSize: 'm',
  expandable: false,
  exportable: false,
};

const files = {
  type: 'files',
  key: '1',
  title: 'File Explorer',
  defaultSize: 'm',
  expandable: true,
  exportable: false,
};

const userStats = {
  type: 'userStats',
  key: '3',
  title: 'Recent File Stream',
  content: 'hello',
  defaultSize: 'm',
  expandable: false,
  exportable: false,
};

const superset = {
  type: 'superset',
  key: '4',
  title: 'Superset',
  defaultSize: 'm',
  expandable: false,
  exportable: false,
};

const cardsAttr = {
  initial: [],
  //admin: [info, fileStats, files, userStats,superset],
  admin: [fileStats, charts, userStats],
  contributor: [
    fileStats,
    {
      ...userStats,
      title: 'Recent File Stream',
    },
    charts,
  ],
  collaborator: [
    fileStats,
    {
      ...userStats,
      title: 'Recent File Stream',
    },
    charts,
  ],
  member: [
    info,
    {
      ...userStats,
      title: 'Recent File Stream',
    },
    charts,
  ],
};

export default cardsAttr;
