/**
 * Daniel Lucas
 * Present V0.4
 */


  var Express = require('express'),
      RequireChildren = require('require-children'),
      App = Express(),
      Boot = RequireChildren('boot', module);
      httpPort = 8000;


  App.engine('ejs', require('ejs').__express);
  App.set('views', __dirname + '/views');

  App = Boot.http.init(App);

  App.listen(httpPort, function() {
    console.log('Present listening on port 8000');
  });
