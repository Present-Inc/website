
/**
 * EditProfileController
 * @namespace
 */

PControllers.controller('EditProfileController', ['$scope', 'User',

	function($scope, User) {

		/** Initializes a new User instance on the Controller $scope **/
		$scope.User = User;
		$scope.$watch(User);

	}

]);
