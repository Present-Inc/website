/**
 * Present Api Client
 */

var https = require('https');

module.exports = {

	users : function(method, params, callback) {

		var options = {
			hostname: 'api.present.tv',
			path: '/v1/users/' + method + '?username=' + params.username,
			port: 443,
			method: 'GET'
		};

		var response = '';

		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				response += chunk;
			});
			res.on('end', function() {
				callback(null, response);
			});
		});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			callback(e.message)
		});

		req.end();

	},

	videos: function(method, params, callback) {

		var options = {
			hostname: 'api.present.tv',
			path: '/v1/videos/' + method + '?video_id=' + params.video,
			port: 443,
			method: 'GET'
		};

		var response = '';

		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				response += chunk;
			});
			res.on('end', function() {
				callback(null, response);
			});
		});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			callback(e.message)
		});

		req.end();
	}

};