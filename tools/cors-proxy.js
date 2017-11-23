var express = require('express'),
    request = require('request'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers') || '*');

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();

    } else {
        //console.log(req.originalUrl);
        var targetURL = req.originalUrl.substr(1);
        if ( targetURL !== "" && targetURL.indexOf("http://") !== 0 && targetURL.indexOf("https://") !== 0) {
            targetURL = 'http://' + targetURL;
        }
        if (!targetURL) {
           res.send(500, { error: 'There is no Target-Endpoint header in the request' });
           return;
        }
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        var headers = {
          'User-Agent': "Spring Cloud Config Inspector Proxy",
          'Accept': '*/*'
        };

        // Github.com headers that can't be submitted
        ['referer', 'accept-encoding', 'accept-language',
         'connection', 'origin', 'host'].forEach(function(headerKey) {
          delete req.headers[headerKey];
        })

        request({
            url: targetURL,
            method: req.method,
            json: req.body,
            headers: req.headers,
            strictSSL: false },
            function (error, response, body) {
              // no need to handle
            }).pipe(res);
    }
});

app.set('port', process.env.PORT || 3001);

var host = null;

if (host) {
  app.listen(app.get('port'), host, function () {
      console.log('CORS Proxy server listening on port ' + app.get('port'));
  });

} else {
  app.listen(app.get('port'), function () {
      console.log('CORS Proxy server listening on port ' + app.get('port'));
  });
}
