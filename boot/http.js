/**
 * HTTP
 */


  var _ = require('underscore'),
      RequireChildren = require('require-children');


  module.exports = {
    init : function(Router) {

      var Routes = RequireChildren('../routes', module),
          Middleware = RequireChildren('../middleware', module),
          defaultMiddleware = [Middleware.detectUserAgent];


      _.each(Routes._states, function(state, stateName) {
        var httpMethod = state.httpMethod.toLowerCase(),
            url = state.url;
        console.log(url);
        Router[httpMethod](state.url, defaultMiddleware, state.endpoint);
      });

      _.each(Routes.present, function(route, routeName) {
        var httpMethod = route.httpMethod.toLowerCase(),
            url = route.url;
        console.log(url);
        Router[httpMethod](route.url, route.endpoint);
      });

      _.each(Routes.twilio, function(route, routeName) {
        var httpMethod = route.httpMethod.toLowerCase(),
            url = route.url;
        console.log(url);
        Router[httpMethod](route.url, route.endpoint);
      });

      return Router;

    }
  };
