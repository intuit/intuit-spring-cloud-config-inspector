const packageJson = require("../package.json");

export const API_KEYS = {
  prod: 'prdakyresqVtieRPwHQpY3BOGTuUmpPHtpIP0967',
  preProd: 'preprdakyresAHvjVfSRprXTDr5jWdSDX7H68eLC'
};

/**
 * The current environments where the add-on might run
 */
export const Env = {
  PRD: Symbol('PRD'),
  E2E: Symbol('E2E'),
  QAL: Symbol('QAL'),
  DEV: Symbol('DEV'),
  MOCK: Symbol('MOCK'), // mock server
  LOCAL: Symbol('LOCAL') // local react-app
}

export const SERVICES = {
  proxyServer: {}
}

SERVICES.proxyServer[Env.PRD] = "https://configmanager.api.intuit.com/v1/config";
SERVICES.proxyServer[Env.E2E] = "https://configmanager-e2e.api.intuit.com/v1/config";
SERVICES.proxyServer[Env.QAL] = "https://configmanager-qal.api.intuit.com/v1/config";
SERVICES.proxyServer[Env.DEV] = "https://dev.intuit.com:8443/v1/config";
SERVICES.proxyServer[Env.MOCK] = "https://dev.intuit.com:8443/v1/config";
SERVICES.proxyServer[Env.LOCAL] = "http://localhost:3001";

export const PACKAGE_JSON = {
  name: packageJson.name,
  version: packageJson.version,
  sourceUrl: packageJson.repository.url
}

/**
 * return the current environment based on the host.
 */
export function getCurrentHostEnv() {
  const currentHost = window.location.href;
  if (currentHost.includes("github.intuit.com") && currentHost.includes("-inspector/prd")) {
    return Env.PRD;

  } else if (currentHost.includes("github.intuit.com") && currentHost.includes("-inspector/e2e")) {
    return Env.E2E;

  } else if (currentHost.includes("github.intuit.com") && currentHost.includes("-inspector/qal")) {
    return Env.QAL;

  } else if (currentHost.includes("github.intuit.com") && currentHost.includes("-inspector/dev")) {
    return Env.DEV;

  } else if (currentHost.includes("dev.intuit.com")) {
    return Env.MOCK;

  } else if (currentHost.includes("localhost")) {
    return Env.LOCAL;

  } else {
    return Env.LOCAL;
  }
}

/**
 * return the current api key to be used in the headers
 */
export function getAPIKey() {
  const currentHost = getCurrentHostEnv();
  return currentHost === Env.PRD ? API_KEYS.prod : API_KEYS.preProd;
}

/**
 * return the current environment based on the host.
 */
export function getProxyServerUrl() {
  const currentEnv = getCurrentHostEnv();
  return `${SERVICES.proxyServer[currentEnv]}/`;
}
