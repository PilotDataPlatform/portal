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
