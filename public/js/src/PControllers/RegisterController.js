/*
 * RegisterController
 * @namespace
 */

	PControllers.controller('RegisterController', ['$scope', '$stateParams', 'invoke', 'MessageModel', 'UserModel', 'UserContextManager',

			function($scope, $stateParams, invoke, MessageModel, UserModel, UserContextManager) {

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


				$scope.messages = {

					success: MessageModel.create('alert', 'primary', {
						title: 'Your account has been successfully created',
						options : [
							{
							 label: 'Download',
							 style: 'primary',
							 link: 'https://itunes.apple.com/us/app/present-share-the-present/id813743986?mt=8'
							}
						]
					}, false),

					error: MessageModel.create('alert', 'error')

				};

				$scope.invoke = invoke;


				function validateInput(input, error, msg) {
					if(input.$dirty && input.$error[error]) {
						$scope.messages[input.$name + '_' + error] = MessageModel.create('alert', 'error', {body: msg}, true);
					} else if($scope.messages[input.$name + '_' + error] && !input.$error[error]) {
						$scope.messages[input.$name + '_' + error].clear();
					}
				}



				/** Watch form fields, passing each through validation when they are modified **/

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
