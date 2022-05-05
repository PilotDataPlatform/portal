const mapProjectRoles = (role) => {
  switch (role) {
    case 'admin':
      return 'Project Administrator';
    case 'collaborator':
      return 'Project Collaborator';
    case 'contributor':
      return 'Project Contributor';
  }
};

module.exports = {
  mapProjectRoles
}