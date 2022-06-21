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
