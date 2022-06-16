const CracoLessPlugin = require('craco-less');
const antdTheme = require('./src/Themes/antd');
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: antdTheme,
            javascriptEnabled: true,
            math: 'always',
          },
        },
      },
    },
  ],
};
