/**
 * Daniel Lucas
 * Present V0.4
 */


  var Express = require('express'),
      RequireChildren = require('require-children'),
      Router = Express(),
      Boot = RequireChildren('boot', module);
      httpPort = 8000;

  Router = Boot.http.init(Router);

  Router.listen(httpPort, function() {
    console.log('Present listening on port 8000');
  });
