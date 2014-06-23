/*
 * UserProfileController
 * @namespace
 */

PControllers.controller('UserProfileController', ['$scope', 'logger', 'Feed', 'User',

	function($scope, logger, Feed, User) {

		/** Initialize a new User instance on the Controller scope **/
		$scope.User = User;

		$scope.actions = {
			friendship : '',
			demand : '',
			group : 'Invite'
		};

		/** Initialize a new Feed instance on the Controller $scope **/
		$scope.Feed = Feed;

		$scope.$watch(Feed);

	}

]);
