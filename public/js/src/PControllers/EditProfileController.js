
/**
 * EditProfileController
 * @namespace
 */

PControllers.controller('EditProfileController', ['$scope', 'invoke', 'MessageModel', 'UserContextManager', 'User',

	function($scope, invoke, MessageModel, UserContextManager, User) {

		/** Initializes a new User instance on the Controller $scope **/
		$scope.user = User;

		$scope.input = {
			full_name: User.profile.fullName,
			description: User.profile.description,
			gender: User.profile.gender,
			location: User.profile.location,
			website: User.profile.website,
			email: User.profile.email,
			phone_number: User.profile.phoneNumber
		};

		$scope.messages = {
			success: MessageModel.create('alert', 'success', {body: 'Saved!'})    ,
			error: MessageModel.create('alert', 'error')
		};

		$scope.genders = ['Male', 'Female'];

		$scope.invoke = invoke;

		function validateInput(input, error, msg) {
			if(input.$dirty && input.$error[error]) {
				$scope.messages.success.clear();
				$scope.messages[input.$name + '_' + error] = MessageModel.create('alert', 'error', {body: msg}, true);
			} else if($scope.messages[input.$name + '_' + error] && !input.$error[error]) {
				$scope.messages[input.$name + '_' + error].clear();
			}
		}

		$scope.$watchCollection('form.email', function(email) {
			validateInput(email, 'required', 'Email can not be blank');
			validateInput(email, 'email', 'Email is invalid');
		});

	}

]);
