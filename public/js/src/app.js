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
			 * @property fullscreenEnabled <Boolean> -- When true state is full screen (i.e doens't scroll)
			 * @property navbarEnabled <Boolean> -- When true navigation bar is visible
			 * @property requireUserContext <Boolean> -- When true user context is required to access state
			 */

      $stateProvider

        .state('splash', {
          url: '/',
          templateUrl: 'views/splash',
          controller: 'SplashController',
          meta: {availability: 'public'}
        })

				.state('discover', {
					abstract: true,
					templateUrl: 'views/discover'
				})

				.state('discover.default', {
					url: '/discover',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'feed@discover': {templateUrl: 'views/partials/feed', controller: 'FeedController'}
					},
					resolve: {
						Feed: function(FeedLoader) {
							return FeedLoader.preLoad('discover', false);
						}
					},
					meta: {availability: 'public'}
				})

				.state('present', {
					url: '/p/:video',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'}
					},
					meta: {availability: 'public'}
				})

				.state('home', {
					abstract: true,
					templateUrl: 'views/home'
				})

				.state('home.default', {
					url: '/home',
					views: {
						'navbar@': {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'feed@home': {templateUrl: 'views/partials/feed', controller: 'FeedController'},
						'profile@home': {templateUrl: 'views/partials/home_profile', controller: 'UserProfileController'}
					},
					resolve: {
						Feed: function(FeedLoader) {
							return FeedLoader.preLoad('home', true)
						},
						User: function(UserLoader) {
							return UserLoader.preLoad('showMe', true)
						}
					},
					meta: {availability: 'private'}
				})

				.state('home.group', {
					url: '/home/:group',
					views: {
						'navbar@': {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'feed@home': {templateUrl: 'views/partials/feed', controller: 'FeedController'},
						'profile@home': {templateUrl: 'views/partials/home_profile', controller: 'UserProfileController'}
					},
					resolve: {
						Feed: function(FeedLoader) {
							return FeedLoader.preLoad('home', true)
						},
						User: function(UserLoader) {
							return UserLoader.preLoad('showMe', true)
						}
					},
					meta: {availability: 'private'}
				})

				.state('user', {
					abstract: true,
					templateUrl: 'views/user'
				})

				.state('user.profile', {
					url: '/:user',
					views: {
						'navbar@': {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'profile@user': {templateUrl: 'views/partials/user_profile', controller: 'UserProfileController'},
						'feed@user': {templateUrl: 'views/partials/feed', controller: 'FeedController'}
					},
					resolve: {
						Feed: function(FeedLoader, $stateParams) {
							return FeedLoader.preLoad('user', false, $stateParams.user)
						},
						User: function(UserLoader, $stateParams) {
							return UserLoader.preLoad('show', false, $stateParams.user)
						}
					},
					meta: {availability: 'public'}
				})

				.state('account', {
					abstract: true,
					templateUrl: 'views/account'
				})

				.state('account.login', {
					url: '/account/login',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'login@account' : {templateUrl:  'views/partials/login', controller: 'LoginController'}
					},
					meta: {availability: 'public'}
				})

				.state('account.register', {
					url: '/account/register?invite_id&invite_user_id',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'register@account' : {templateUrl:  'views/partials/register', controller: 'RegisterController'}
					},
					meta: {availability: 'public'}
				})

				.state('account.requestPasswordReset', {
					url: '/account/request_password_reset',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'requestPasswordReset@account' : {
							templateUrl: 'views/partials/request_password_reset',
							controller: 'RequestPasswordResetController'
							}
					},
					meta: {availability: 'public'}
				})

				.state('account.resetPassword', {
					url: '/account/reset_password?user_id&password_reset_token',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'resetPassword@account' : {templateUrl:  'views/partials/reset_password', controller: 'ResetPasswordController'}
					},
					meta: {availability: 'public'}
				})

				.state('account.edit', {
					url: '/account/edit',
					views: {
						'navbar@': {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'edit@account': {templateUrl: 'views/partials/edit_profile', controller: 'EditProfileController'}
					},
					resolve: {
						User : function(UserLoader) {
							return UserLoader.preLoad('showMe', false);
						}
					},
					meta: {availability: 'private'}
				})


  }]);

