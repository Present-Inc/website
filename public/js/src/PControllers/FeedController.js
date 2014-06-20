/**
 * PControllers.FeedController
 * View Controller for the discover state
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency {Present} FeedManager {PManagers}
 *   @dependency {Present} Feed <Object>
 */

  PControllers.controller('FeedController', ['$scope', 'logger', 'Feed',

    function($scope, logger, Feed) {

			$scope.Feed = Feed;
			$scope.$watch(Feed);

    }

  ]);
