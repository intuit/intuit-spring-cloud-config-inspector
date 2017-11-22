# Config Inspector

Inspect config files with config file url or metadata file url. Facilitate understanding how the Spring Cloud Config Server processes
configuration files in the backend in order to serve to applications.

[![Build Status](https://travis-ci.com/intuit/spring-cloud-config-inspector.svg?token=Mbrq2rt4FjhhGgJEpsaV&branch=feature/CFG-1090/clean-up-code)](https://travis-ci.com/intuit/spring-cloud-config-inspector)

* [x] Config Resolution: Shows the resolution tree of where the current value of all properties came from based on the `label` and `profiles`.
* [x] Raw Configs: Shows the output of the resolved configs in `.yml`, `.properties`, `.json` and the `.json` of the config server metadata.
* [x] Diff-Across: Debug which values are different between two combination of `label` and `profiles`.
* [x] Github Info: Shows where the configuration files came from.
* [x] API Logs: See how to call the Config Server directly using cURL.
* [ ] Static Content: Shows the resolved static content after resolving the tokens. (*FUTURE*)

![resolution](https://intuit.github.io/spring-cloud-config-inspector/images/logo.png "Spring Cloud Config Inspector")

Go to the <a href="wiki/">Wiki</a> pages for details on the features set.

## Running with Docker/Docker-Compose

You can quickly have an idea about the power of the Inspector by quickly running with default config repo setup.

* Install Docker-Compose: https://docs.docker.com/compose/install/
* Docker the following:

```
$ docker-compose up
```

Go to http://localhost:3232 and then specify the following:

* `Config Url`: http://config-server:8888
* `App name`: foo

You *MUST* have connectivity to "github.com" in order to run this server.

If you want to point to your own Configuration file, make sure to change
the environment variable value in Docker-Compose.

## Running with NPM/Node

```
$ npm install
$ npm start
```

## Run without Tests

* Clone this repository
* Run the app

```
$ npm run dev
```

## Config service Proxy server

* In order to call the config and github servers from the browser, we have to proxy the calls with CORS.
* The proxy server will handle the `pre-flight` calls properly (HTTP OPTIONS)

> NOTE: If your Config Server or Github appliances require credentials, you can add them through the 
> UI using the "Headers" section. 

```
$ npm run proxy

> config-inspector@1.0.0 proxy /Users/marcellodesales/dev/github/intuit/services-configuration/config-inspector
> node tools/cors-proxy

Using limit:  100kb
CORS Proxy server listening on port 3001
```

* Calls to the config server are in the following format: **http://localhost:3001/`CONFIG_SERVER_API_URL`**

The example below is to verify that calls to the config-server, dockerized version, works propertly.

```
$ curl -X OPTIONS -i  \
        localhost:3001/http://config-server:8888/v2/foo-development.yml

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
