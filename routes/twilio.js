
module.exports = {

  sendMessage: {
    httpMethod: 'POST',
    url: '/twilio/send_message',
    endpoint: function(req,res) {
      res.send('twilio');
    }
  }

};
