/*
 * PControllers.loginCtrl
 * Application Manager handles all login functionality
 * 	@dependency $scope {Angular}
 */

	PControllers.controller('registerCtrl', ['$scope', 'UserModel', function($scope, UserModel) {

		$scope.input = {
			username: '',
			password: '',
			verifyPassword: '',
			email: ''
		};

		$scope.accountSuccessfullyRegistered = false;

		$scope.submit = function(input) {
			console.log(input);
			/**
			UserModel.registerNewUserAccount(input)
				.then(function() {
					$scope.accountSuccessfullyCreated = true;
				})
				.catch(function(msg) {
					//TODO: better user feedback
					alert(msg);
				});
			 **/
		};


	}]);
