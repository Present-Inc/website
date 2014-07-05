

var Present = require('../models/present/index');

module.exports = {

  'home': {
    httpMethod: 'GET',
    url: '/',
    endpoint: function(req, res) {
      res.render('home.ejs');
    }
  },

  'present': {
    httpMethod: 'GET',
    url: '/present/:username/:video',
    endpoint: function(req, res) {

      var username = req.params.username,
          videoId = req.params.video;

      Present.Video.create(videoId, function (err, video) {
        if(err) res.send(err); 
        else res.render('present.ejs', {video: video});
      });

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
