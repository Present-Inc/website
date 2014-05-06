
var accountSid = 'ACc40bb29c3e0fbcd68a7c93d069a66e39',
    authToken = '1845d658d4a043de42317139382321e3';

var client = require('twilio')(accountSid, authToken);

module.exports = {
    send_link : function(req, res) {
      var targetPhone = req.param('number');
      if(req.param('device') == 'iphone') {
        var link = 'https://itunes.apple.com/us/app/present-share-the-present/id813743986?mt=8'
        client.messages.create({
        	to: targetPhone,
        	from: "+17248265155",
        	body: link,
        }, function(error, success) {
        	 if (error)  res.send(400, error);
           else res.send(200, success);
        });
      }
  }
}
