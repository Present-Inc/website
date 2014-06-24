/**
 * TWILIO
 * ====================================================
 */


var accountSid = 'AC8e4eaedd245bfc56ada19e1a1f2595b8',
	authToken = '2634f93c75b41875453b73c067f7155d';

var twilioApi = require('twilio')(accountSid, authToken);

module.exports = {
	sendMessage : function(req, res) {
		var targetPhone = req.param('number');
		if (req.param('device') == 'iphone') {
			var link = 'https://itunes.apple.com/us/app/present-share-the-present/id813743986?mt=8'
			twilioApi.messages.create({
				to: targetPhone,
				from: "+12673295134",
				body: link
			}, function (error, success) {
				if (error)  res.send(400, error);
				else res.send(200, success);
			});
		}
	}

};