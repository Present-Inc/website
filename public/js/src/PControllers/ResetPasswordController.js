/*
 * LoginController
 * @namespace
 */

PControllers.controller('ResetPasswordController', ['$scope', '$stateParams', 'UserModel', 'MessageModel',

	function($scope, $stateParams, UserModel, MessageModel) {


		$scope.UserModel = UserModel;

		$scope.messages = {
			success: MessageModel.create('panel'),
			error: MessageModel.create('panel')
		};

		/** User Input **/

		$scope.input = {
			password: '',
			confirmPassword: '',
			user_id: $stateParams.user_id,
			password_reset_token: $stateParams.password_reset_token
		};



	}
]);
