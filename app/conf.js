const packageJson = require("../package.json");

export const GIT_REPOS_API = 'https://api.github.com/repos'
export const GIT_REPOS_API_TOKEN = null;

/**
 * Current Credentials
 */
export const PROXY_CREDENTIALS = {
  manager: {
    preProd: {
      appId: "config-manager",
      appSecret: "PVo6x12EhEyRCTTV9lVk"
    }
  },
  inspector: {
    preProd: {
      appId: "config.inspector",
      appSecret: "4zIZ1pQ2jdP7VbRsCWGKSzC"
    },
    prod: {
      appId: "inspector",
      appSecret: "QWBF3hRw8vfAOxq3rWPXg"
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
  LOCAL: Symbol('LOCAL'), // local react-app
  TEST: Symbol('TEST') // test cases
}

export const SERVICES = {
  proxyServer: {}
}

// SERVICES.proxyServer[Env.PRD] = "https://configmanager.api.a.com/v1/config";
// SERVICES.proxyServer[Env.E2E] = "https://configmanager-e2e.api.a.com/v1/config";
// SERVICES.proxyServer[Env.QAL] = "https://configmanager-qal.api.a.com/v1/config";
// SERVICES.proxyServer[Env.DEV] = "https://dev.example.com:8443/v1/config";
// SERVICES.proxyServer[Env.MOCK] = "https://dev.example.com:8443/v1/config";
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
  if (currentHost.includes("github.com")) {
    return Env.GHPAGE;

  } else if (currentHost.includes("local.dev.com")) {
    return Env.MOCK;

  } else if (currentHost.includes("localhost")) {
    return Env.LOCAL;

  } else {
    return Env.TEST;
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
 * Returns a tid for requests
 *
 * @returns {string} the transaction Id for logging purposes
 */
export function getTID() {
  let date = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (date + Math.random() * 16) % 16 | 0
    date = Math.floor(date / 16)
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16)
  })
}
