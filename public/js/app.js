/*
 * Present Web App
 * Version 2
 * Present Inc.
 * Written by Daniel Lucas
 *
 * app.js
 * PresentWebApp
 *
 * Initialize Angular Application
 *   @dependency {Angular}   Angular           -- It's AngularJS
 *   @dependency {ui-router} ui-router         -- Handles application state and view loading
 *   @dependency {Present}   controllers/index -- Module loader for all the applicaiton controllers
 *   @dependency {Present}   services/index    -- Module loader for all the application services
 *   @dependency {Present}   directives/index  -- Module loader for all the application directives
 *   @dependency {Present}   apiClient/index   -- Modle loader for all the application directives
 */

define(['angular',
        'ui-router',
        'controllers/index',
        'services/index',
        'directives/index'], function(angular) {

    var PresentWebApp = angular.module('PresentWebApp', ['ui.router', 'PControllers', 'PServices', 'PDirectives']);

    /*
     * PresentWebApp State Configureation
     * Define routes with ui-router's $stateProvider
     * @dependency {ui-router} $stateProvider
     * @dependency {Angular}   $locationProvider
     */

    PresentWebApp.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {

      /*
       * Enable client side routing by enabling the html5 history API
       * Removes the '#' from url's
       */

       $locationProvider.html5Mode(true);

       /*
        * Configure Application states using ui router
        * State data -- sets properties of the applicationManageer
        *   @property <Boolean> fullscreen  -- when true  state is full screen (i.e doens't scroll)
        *   @property <Boolean> navigation  -- when true navigation bar is visible
        */


        $stateProvider

          .state('splash', {
            url: '/',
            templateUrl: 'views/splash',
            controller: 'splashCtrl',
            data: {
              fullscreen: true,
              navigation: false
            }
          })

          .state('discover', {
            url: '/discover',
            templateUrl: 'views/discover',
            controller: 'discoverCtrl',
            data: {
              fullscreen: false,
              navigation: true
            },
            resolve: {
              discoverFeed : function(FeedLoader) {
                return FeedLoader.loadDiscoverFeed();
              }
            }
          })

          .state('login', {
            url: '/login',
            templateUrl: 'views/login',
            controller: 'loginCtrl',
            data: {
              fullscreen: true,
              navigation: false
            }
          });

    }]);

});
