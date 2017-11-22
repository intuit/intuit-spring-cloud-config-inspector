# Config Inspector

A UI for the config service entered from the developer portal. Inspect config files with config file url or metadata file url. Facilitate understanding of urls and properties in files.

## Full start with tests and config server proxy server

```
$ npm start
```

## Run without Tests

* Clone this repository
* Run the app

```
$ npm run dev
```

## Config service Proxy server

* In order to call the config server from the browser, we have to proxy the calls with CORS.
* The proxy server will handle the `pre-flight` calls properly (HTTP OPTIONS)
* Calls must provide authorization header to the server.

```
$ npm run proxy

> config-inspector@1.0.0 proxy /Users/marcellodesales/dev/github/intuit/services-configuration/config-inspector
> node tools/cors-proxy

Using limit:  100kb
CORS Proxy server listening on port 3001
```

* Calls to the config server are in the following format: **http://localhost:3001/`CONFIG_SERVER_API_URL`**

```
$ curl -X OPTIONS -i  \
       -H 'authorization: Intuit_IAM_Authentication \
          intuit_appid=Intuit.platform.....config-manager,intuit_app_secret=preprd******8RCTTV9lVk'
        localhost:3001/https://config-e2e.api.intuit.net/v2/config_onboarding-e2e,lvdc.yml

HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, PUT, PATCH, POST, DELETE
Access-Control-Allow-Headers: origin, content-type, accept, location, code
Date: Sat, 05 Aug 2017 17:25:24 GMT
Connection: keep-alive
Content-Length: 0
```

# Tests

* Execute the tests

```
$ npm test

> config-inspector@1.0.0 test /Users/marcellodesales/dev/github/intuit/services-configuration/config-inspector
> jest

 PASS  app/components/TopMenu.test.js
 PASS  app/components/LabelMenu.test.js
 PASS  app/components/UserControls.test.js
 PASS  app/components/PropSearch.test.js
 PASS  app/components/Headers.test.js
 PASS  app/components/UserInputs.test.js
 PASS  app/components/Views.test.js
 PASS  app/components/app.test.js

Test Suites: 8 passed, 8 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        6.4s
Ran all test suites.
```
