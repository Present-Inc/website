/*
 * UserProfileController
 * @namespace
 */

	PControllers.controller('UserProfileController', ['$scope', 'invoke', 'Feed', 'User',

		function($scope, invoke, Feed, User) {

			/** Initialize a new User instance on the Controller scope **/
			$scope.user = User;

			$scope.actions = {
				friendship : '',
				demand : '',
			};

			$scope.invoke = invoke;

		}

	]);
