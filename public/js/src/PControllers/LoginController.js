/*
 * LoginController
 * @namespace
 */

  PControllers.controller('LoginController', ['$scope', 'invoke', 'SessionModel',

		function($scope, invoke, SessionModel) {

			$scope.input = {
				username : '',
				password : ''
			};

			$scope.invoke = invoke;
			$scope.SessionModel = SessionModel;

  	}

	]);
