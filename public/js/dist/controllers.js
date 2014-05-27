/**
 * PControllers.discoverCtrl
 * View Controller for the discover state
 *   @dependency {Angular} $scope
 *   @dependency {Present} logger   -- Configurable log for development
 *   @dependency {Present} FeedManager -- Provides properties and methods to manage the video feed
 *   @dependency {Present} discoverFeed -- Data resolved from FeedLoader.loadDiscoverFeed
 */

  PControllers.controller('discoverCtrl', ['$scope', 'logger', 'FeedManager', 'discoverFeed',

    function($scope, logger, FeedManager, discoverFeed) {
      //Check whether resolved dependencies resolved successfully
      if(!discoverFeed) alert('Sorry, it appears that the application has lost connection, please try again');

      logger.debug(['PControllers.discoverCtrl -- initializing the Feed Manager', discoverFeed]);

      //Initialize Feed Manager on the controller scope
      $scope.FeedManager = FeedManager;
      $scope.FeedManager.type = 'discover';
      $scope.FeedManager.cursor = discoverFeed.cursor;
      $scope.FeedManager.videos = discoverFeed.videos;

      //Refreshes the discoverFeed
      $scope.refreshFeed = function() {
        $scope.FeedManager.loadMoreVideos($scope.FeedManager.type, $scope.FeedManager.cursor)
          .then(function(newDiscoverFeed) {
            $scope.FeedManager.videos = newDiscoverFeed.videos;
            $scope.FeedManager.cursor = newDiscoverFeed.cursor;
          });
      }

    }

  ]);

/*
 * PControllers.homeCrtl
 * View Controller for the home state
 *   @dependency {Angular} $scope
 *   @dependency {Utilities} logger -- Configurable logger for development
 *   @dependency {Present} FeedManager -- Provides properties and methods to manage the video feed
 *   @dependency {Present} discoverFeed -- Data resolved from FeedLoader.loadDiscoverFeed
 */

  PControllers.controller('homeCtrl', ['$scope', 'logger', 'FeedManager', 'homeFeed', 'profile',

    function($scope, logger, FeedManager, homeFeed, profile) {

      //Check whether resolved dedpendencies resolved successfully
      if(!homeFeed) alert('the home feed could not be loaded');

      logger.debug(['PControllers.homeCtrl -- initializing Profile Data', profile]);
      logger.debug(['PControllers.homeCtrl -- initializing the Feed Manager', homeFeed]);

      //Initialize Profile
      $scope.Profile = profile;

      //Initialize Feed Manager on the controller scope
      $scope.FeedManager = FeedManager;
      $scope.FeedManager.type = 'home';
      $scope.FeedManager.cursor = homeFeed.cursor;
      $scope.FeedManager.videos = homeFeed.videos;


      $scope.refreshFeed = function() {
       $scope.FeedManager.loadMoreVideos($scope.FeedManager.type, $scope.FeedManager.cursor)
         .then(function(newHomeFeed) {
            $scope.FeedManager.videos = newHomeFeed.videos;
            $scope.FeedManager.cursor = newHomeFeed.cursor;
         })
      }
    }

  ]);

/*
 * PControllers.loginCtrl
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger -- configurable logger for development
 *   @dependency {Present} UserContextManager
 */

  PControllers.controller('loginCtrl', ['$scope', '$state', 'logger', 'UserContextManager',

    function($scope, $state, logger, UserContextManager) {

      $scope.username = '';
      $scope.password = '';

      $scope.login = function() {
        UserContextManager.createNewUserContext($scope.username, $scope.password)
          .then(function(newUserContext) {
              logger.debug(['PControllers.loginCtrl -- userContext created', newUserContext]);
              $state.go('home');
          })
          .catch(function() {
            alert('username and/or password is incorrect');
          });
      }

    }

  ]);

/**
 * PControllers.mainCtrl
 * Highest level controller PresentWebApp
 * Acts as a buffer to the rootScope
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger
 *   @dependency {Present} ApplicationManager -- Provides properties and methods to manage the application state
 *   @dependency {Present} UserContextManager -- Provides methods to manage userContexts
 */

  PControllers.controller('mainCtrl', ['$scope', '$location', 'logger', 'ApplicationManager', 'UserContextManager',

    function($scope, $location, logger, ApplicationManager, UserContextManager) {

      $scope.ApplicationManager = ApplicationManager;

      $scope.$on('$stateChangeStart', function(event, toState, fromState) {

        //Check to see if requested state requires a valid userContext
        if(toState.metaData.requireSession) {
          var userContext = UserContextManager.getActiveUserContext();
          if(!userContext) {
            logger.debug(['PControllers.mainCtrl on $stateChangeStart -- userContext is invalid', userContext]);
            $location.path('/login');
          }
          else logger.debug(['PControllers.mainCtrl on $stateChangeStart -- userContext is valid', userContext]);
        }

      });

      $scope.$on('$stateChangeSuccess', function(event, toState, fromState) {

        //Apply state data to the Application Manager on the stateChangeStart event
        if(toState.metaData.fullscreenEnabled) $scope.ApplicationManager.fullscreenEnabled = true;
        else $scope.ApplicationManager.fullscreenEnabled = false;

        if(toState.metaData.navigationEnabled) $scope.ApplicationManager.navigationEnabled = true;
        else $scope.ApplicationManager.navigationEnabled = false;

      });

    }

 ]);

/**
 * PControllers.navCtrl
 * Controller for the navigation bar
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger
 *   @dependency {Present} UserContextManager -- Provides methods for userContext management
 */

  PControllers.controller('navCtrl', ['$scope', '$state', 'logger', 'UserContextManager',

    function($scope, $state, logger, UserContextManager) {

      logger.test(['PControllers.navCtrl -- navigation controller initialized']);

      $scope.Navbar = {
        userContextMode : UserContextManager.getActiveUserContext()
      };

      $scope.$on('$stateChangeSuccess', function(event, toState, fromState) {
        $scope.Navbar.userContextMode = UserContextManager.getActiveUserContext();

      });

      $scope.logout = function() {
        UserContextManager.destroyActiveUserContext()
          .then(function() {
              $state.go('splash');
          });
      }

    }

  ]);

 /*
  * PControllers.splashController
  * Controller for splashing state
  *   @dependency {Angular} $scope
  *   @dependency {Utilities} logger
  *   @dependency {Present} ApplicationManager
  */

  PControllers.controller('splashCtrl', ['$scope', 'logger', 'ApplicationManager',

    function($scope, logger, ApplicationManager) {

      logger.debug(['PControllers.splashCtrl -- splash controller initialized']);

      $scope.message = 'Present!';

      $scope.staticContent = {
        title: "Present",
        appIcon: {
          source: 'assets/img/app-icon.png',
          alt: 'Present app icon'
        }
      };

    }

  ]);
