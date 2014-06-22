/*
 * LoginController
 * @namespace
 */

	PControllers.controller('RegisterController', ['$scope', 'UserModel', function($scope, UserModel) {

		/** Initialize the UserModel on the Controller $scope **/
		$scope.UserModel = UserModel;


		/** User Input **/
		$scope.input = {
			username: '',
			password: '',
			verifyPassword: '',
			email: ''
		};

		/** User Feedback **/
		$scope.feedback = {
			error : {
				missingUsername: 'Your username is required',
				invalidUsername: 'Username must be between 1 and 20 characters'
			}
		};

		/** Reveal the download link when true**/
		$scope.accountSuccessfullyRegistered = false;

		$scope.submit = function(input) {
			//TODO: Map controller submit function to the User registerNewAccount method to complete account creation
			console.log($scope.registerForm.email.$valid);
		};

	}]);
