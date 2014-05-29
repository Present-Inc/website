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

  var PControllers = angular.module('PControllers', []);
  var PDirectives = angular.module('PDirectives', []);
  var PConstructors = angular.module('PConstructors', []);
  var PLoaders = angular.module('PLoaders', []);
  var PManagers = angular.module('PManagers', []);
  var PUtilities = angular.module('PUtilities', []);
  var PApiClient = angular.module('PApiClient', []);

 /**
  * Initialize Angular Application
  *   @dependency {Angular}   Angular       -- It's AngularJS
  *   @dependency {UI-Router} UI-Router     -- Handles all client side routing using a state configuration
  *   @dependency {Present}   PConstructors -- Constructs new client objects from API response objects
  *   @dependency {Present}   PLoaders      -- Loads data which will be injected into the controllers
  *   @dependency {Present}   PManagers     -- Magers that control the state of the application components
  *   @dependency {Present}   PApiClient    -- Handles all requests and responses from the Present API
  *   @dependency {Present}   PControllers  -- Creates view models (MVVVM)
  *   @dependency {Present}   PDirectives   -- Defines the custom HTML elements
  *   @dependency {Present}   PUtilities    -- Utility functions
  */

  var PresentWebApp = angular.module('PresentWebApp',
    ['ui.router', 'LocalStorageModule',
     'PControllers', 'PDirectives', 'PConstructors', 'PLoaders', 'PManagers', 'PApiClient', 'PUtilities']);


  /**
   * PresentWebApp State Configureation
   * Define routes with ui-router's $stateProvider
   *   @dependency {ui-router} $stateProvider
   *   @dependency {Angular}   $locationProvider
   *   @dependency {LStorage}  $localStorageServiceProvider
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
      * State data -- sets properties of the ApplicationManager
      *   @property <Boolean> fullscreen          -- When true state is full screen (i.e doens't scroll)
      *   @property <Boolean> navigation          -- When true navigation bar is visible
      *   @property <Boolean> requiresUserContext -- When true user context is required to access state
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
