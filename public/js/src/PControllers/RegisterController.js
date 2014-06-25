/*
 * RegisterController
 * @namespace
 */

	PControllers.controller('RegisterController', ['$scope', '$stateParams', 'MessageModel', 'UserModel',

			function($scope, $stateParams, MessageModel, UserModel) {

				/** Initialize the UserModel on the Controller $scope **/
				$scope.UserModel = UserModel;


				/** User Input **/
				$scope.input = {
					username: '',
					password: '',
					confirmPassword: '',
					email: '',
					invite_id: $stateParams.invite_id,
					user_id: $stateParams.invite_user_id
				};


				$scope.messages = {};


				function validateInput(input, error, msg) {
					if(input.$dirty && input.$error[error]) {
						$scope.messages[input.$name + '_' + error] = MessageModel.create('panel', {body: msg}, true);
					} else if($scope.messages[input.$name + '_' + error] && !input.$error[error]) {
						$scope.messages[input.$name + '_' + error].clear();
					}
				}


				$scope.$watchCollection('form.username', function(username) {
					validateInput(username, 'required', 'Username can not be blank');
					validateInput(username, 'maxlength', 'Username must be between 1 - 20 characters');
				});

				$scope.$watchCollection('form.password', function(password) {
					validateInput(password, 'required', 'Password can not be blank');
				});

				$scope.$watchCollection('form.confirmPassword', function(confirmPassword) {
					validateInput(confirmPassword, 'matchPasswords', 'Passwords do not match');
				});

				$scope.$watchCollection('form.email', function(email) {
					validateInput(email, 'required', 'Email can not be blank');
					validateInput(email, 'email', 'Email is invalid');
				});




		}

	]);
