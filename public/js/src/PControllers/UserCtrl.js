/*
 * View Controller for the home state
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency FeedManager {PManagers}
 *   @dependency Feed <Object>
 *   @dependency Profile <Object>
 */

PControllers.controller('userCtrl', ['$scope', 'logger', 'Feed', 'User',

	function($scope, logger, Feed, User) {

		logger.debug('PControllers.homeCtrl -- initializing User Profile', User);
		logger.debug('PControllers.homeCtrl -- initializing the Feed Manager', Feed);

		//Initialize Profile
		$scope.User = User;
		$scope.Feed = Feed;

		$scope.$watch(Feed);

	}

]);
