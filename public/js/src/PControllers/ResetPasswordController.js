/*
 * LoginController
 * @namespace
 */

PControllers.controller('ResetPasswordController', ['$scope', '$stateParams', 'UserModel',

	function($scope, $stateParams, UserModel) {


		$scope.UserModel = UserModel;

		$scope.user = {_id: $stateParams.user_id};
		$scope.token = $stateParams.password_reset_token;

		/** User Input **/

		$scope.input = {
			password: '',
			confirmPassword: ''
		};

		/** User Feedback **/
		$scope.feedback = {
			error : 'Something went wrong....'
		};

	}
]);
