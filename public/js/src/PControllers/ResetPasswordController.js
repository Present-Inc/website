/*
 * LoginController
 * @namespace
 */

PControllers.controller('ResetPasswordController', ['$scope', '$stateParams', 'invoke', 'UserModel', 'MessageModel',

	function($scope, $stateParams, invoke, UserModel, MessageModel) {


		$scope.UserModel = UserModel;

		$scope.messages = {
			success: MessageModel.create('alert', 'success', {body: 'Password successfully reset.'}),
			error: MessageModel.create('alert', 'error')
		};

		$scope.invoke = invoke;


		$scope.input = {
			password: '',
			confirmPassword: '',
			user_id: $stateParams.user_id,
			password_reset_token: $stateParams.password_reset_token
		};



	}
]);
