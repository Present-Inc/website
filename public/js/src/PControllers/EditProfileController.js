
/**
 * EditProfileController
 * @namespace
 */

PControllers.controller('EditProfileController', ['$scope', 'FeedbackModel', 'User',

	function($scope, FeedbackModel, User) {

		//TODO: finish this.....

		/** Initializes a new User instance on the Controller $scope **/
		$scope.User = User;

		$scope.Input = {
			full_name: User.profile.fullName,
			description: User.profile.description,
			gender: User.profile.gender,
			location: User.profile.location,
			website: User.profile.website,
			email: User.profile.email,
			phone_number: User.profile.phoneNumber
		};

		$scope.Feedback = FeedbackModel.create();

		$scope.genders = ['Male', 'Female'];


		/** Validation **/


	}

]);
