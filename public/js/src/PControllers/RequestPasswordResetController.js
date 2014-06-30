/**
 * RequestPasswordResetController
 * @class
 */

PControllers.controller('RequestPasswordResetController', [ '$scope', 'invoke', 'UserModel', 'MessageModel',
	function($scope, invoke, UserModel, MessageModel) {

		$scope.UserModel = UserModel;
		$scope.input = {
			username: ''
		};
		$scope.messages = {
			success: MessageModel.create('alert', 'success', {body: 'Check your inbox!'}),
			error: MessageModel.create('alert', 'error')
		};
		$scope.invoke = invoke;

	}
]);