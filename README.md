# Config Inspector

Inspect config files with config file url or metadata file url. Facilitate understanding how the Spring Cloud Config Server processes
configuration files in the backend in order to serve to applications.

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
