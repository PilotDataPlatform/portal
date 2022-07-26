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
import ForgotPassword from '../Views/AccountAssistant/ForgotPassword';
import ForgotPasswordConfirmation from '../Views/AccountAssistant/ForgotPasswordConfirmation';
import ForgotUsernameConfirmation from '../Views/AccountAssistant/ForgotUsernameConfirmation';
import ForgotUsername from '../Views/AccountAssistant/ForgotUsername';

const routes = [
  {
    path: '/forgot-username',
    component: ForgotUsername,
  },
  {
    path: '/confirmation',
    component: ForgotPasswordConfirmation,
  },
  {
    path: '/forgot-username-confirmation',
    component: ForgotUsernameConfirmation,
  },
  { path: '/', component: ForgotPassword },
];

export default routes;
