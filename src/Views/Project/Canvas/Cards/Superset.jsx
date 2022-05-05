import React from 'react';
import {DOMAIN}  from '../../../../config';
const src =
  (process.env.NODE_ENV === 'development' ? `http://${DOMAIN}` : '') +
  '/bi/superset/welcome';

function Superset() {
  return (
    <div>
      <iframe width="100%" height="870px" title="superset" src={src}></iframe>
    </div>
  );
}

export default Superset;
