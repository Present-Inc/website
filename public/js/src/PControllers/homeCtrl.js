/*
 * PControllers.homeCrtl
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
