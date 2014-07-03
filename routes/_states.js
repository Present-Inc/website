

module.exports = {

  'home': {
    httpMethod: 'GET',
    url: '/',
    endpoint: function(req, res) {
      res.send('home');
    }
  },

  'present': {
    httpMethod: 'GET',
    url: '/present/:username/:present',
    endpoint: function(req, res) {
      res.send('present');
    }
  },

  'blog': {
    httpMethod: 'GET',
    url: '/blog',
    endpoint: function(req, res) {
      res.send('blog');
    }
  },

  'reset_password': {
    httpMethod: 'GET',
    url: '/reset_password',
    endpoint: function(req, res) {
      res.send('reset_password');
    }
  },

};
