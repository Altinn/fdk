/* Facade for keycloak */
import _ from 'lodash';
import Keycloak from 'keycloak-js';

import { getConfig } from '../config';
import { loadTokens, removeTokens, storeTokens } from './token-store';
import { popLoginState, setLoginState } from './login-store';
import { globalHistory } from '../global-history';

let kc;

const PERMISSION_ADMIN = 'PERMISSION_ADMIN';
const RESOURCE_ORGANIZATION = 'organization';
const ROLE_ADMIN = 'admin';

function toPromise(keycloakPromise) {
  return new Promise((resolve, reject) =>
    keycloakPromise.success(resolve).error(reject)
  );
}

function setOnAuthSuccess() {
  const handler = () => {
    storeTokens({ token: kc.token, refreshToken: kc.refreshToken });
  };

  kc.onAuthRefreshSuccess = handler;
  kc.onAuthSuccess = handler;
}

function initializeKeycloak() {
  const { token, refreshToken } = loadTokens();
  const initOptions = {
    onLoad: 'check-sso',
    redirectUri: location.origin,
    token,
    refreshToken
  };

  return toPromise(kc.init(initOptions));
}

export const isAuthenticated = () => kc && kc.authenticated;

export async function initAuthService() {
  const kcConfig = getConfig().keycloak;
  kc = Keycloak(kcConfig);

  setOnAuthSuccess();

  await initializeKeycloak();
  if (isAuthenticated()) {
    const { targetLocation } = popLoginState();
    if (targetLocation) {
      globalHistory.replace(targetLocation);
    }
  }
}

export function logout() {
  removeTokens();
  kc.logout(); // redirects;
}

export function reauthenticateDueToUnauthenticated() {
  // Reauthenticate is called when protected route is accessed without authentication
  // After authentication, user will be redirected back to the original location
  setLoginState({ targetLocation: globalHistory.location });
  logout();
}

export function reauthenticateDueToTimeout() {
  setLoginState({
    reauthenticateDueToTimeout: true,
    targetLocation: globalHistory.location
  });
  logout();
}

export function login({ readOnly = false }) {
  const idpHint = readOnly ? 'local-oidc' : 'idporten-oidc';
  kc.login({ idpHint }); // redirects
}

export async function getToken() {
  await toPromise(kc.updateToken(5));
  return kc.token;
}

export const getUserProfile = () =>
  isAuthenticated() ? _.pick(kc.tokenParsed, 'name') : null;

const extractResourceRoles = authorities => {
  return (authorities || '')
    .split(',')
    .map(authorityDescriptor => authorityDescriptor.split(':'))
    .map(parts => ({
      resource: parts[0],
      resourceId: parts[1],
      role: parts[2]
    }));
};

export const getResourceRoles = () => {
  if (!(kc && kc.tokenParsed)) {
    return null;
  }
  return extractResourceRoles(_.get(kc.tokenParsed, 'authorities'));
};

const hasPermissionForResource = (resource, resourceId, permission) => {
  switch (permission) {
    case PERMISSION_ADMIN: {
      return !!_.find(getResourceRoles(), {
        resource: RESOURCE_ORGANIZATION,
        resourceId,
        role: ROLE_ADMIN
      });
    }
    default: {
      throw new Error('no permission');
    }
  }
};

export const hasOrganizationAdminPermission = resourceId => {
  return hasPermissionForResource(
    RESOURCE_ORGANIZATION,
    resourceId,
    PERMISSION_ADMIN
  );
};