

PControllers.controller('EditProfileController', ['$scope', 'logger', 'User',

	function($scope, logger, User) {

		//Initialize Profile
		$scope.User = User;
		$scope.$watch(User);

	}

]);
