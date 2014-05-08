/*
 * Present Web App
 * Version 2
 * Present Inc.
 * Written by Daniel Lucas
 *
 * app.js
 * Initialize Angular Application
 * @dependency ui-router
 */

var PresentWebApp = angular.module('PresentWebApp', ['ui.router']);

/*
 * PresentWebApp configuration
 * Define routes with ui-router's $stateProvider
 * @dependency $stateProvider
 * @dependency $locationProvider
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



PresentWebApp.controller('splashCtrl', ['$scope', function($scope) {
  $scope.message = 'Welcome to Present!';
}]);
