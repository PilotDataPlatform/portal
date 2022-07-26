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
import Login from '../Views/Login/Auth';
import LandingPageLayout from '../Views/ProjectLandingPage/LandingPageLayout';
import Project from '../Views/Project/Project';
import DatasetLandingPage from '../Views/DatasetLandingPage/DatasetLandingPage';
import Dataset from '../Views/Dataset/Dataset';
import UserProfile from '../Views/UserProfile/UserProfile';

import ErrorPage from '../Views/ErrorPage/ErrorPage';
import General404Page from '../Views/GeneralPage/General404Page';
import SelfRegistration from '../Views/Self-Registration/Self-Registration';
import AccountAssistant from '../Views/AccountAssistant/AccountAssistant';
import PlatformManagement from '../Views/PlatformManagement/PlatformManagement';
// render whenever user is authorized
const authedRoutes = [
  {
    path: '/landing',
    component: LandingPageLayout,
    protectedType: 'isLogin',
  },
  {
    path: '/project/:projectCode',
    component: Project,
    protectedType: 'isLogin',
  },
  {
    path: '/users',
    component: PlatformManagement,
    protectedType: 'PlatformAdmin',
  },
  {
    path: '/datasets',
    component: DatasetLandingPage,
    protectedType: 'isLogin',
  },
  {
    path: '/dataset/:datasetCode',
    component: Dataset,
    protectedType: 'isLogin',
  },
  {
    path: '/user-profile',
    component: UserProfile,
    protectedType: 'isLogin',
  },
  { path: '/error', component: ErrorPage, protectedType: 'isLogin' },
];
// render whenever user is unauthorized
const unAuthedRoutes = [
  {
    path: '/login',
    component: Login,
    protectedType: 'unLogin',
    exact: true,
  },
  {
    path: '/account-assistant',
    component: AccountAssistant,
    protectedType: 'unLogin',
  },

  {
    path: '/self-registration/:invitationHash',
    component: SelfRegistration,
    protectedType: 'unLogin',
  },
  {
    path: '/404',
    component: General404Page,
    exact: true,
  },
];

export { authedRoutes, unAuthedRoutes };
