/**
 * PControllers.discoverCtrl
 * View Controller for the discover state
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency {Present} FeedManager {PManagers}
 *   @dependency {Present} Feed <Object>
 */

  PControllers.controller('discoverCtrl', ['$scope', 'logger', 'FeedManager', 'Feed',

    function($scope, logger, FeedManager, Feed) {

      logger.debug(['PControllers.discoverCtrl -- initializing the Feed Manager', Feed]);

			if(Feed) {
				//Initialize Feed Manager on the controller scope
				$scope.FeedManager = FeedManager;
				$scope.FeedManager.type = 'discover';
				$scope.FeedManager.cursor = Feed.cursor;
				$scope.FeedManager.videoCells = Feed.videoCells;
			}

      //Refreshes the Feed
      $scope.refreshFeed = function() {
        $scope.FeedManager.loadVideos($scope.FeedManager.type, $scope.FeedManager.cursor)
          .then(function(newDiscoverFeed) {
            $scope.FeedManager.videos = newDiscoverFeed.videos;
            $scope.FeedManager.cursor = newDiscoverFeed.cursor;
          });
      }

    }

  ]);

/*
 * PControllers.homeCtrl
 * View Controller for the home state
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency FeedManager {PManagers}
 *   @dependency Feed <Object>
 *   @dependency Profile <Object>
 */

  PControllers.controller('homeCtrl', ['$scope', 'logger', 'FeedManager', 'Feed', 'Profile',

    function($scope, logger, FeedManager, Feed, Profile) {

      logger.debug(['PControllers.homeCtrl -- initializing Profile Data', Profile]);
      logger.debug(['PControllers.homeCtrl -- initializing the Feed Manager', Feed]);

      //Initialize Profile
      $scope.Profile = Profile;

			if(Feed) {
				//Initialize Feed Manager on the controller scope
				$scope.FeedManager = FeedManager;
				$scope.FeedManager.type = 'home';
				$scope.FeedManager.cursor = Feed.cursor;
				$scope.FeedManager.videoCells = Feed.videoCells;
			}

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
 * Application Manager handles all login functionality
 * 	@dependency $scope {Angular}
 */

  PControllers.controller('loginCtrl', ['$scope', function($scope) {
      $scope.username = '';
      $scope.password = '';
  }]);

/**
 * PControllers.mainCtrl
 * Highest level controller PresentWebApp
 * Acts as a buffer to the rootScope
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency ApplicationManager {PManagers}
 */

  PControllers.controller('mainCtrl', ['$scope', 'logger', 'ApplicationManager',

    function($scope, logger, ApplicationManager) {

      $scope.Application = ApplicationManager;

			$scope.$watch('Application');

			$scope.$watch('Application.user.active', function(user) {
				$scope.$broadcast('_newUserLoggedIn', user);
			});

      $scope.$on('$stateChangeStart', function(event, toState) {
				$scope.Application.authorize(event, toState);
      });

    }

 ]);

 /*
  * PControllers.splashController
  * Controller for splash state
  *   @dependency  $scope {Angular}
  *   @dependency  logger {PUtilites}
  */

  PControllers.controller('splashCtrl', ['$scope', 'logger',

    function($scope, logger) {

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
