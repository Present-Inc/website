
/**
 * EditProfileController
 * @namespace
 */

PControllers.controller('EditProfileController', ['$scope', 'User',

	function($scope, User) {

		/** Initializes a new User instance on the Controller $scope **/
		$scope.User = User;

		$scope.input = {
			full_name: User.profile.fullName,
			description: User.profile.description,
			gender: User.profile.gender,
			location: User.profile.location,
			website: User.profile.website,
			email: User.profile.email,
			phone_number: User.profile.phoneNumber
		};

		$scope.genders = ['Male', 'Female'];

		$scope.$watch(User);

		$scope.submit = function(input) {
			User.update(input)
				.then(function(msg) {
					console.log(msg);
				});
		};


	}

]);
