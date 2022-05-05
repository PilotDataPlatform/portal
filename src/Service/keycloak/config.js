import Keycloak from 'keycloak-js';
import { DEFAULT_AUTH_URL, KEYCLOAK_REALM, DOMAIN } from '../../config';
console.log(DOMAIN);

const keycloakConfig = {
  realm: KEYCLOAK_REALM,
  url:
    process.env.NODE_ENV === 'development'
      ? `http://${DOMAIN}${DEFAULT_AUTH_URL}/`
      : DEFAULT_AUTH_URL + '/',
  'ssl-required': 'external',
  resource: 'react-app',
  'public-client': true,
  'verify-token-audience': true,
  'use-resource-role-mappings': true,
  'confidential-port': 0,
  clientId: 'react-app',
};

const keycloak = new Keycloak(keycloakConfig);
export { keycloak };
