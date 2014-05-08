/*
 * Present Web App
 * Version 2
 * Present Inc.
 * Written by Daniel Lucas
 *
 * app.js
 * PresentWebApp
 * Initialize Angular Application
 * @dependency ui-router
 */

define(['angular',
        'ui-router',
        'controllers/index',
        'services/index'], function(angular) {

    var PresentWebApp = angular.module('PresentWebApp', ['ui.router', 'PControllers', 'PServices']);

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
          });



    }]);


    return PresentWebApp;

});
