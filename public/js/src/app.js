/*
 * Present Web App
 * Version - 2.0.0
 * Present Inc.
 * Written by Daniel Lucas
 *
 * app.js
 * PresentWebApp
 */

  /**
   * Define Present Modules
   */

  var PControllers = angular.module('PControllers', []),
  		PDirectives = angular.module('PDirectives', []),
  	  PModels = angular.module('PModels', []),
			PLoaders = angular.module('PLoaders', []),
  		PManagers = angular.module('PManagers', []),
  		PUtilities = angular.module('PUtilities', []),
  		PApiClient = angular.module('PApiClient', []);

 /**
  * Initialize Angular Application
  *   @dependency {Angular}   Angular       -- It's AngularJS
  *   @dependency {UI-Router} UI-Router     -- Handles all client side routing using a state configuration
  *   @dependency {Present}   PModels       -- Constructs new client objects from API response objects
  *   @dependency {Present}   PManagers     -- Managers that control the state of the application components
  *   @dependency {Present}   PApiClient    -- Handles all requests and responses from the Present API
  *   @dependency {Present}   PControllers  -- Creates view models (MVVVM)
  *   @dependency {Present}   PDirectives   -- Defines the custom HTML elements
  *   @dependency {Present}   PUtilities    -- Utility functions
  */

  var PresentWebApp = angular.module('PresentWebApp',
    ['ui.router', 'LocalStorageModule',
     'PControllers', 'PDirectives', 'PModels', 'PLoaders', 'PManagers', 'PApiClient', 'PUtilities']);


  /**
   * PresentWebApp State Configuration
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
      *   @property fullscreenEnabled <Boolean> -- When true state is full screen (i.e doens't scroll)
      *   @property navbarEnabled <Boolean> -- When true navigation bar is visible
      *   @property requireUserContext <Boolean> -- When true user context is required to access state
      */


      $stateProvider

        .state('splash', {
          url: '/',
          templateUrl: 'views/splash',
          controller: 'splashCtrl',
          metaData: {
            fullscreenEnabled: true,
            navbarEnabled: false,
            requireUserContext: false
          }
        })

        .state('discover', {
          url: '/discover',
          templateUrl: 'views/discover',
          controller: 'discoverCtrl',
          metaData: {
            fullscreenEnabled: false,
            navbarEnabled: true,
            requireUserContext: false
          },
          resolve: {
						Feed : function(FeedLoader) {
							return FeedLoader.preLoad('discover', false);
						}
          }
        })

        .state('login', {
          url: '/login',
          templateUrl: 'views/login',
          controller: 'loginCtrl',
          metaData: {
            fullscreenEnabled: true,
            navbarEnabled: false,
            requireUserContext: false
          }
        })

        .state('home', {
          url: '/home',
          templateUrl: 'views/home',
          controller: 'homeCtrl',
          metaData: {
            fullscreenEnabled: false,
            navbarEnabled: true,
            requireUserContext: true
          },
          resolve: {
            Profile  : function(ProfileLoader) {
             	return ProfileLoader.loadOwnProfile();
            },
            Feed : function(FeedLoader) {
              return FeedLoader.preLoad('home', true);
            }
          }
        });

  }]);

