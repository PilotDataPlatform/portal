import React from 'react';
import FilesContent from './FilesContent';
import { withRouter } from 'react-router-dom';
function FileExplorer() {
  return <FilesContent />;
}

export default withRouter(FileExplorer);
