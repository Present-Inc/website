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
