const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#3c7da6' },
            javascriptEnabled: true,
            math: 'always',
          },
        },
      },
    },
  ],
};
