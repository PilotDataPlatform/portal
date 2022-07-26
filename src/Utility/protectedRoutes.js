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
export default function protectedRoutes(
  type,
  isLogin,
  projectCode,
  permissions,
  platformRole,
) {
  let containerCode = projectCode;
  isLogin = Boolean(isLogin);

  switch (type) {
    case 'isLogin': {
      if (!isLogin) return isLogin;
      if (containerCode && permissions) {
        let p = permissions.find((i) => {
          return i.code === projectCode;
        });
        if (!p) {
          if (platformRole === 'admin') {
            return '404';
          } else {
            return '403';
          }
        }
      }
      return isLogin;
    }
    case 'unLogin': {
      return !isLogin;
    }
    case 'projectAdmin': {
      if (containerCode && permissions) {
        let p = permissions.filter((i) => {
          return i.code === projectCode;
        });
        return p[0] && p[0]['permission'] === 'admin' ? true : '403';
      }
      return true;
    }
    case 'projectMember': {
      if (containerCode && permissions) {
        let p = permissions.filter((i) => {
          return i.code === projectCode;
        });
        return (p[0] && p[0]['permission'] === 'admin') ||
          (p[0] && p[0]['permission'])
          ? true
          : '403';
      }
      return true;
    }
    case 'projectCollab': {
      if (containerCode && permissions) {
        let p = permissions.filter((i) => {
          return i.code === projectCode;
        });
        return (p[0] && p[0]['permission'] === 'admin') ||
          (p[0] && p[0]['permission'] === 'collaborator')
          ? true
          : '403';
      }
      return true;
    }
    case 'PlatformAdmin': {
      if (platformRole === 'admin') {
        return true;
      } else {
        return '403';
      }
    }
    default: {
      return true;
    }
  }
}
