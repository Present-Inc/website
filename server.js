/*
 * Present Web App Server
 * Created By Daniel Lucas
 */

var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    middleware = require('./server/middleware'),
    twilio = require('./server/twilio'),
		snapshots = require('./server/snapshots'),
    httpPort = 8000;

var app = express();

app.engine('ejs', require('ejs').__express);
app.set('views', __dirname + '/public/html');

app.use(logger('dev'));
app.use(bodyParser());

app.use(function(req, res, next) {
	middleware.detectUserDeviceType(req, res, next)
});

app.use(express.static(path.join(__dirname, 'public')));


/**
 * PresentWebApp
 * Static file server
 */

/** Serves views to the app **/

app.get('/views/:name', function(req, res) {
   var name = req.params.name;
   res.sendfile('./views/' + name + '.html');
});

app.get('/views/partials/:name', function(req, res) {
   var name = req.params.name;
   res.sendfile('./views/partials/' + name + '.html');
});

/** Public states with unique snapshots **/

app.get('/:user/p/:video', function(req, res) {
	if(req.userDevice == 'bot') snapshots.video(req, res);
	else res.sendfile('index.html');
});


app.get('/:user', function(req, res) {
	if(req.userDevice == 'bot') snapshots.user(req, res);
	else res.sendfile('index.html');
});


/** Private states with default snapshot **/

app.get('/*', function(req, res) {
	console.log(req.userDevice);
	if(req.userDevice == 'bot') snapshots._default(req, res);
	else res.sendfile('index.html');
});

/**
 * Twilio
 */

app.post('/send_link', function(req, res) {
	twilio.sendMessage(req, res);
});


app.listen(httpPort, function() {
   console.log('Express server listening on port %d', httpPort);
});

process.on('uncaughtException', function (err) {
	console.log(err);
});
