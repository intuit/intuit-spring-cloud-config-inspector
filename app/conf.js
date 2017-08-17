const packageJson = require("../package.json");

export const GIT_URL = 'https://github.intuit.com/api/v3/repos'

export const API_KEYS = {
  prod: 'prdakyresk43bOEZ0adQWBF3hRw8vfAOxq3rWPXg',
  preProd: 'preprdakyresGHM824zIZ1pQ2jdP7VbRsCWGKSzC'
};

/**
 * Current Credentials
 */
export const PROXY_CREDENTIALS = {
  manager: {
    preProd: {
      appId: "Intuit.platform.servicesplatform.config-manager",
      appSecret: "preprdnsajTffUKBvEEqPVo6x12EhEyRCTTV9lVk"
    }
  },
  inspector: {
    preProd: {
      appId: "Intuit.platform.servicesplatform.config.inspector",
      appSecret: "preprdakyresGHM824zIZ1pQ2jdP7VbRsCWGKSzC"
    },
    prod: {
      appId: "Intuit.platform.servicesplatform.config.inspector",
      appSecret: "prdakyresk43bOEZ0adQWBF3hRw8vfAOxq3rWPXg"
    }
  }
}

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
 * return the current environment based on the host.
 */
export function getProxyServerUrl() {
  const currentEnv = getCurrentHostEnv();
  return `${SERVICES.proxyServer[currentEnv]}/`;
}

/**
 * @return the current credentials for the header.
 */
export function getProxyCredentials() {
  const currentEnv = getCurrentHostEnv();

  if (Env.PRD === currentEnv) {
    return PROXY_CREDENTIALS.inspector.prod;
  }

  if ([Env.E2E, Env.QAL, Env.DEV, Env.MOCK].includes(currentEnv)) {
    return PROXY_CREDENTIALS.inspector.preProd;
  }

  return PROXY_CREDENTIALS.manager.preProd;
}

/**
 * @return the Authorization header value.
 */
export function getAuthorizationHeader() {
  const currentEnv = getCurrentHostEnv();
  const credentials = getProxyCredentials();
  if (Env.LOCAL === currentEnv) {
    return `Intuit_IAM_Authentication intuit_appid=${credentials.appId},intuit_app_secret=${credentials.appSecret}`;

  } else {
    return `Intuit_APIKey intuit_appid=${credentials.appId},intuit_apikey=${credentials.appSecret},intuit_apikey_version=1.0`;
  }
}
