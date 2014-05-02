
var accountSid = 'ACc40bb29c3e0fbcd68a7c93d069a66e39',
    authToken = '1845d658d4a043de42317139382321e3';

var client = require('twilio')(accountSid, authToken);

module.exports = {
    send_link : function(req, res) {
      if(req.param('device') == 'iphone') {
        var link = 'https://itunes.apple.com/us/app/present-share-the-present/id813743986?mt=8'
        client.messages.create({
        	to: "+17249946182",
        	from: "+17248265155",
        	body: link,
        }, function(err, message) {
        	console.log(message.sid);
        });
      }
  }
}
