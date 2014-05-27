/*
 * Present Web App
 * V - 2.0.0
 * Present Inc.
 * Written by Daniel Lucas
 *
 * app.js
 * PresentWebApp
 */

  /**
   * Define Present Modules
   */

  var PServices = angular.module('PServices', []);
  var PControllers = angular.module('PControllers', []);
  var PDirectives = angular.module('PDirectives', []);

 /**
  * Initialize Angular Application
  *   @dependency {Angular}   Angular      -- It's AngularJS
  *   @dependency {ui-router} ui-router    -- Handles application state and view loading
  *   @dependency {Present}   PControllers -- Module loader for all the applicaiton controllers
  *   @dependency {Present}   PServices    -- Module loader for all the application services
  *   @dependency {Present}   PDirectives  -- Module loader for all the application directives
  */

  var PresentWebApp = angular.module('PresentWebApp',
    ['ui.router', 'LocalStorageModule', 'PControllers', 'PServices', 'PDirectives']);

  /**
   * PresentWebApp State Configureation
   * Define routes with ui-router's $stateProvider
   *   @dependency {ui-router} $stateProvider
   *   @dependency {Angular}   $locationProvider
   */

  PresentWebApp.config(['$stateProvider', '$locationProvider', 'localStorageServiceProvider',

    function($stateProvider, $locationProvider, localStorageServiceProvider) {

    /**
     * Enable client side routing by enabling the html5 history API
     * Removes the '#' from url's
     */

     $locationProvider.html5Mode(true);


     /**
      * Configure localStorage
      * Set the storage type to 'sessionStorage' and define a custom prefix
      */

      localStorageServiceProvider.setPrefix('present');

      localStorageServiceProvider.setStorageType('sessionStorage');

     /**
      * Configure Application states using ui router
      * State data -- sets properties of the applicationManageer
      *   @property <Boolean> fullscreen  -- When true state is full screen (i.e doens't scroll)
      *   @property <Boolean> navigation  -- When true navigation bar is visible
      */


      $stateProvider

        .state('splash', {
          url: '/',
          templateUrl: 'views/splash',
          controller: 'splashCtrl',
          metaData: {
            fullscreenEnabled: true,
            navigationEnabled: false,
            requireSession: false
          }
        })

        .state('discover', {
          url: '/discover',
          templateUrl: 'views/discover',
          controller: 'discoverCtrl',
          metaData: {
            fullscreenEnabled: false,
            navigationEnabled: true,
            requireSession: false,
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
          metaData: {
            fullscreenEnabled: true,
            navigationEnabled: false,
            requireSession: false,
          }
        })

        .state('home', {
          url: '/home',
          templateUrl: 'views/home',
          controller: 'homeCtrl',
          metaData: {
            fullscreenEnabled: false,
            navigationEnabled: true,
            requireSession: true
          },
          resolve: {
            profile  : function(ProfileLoader) {
              return ProfileLoader.loadOwnProfile();
            },
            homeFeed : function(FeedLoader) {
              return FeedLoader.loadHomeFeed();
            }
          }
        });

  }]);
