/*
 * View Controller for the home state
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency FeedManager {PManagers}
 *   @dependency Feed <Object>
 *   @dependency Profile <Object>
 */

PControllers.controller('userCtrl', ['$scope', 'logger', 'Feed', 'Profile',

	function($scope, logger, Feed, Profile) {

		logger.debug('PControllers.homeCtrl -- initializing Profile Data', Profile);
		logger.debug('PControllers.homeCtrl -- initializing the Feed Manager', Feed);

		//Initialize Profile
		$scope.Profile = Profile;
		$scope.Feed = Feed;

		$scope.$watch(Feed);

	}

]);
