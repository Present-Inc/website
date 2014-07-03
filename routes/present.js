
module.exports = {

  register : {
    httpMethod: 'POST',
    url: '/present/register',
    endpoint: function(req, res) {
      res.send('register');
    }
  },

  resetPassword : {
    httpMethod: 'POST',
    url: '/present/reset_password',
    endpoint: function(req, res) {
      res.send('resetPassword');
    }
  }

}; 
