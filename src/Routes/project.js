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
import Canvas from '../Views/Project/Canvas/Canvas';
import Teams from '../Views/Project/Teams/Teams';
import Settings from '../Views/Project/Settings/Settings';
import Search from '../Views/Project/Search/Search';
import Announcement from '../Views/Project/Announcement/Announcement';
import RequestToCore from '../Views/Project/RequestToCore/RequestToCore';
import FileExplorer from '../Views/Project/FileExplorer/FileExplorer';

const routes = [
  {
    path: '/data',
    component: FileExplorer,
    protectedType: 'projectMember',
  },
  {
    path: '/canvas',
    component: Canvas,
    protectedType: 'projectMember', // Both admin and uploader could access
  },
  {
    path: '/teams',
    component: Teams,
    protectedType: 'projectAdmin',
  },
  {
    path: '/settings',
    component: Settings,
    protectedType: 'projectAdmin',
  },
  {
    path: '/search',
    component: Search,
    protectedType: 'projectMember',
  },
  {
    path: '/announcement',
    component: Announcement,
    protectedType: 'projectMember',
  },
  {
    path: '/requestToCore',
    component: RequestToCore,
    protectedType: 'projectCollab',
  },
];

export default routes;
