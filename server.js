/*
 * Present Web App Server
 * Created By Daniel Lucas
 */

var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    middleware = require('./server/middleware'),
    router = require('./server/routes'),
    httpPort = 8000;

var app = express();

app.use(logger('dev'));
app.use(bodyParser());

app.use(function(req, res, next) {
    middleware.detectUserDeviceType(req, res, next);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/views/:name', function(req, res) {
    var name = req.params.name;
    res.sendfile('./views/' + name + '.html');
});

app.get('/views/partials/:name', function(req, res) {
    var name = req.params.name;
    res.sendfile('./views/partials/' + name + '.html');
});

app.get('/send_link/:device', function(req, res) {
    router.send_link(req, res);
});

app.get('/*', function(req, res) {
    res.sendfile('index.html');
    console.log('User\'s Device: ' + req.userDevice);
});

app.listen(httpPort, function() {
   console.log('Express server listening on port %d', httpPort);
});
